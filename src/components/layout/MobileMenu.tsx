'use client';

import { AppsDropdown } from '@/components/overlay/AppsDropdown';
import { LabsDialog, LabsTrigger } from '@/components/overlay/LabsDialog';
import { Logo } from '@/components/shared/Logo';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { headerTabsConfig } from '@/config/navigation';
import { cn } from '@/lib/utils';
import { Menu } from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export function MobileMenu() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const [labsOpen, setLabsOpen] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <>
      <Drawer direction="left" open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-icon-default hover:text-icon-active hover:bg-canvas-surface"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </DrawerTrigger>
        <DrawerContent className="w-[280px] sm:w-[320px] p-0 flex flex-col border-r-line-primary bg-canvas-primary h-full">
          <DrawerHeader className="p-4 border-b border-line-primary text-left">
            <DrawerTitle asChild>
              <div
                onClick={() => setOpen(false)}
                className="cursor-pointer inline-block"
              >
                <Logo showName={true} />
              </div>
            </DrawerTitle>
            <DrawerDescription />
          </DrawerHeader>
          {/* Navigation */}
          <div className="flex flex-col py-4 flex-1">
            {headerTabsConfig.map((tab) => {
              const isActive = pathname.startsWith(tab.href);
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-6 py-4 text-sm font-medium transition-colors hover:bg-canvas-secondary hover:text-fg-primary',
                    isActive
                      ? 'bg-canvas-surface text-accent-primary border-r-4 border-accent-primary'
                      : 'text-fg-secondary',
                  )}
                >
                  <tab.icon
                    className={cn('h-5 w-5', isActive && 'text-accent-primary')}
                  />
                  {tab.label}
                </Link>
              );
            })}
          </div>

          {/* Bottom */}
          <div className="p-4 border-t border-line-primary flex items-center gap-2">
            <AppsDropdown contentClassName="bottom-12 left-0 origin-bottom-left" />
            <LabsTrigger onClick={() => setLabsOpen(true)} />
            <ThemeToggle
              checked={resolvedTheme === 'dark'}
              onCheckedChange={() =>
                setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
              }
            />
          </div>
        </DrawerContent>
      </Drawer>

      <LabsDialog open={labsOpen} onOpenChange={setLabsOpen} />
    </>
  );
}
