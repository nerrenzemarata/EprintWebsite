import { FileText } from "lucide-react";
import type { DocumentRow } from "@/lib/domain";

const kb = (n: number) => (n >= 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`);

// `urls` maps a storage path to a short-lived signed link (see signedUrls()).
export default function DocumentList({
  documents,
  urls,
  empty = "No files uploaded yet.",
}: {
  documents: DocumentRow[];
  urls: Map<string, string>;
  empty?: string;
}) {
  if (documents.length === 0) {
    return <p className="text-sm text-brand-slate">{empty}</p>;
  }

  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {documents.map((doc) => {
        const url = urls.get(doc.path);
        const isImage = doc.mime_type.startsWith("image/");
        return (
          <li key={doc.id} className="overflow-hidden rounded-2xl border border-black/10 bg-white">
            {url ? (
              <a href={url} target="_blank" rel="noopener noreferrer" className="block">
                {isImage ? (
                  // Signed, expiring URL: next/image's optimizer can't cache it.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={url} alt={doc.filename} className="aspect-[4/3] w-full object-cover" loading="lazy" />
                ) : (
                  <div className="flex aspect-[4/3] items-center justify-center bg-brand-blue-light text-brand-blue">
                    <FileText size={32} />
                  </div>
                )}
              </a>
            ) : (
              <div className="flex aspect-[4/3] items-center justify-center bg-black/5 text-xs text-brand-slate">
                Preview unavailable
              </div>
            )}
            <div className="px-3 py-2">
              <p className="truncate text-xs font-medium text-brand-ink" title={doc.filename}>
                {doc.filename}
              </p>
              <p className="text-[11px] text-brand-slate">
                {doc.kind === "location_photo" ? "Location picture" : "Supporting file"} · {kb(doc.size_bytes)}
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
