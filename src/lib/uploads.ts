import type { Supa } from "@/lib/supabase/server";

export const MAX_FILE_BYTES = 5 * 1024 * 1024;
export const FILE_HINT = "JPG, PNG, WEBP or PDF, up to 5 MB each";

type Detected = { mime: string; ext: string };
export type ValidFile = { name: string; bytes: Uint8Array; type: Detected };
export type UploadedFile = { path: string; filename: string; mime: string; size: number };

const ascii = (b: Uint8Array, from: number, to: number) =>
  String.fromCharCode(...b.subarray(from, to));

// Identify the file from its actual bytes: the name and the browser-reported type
// are chosen by the uploader and can't be trusted.
export function detectType(b: Uint8Array): Detected | null {
  if (b.length >= 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) {
    return { mime: "image/jpeg", ext: "jpg" };
  }
  if (
    b.length >= 8 &&
    b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47 &&
    b[4] === 0x0d && b[5] === 0x0a && b[6] === 0x1a && b[7] === 0x0a
  ) {
    return { mime: "image/png", ext: "png" };
  }
  if (b.length >= 12 && ascii(b, 0, 4) === "RIFF" && ascii(b, 8, 12) === "WEBP") {
    return { mime: "image/webp", ext: "webp" };
  }
  if (b.length >= 5 && ascii(b, 0, 5) === "%PDF-") {
    return { mime: "application/pdf", ext: "pdf" };
  }
  return null;
}

// Browsers send an empty, nameless file when the input was left blank.
export function pickFiles(formData: FormData, field: string): File[] {
  return formData
    .getAll(field)
    .filter((v): v is File => typeof v !== "string" && v.size > 0);
}

export function safeName(name: string) {
  return name.replace(/[\\/\u0000-\u001f]/g, "").trim().slice(-100) || "file";
}

export async function validateFiles(
  files: File[],
  opts: { min?: number; max: number; imagesOnly?: boolean; label: string },
): Promise<{ ok: true; files: ValidFile[] } | { ok: false; message: string }> {
  const { min = 0, max, imagesOnly = false, label } = opts;

  if (files.length < min) {
    return { ok: false, message: `${label}: please add at least ${min} file${min > 1 ? "s" : ""}.` };
  }
  if (files.length > max) {
    return { ok: false, message: `${label}: you can add up to ${max} files.` };
  }

  const valid: ValidFile[] = [];
  for (const file of files) {
    if (file.size > MAX_FILE_BYTES) {
      return { ok: false, message: `“${safeName(file.name)}” is larger than 5 MB.` };
    }
    const bytes = new Uint8Array(await file.arrayBuffer());
    const type = detectType(bytes);
    if (!type || (imagesOnly && type.mime === "application/pdf")) {
      return {
        ok: false,
        message: `“${safeName(file.name)}” isn't supported. ${
          imagesOnly ? "Use a JPG, PNG or WEBP image." : `Use ${FILE_HINT}.`
        }`,
      };
    }
    valid.push({ name: file.name, bytes, type });
  }
  return { ok: true, files: valid };
}

export async function removeFiles(supabase: Supa, bucket: string, paths: string[]) {
  if (paths.length === 0) return;
  // Best effort: a failed cleanup must not hide the original error.
  await supabase.storage.from(bucket).remove(paths).catch(() => {});
}

// Random file names (never the uploader's) under `<user id>/...`, which is the
// folder the storage policies let this user write to.
export async function uploadFiles(
  supabase: Supa,
  bucket: string,
  prefix: string,
  files: ValidFile[],
): Promise<{ ok: true; uploaded: UploadedFile[] } | { ok: false }> {
  const uploaded: UploadedFile[] = [];
  for (const file of files) {
    const path = `${prefix}/${crypto.randomUUID()}.${file.type.ext}`;
    const { error } = await supabase.storage
      .from(bucket)
      .upload(path, file.bytes, { contentType: file.type.mime, upsert: false });
    if (error) {
      console.error("[upload] failed:", error.message);
      await removeFiles(supabase, bucket, uploaded.map((u) => u.path));
      return { ok: false };
    }
    uploaded.push({
      path,
      filename: safeName(file.name),
      mime: file.type.mime,
      size: file.bytes.byteLength,
    });
  }
  return { ok: true, uploaded };
}

// Short-lived links for showing private files (admins and owners only reach this).
export async function signedUrls(supabase: Supa, bucket: string, paths: string[], seconds = 300) {
  const map = new Map<string, string>();
  if (paths.length === 0) return map;
  const { data } = await supabase.storage.from(bucket).createSignedUrls(paths, seconds);
  for (const item of data ?? []) {
    if (item.path && item.signedUrl) map.set(item.path, item.signedUrl);
  }
  return map;
}
