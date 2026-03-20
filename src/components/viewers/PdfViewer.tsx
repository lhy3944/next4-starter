"use client";

interface PdfViewerProps {
  url: string;
}

export function PdfViewer({ url }: PdfViewerProps) {
  if (!url) {
    return (
      <div className="flex h-full items-center justify-center text-fg-secondary">
        PDF URL이 제공되지 않았습니다.
      </div>
    );
  }

  return (
    <iframe
      src={url}
      title="PDF Viewer"
      className="h-full w-full border-0"
    />
  );
}
