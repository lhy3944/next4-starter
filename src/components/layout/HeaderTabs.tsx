'use client';

import { headerTabsConfig } from '@/config/navigation';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function HeaderTabs() {
  const pathname = usePathname();

  return (
    <div className='absolute left-1/2 -translate-x-1/2 hidden lg:flex items-center space-x-1'>
      {headerTabsConfig.map((tab) => {
        const isActive = pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              'group rounded-sm px-6 py-4 text-sm hover:bg-secondary',
              isActive && 'bg-canvas-surface',
            )}
          >
            <div className='flex items-center gap-2 transition-transform duration-150 group-hover:-translate-y-0.5'>
              <tab.icon
                className={cn('h-5 w-5', isActive && 'text-accent-primary')}
              />
              <span className='font-medium tracking-wide'>{tab.label}</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
