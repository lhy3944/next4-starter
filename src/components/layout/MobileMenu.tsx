'use client';

import { AppsDropdown } from '@/components/overlay/AppsDropdown';
import { LabsDialog, LabsTrigger } from '@/components/overlay/LabsDialog';
import { Logo } from '@/components/shared/Logo';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
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
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant='ghost'
            size='icon'
            className='lg:hidden text-icon-default hover:text-icon-active hover:bg-bg-surface'
          >
            <Menu className='h-5 w-5' />
            <span className='sr-only'>Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent
          side='left'
          className='w-[280px] sm:w-[320px] p-0 flex flex-col border-r-border-primary bg-bg-primary'
        >
          <SheetHeader className='p-4 border-b border-border-primary text-left'>
            <SheetTitle asChild>
              <div
                onClick={() => setOpen(false)}
                className='cursor-pointer inline-block'
              >
                <Logo showName={true} />
              </div>
            </SheetTitle>
          </SheetHeader>
          <div className='flex flex-col py-4 flex-1'>
            {headerTabsConfig.map((tab) => {
              const isActive = pathname.startsWith(tab.href);
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-6 py-4 text-sm font-medium transition-colors hover:bg-bg-secondary hover:text-text-primary',
                    isActive
                      ? 'bg-bg-surface text-accent-primary border-r-4 border-accent-primary'
                      : 'text-text-secondary',
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

          <div className='p-4 border-t border-border-primary flex items-center gap-2'>
            <AppsDropdown contentClassName='bottom-12 left-0 origin-bottom-left' />
            <LabsTrigger onClick={() => setLabsOpen(true)} />
            <ThemeToggle
              checked={resolvedTheme === 'dark'}
              onCheckedChange={() =>
                setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
              }
            />
          </div>
        </SheetContent>
      </Sheet>

      <LabsDialog open={labsOpen} onOpenChange={setLabsOpen} />
    </>
  );
}
