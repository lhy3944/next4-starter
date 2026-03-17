"use client";

import { useChatStore } from "@/stores/chat-store";
import { ThreadItem } from "@/components/chat/ThreadItem";
import { Skeleton } from "@/components/ui/skeleton";
import { useCallback, useEffect, useRef, useState } from "react";

function ThreadListSkeleton() {
  return (
    <div className="flex flex-col gap-1.5 px-1">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex items-center gap-2 px-2.5 py-2">
          <Skeleton className="h-3.5 w-3.5 rounded shrink-0" />
          <Skeleton
            className="h-3.5 rounded"
            style={{ width: `${50 + Math.random() * 40}%` }}
          />
        </div>
      ))}
    </div>
  );
}

export function ThreadList() {
  const threads = useChatStore((s) => s.threads);
  const activeThreadId = useChatStore((s) => s.activeThreadId);
  const setActiveThread = useChatStore((s) => s.setActiveThread);
  const [isLoading, setIsLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const dragStartY = useRef(0);
  const dragStartScroll = useRef(0);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  const updateThumb = useCallback(() => {
    const el = scrollRef.current;
    const thumb = thumbRef.current;
    if (!el || !thumb) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    if (scrollHeight <= clientHeight) {
      thumb.style.opacity = "0";
      return;
    }
    const thumbHeight = Math.max(
      (clientHeight / scrollHeight) * clientHeight,
      24,
    );
    const thumbTop =
      (scrollTop / (scrollHeight - clientHeight)) *
      (clientHeight - thumbHeight);
    thumb.style.height = `${thumbHeight}px`;
    thumb.style.top = `${thumbTop}px`;
    thumb.style.opacity = isHovered || isDragging ? "1" : "0";
  }, [isHovered, isDragging]);

  useEffect(() => {
    updateThumb();
  }, [isHovered, isDragging, threads, isLoading, updateThumb]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateThumb, { passive: true });
    return () => el.removeEventListener("scroll", updateThumb);
  }, [updateThumb]);

  const handleThumbMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    dragStartY.current = e.clientY;
    dragStartScroll.current = scrollRef.current?.scrollTop ?? 0;
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const el = scrollRef.current;
      if (!el) return;
      const { scrollHeight, clientHeight } = el;
      const thumbHeight = Math.max(
        (clientHeight / scrollHeight) * clientHeight,
        24,
      );
      const scrollableRange = scrollHeight - clientHeight;
      const trackRange = clientHeight - thumbHeight;
      const deltaY = e.clientY - dragStartY.current;
      const scrollDelta = (deltaY / trackRange) * scrollableRange;
      el.scrollTop = dragStartScroll.current + scrollDelta;
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div
      className="scrollbar-fade flex-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { if (!isDragging) setIsHovered(false); }}
    >
      <div ref={scrollRef} className="scrollbar-fade-inner">
        {isLoading ? (
          <ThreadListSkeleton />
        ) : (
          <div className="flex flex-col gap-2">
            {threads.map((thread) => (
              <ThreadItem
                key={thread.id}
                thread={thread}
                isActive={thread.id === activeThreadId}
                onClick={() => setActiveThread(thread.id)}
              />
            ))}
          </div>
        )}
      </div>
      {/* Custom scrollbar thumb */}
      <div
        ref={thumbRef}
        onMouseDown={handleThumbMouseDown}
        className="absolute right-0 w-1.5 rounded-full bg-text-muted hover:bg-text-secondary cursor-pointer transition-opacity duration-300"
        style={{ opacity: 0 }}
      />
    </div>
  );
}
