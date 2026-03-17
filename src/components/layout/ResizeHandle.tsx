"use client";

interface ResizeHandleProps {
  onPointerDown: (e: React.PointerEvent) => void;
}

export function ResizeHandle({ onPointerDown }: ResizeHandleProps) {
  return (
    <div
      onPointerDown={onPointerDown}
      className="group flex w-1 cursor-col-resize items-center justify-center hover:w-2 transition-all"
    >
      <div className="h-full w-px bg-line-primary group-hover:bg-accent-primary transition-colors" />
    </div>
  );
}
