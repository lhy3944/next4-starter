"use client";

import { cn } from "@/lib/utils";

interface ResizeHandleProps {
  isOpen?: boolean;
  onPointerDown: (e: React.MouseEvent | React.TouchEvent) => void;
}

export function ResizeHandle({ isOpen = false, onPointerDown }: ResizeHandleProps) {
  return (
    <div
      onMouseDown={onPointerDown}
      onTouchStart={onPointerDown}
      className={cn(
        "absolute left-0 top-0 h-full w-4 -translate-x-1/2 cursor-col-resize select-none z-10",
        "group flex items-center justify-center",
        "hover:bg-border/30 transition-colors duration-150",
      )}
    >
      <div
        className={cn(
          "h-full w-px transition-all duration-150",
          isOpen
            ? "bg-line-primary group-hover:bg-accent-primary"
            : "opacity-0 bg-accent-primary group-hover:opacity-100",
        )}
      />
    </div>
  );
}
