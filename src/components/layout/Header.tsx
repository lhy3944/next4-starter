"use client";

import { HeaderActions } from "@/components/layout/HeaderActions";
import { HeaderTabs } from "@/components/layout/HeaderTabs";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { Logo } from "@/components/shared/Logo";
import { cn } from "@/lib/utils";
import { usePanelStore } from "@/stores/panel-store";

interface HeaderProps {
  showLayoutToggle?: boolean;
}

export function Header({ showLayoutToggle = false }: HeaderProps) {
  const fullWidthMode = usePanelStore((s) => s.fullWidthMode);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 flex h-15 shrink-0 items-center border-b border-line-primary backdrop-blur-xl",
      )}
    >
      <div
        className={cn(
          "w-full mx-auto px-2 sm:px-6 lg:px-8 h-full flex items-center justify-between transition-[max-width] duration-300 ease-in-out",
          fullWidthMode ? "max-w-full" : "max-w-6xl",
        )}
      >
        <div className="flex flex-1 items-center">
          <MobileMenu />
          <Logo />
        </div>

        <div className="flex flex-1 justify-center items-center">
          <HeaderTabs />
        </div>

        <div className="flex flex-1 items-center justify-end gap-1">
          <HeaderActions showLayoutToggle={showLayoutToggle} />
        </div>
      </div>
    </header>
  );
}
