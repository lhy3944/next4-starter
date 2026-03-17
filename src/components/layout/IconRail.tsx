'use client';

import {
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  SlidersHorizontal,
  Calendar,
  CircleHelp,
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { usePanelStore } from '@/stores/panel-store';

const bottomIcons = [
  { icon: SlidersHorizontal, label: '설정' },
  { icon: Calendar, label: '캘린더' },
  { icon: CircleHelp, label: '도움말' },
];

export function IconRail() {
  const leftSidebarOpen = usePanelStore((s) => s.leftSidebarOpen);
  const toggleLeftSidebar = usePanelStore((s) => s.toggleLeftSidebar);

  const SidebarIcon = leftSidebarOpen ? PanelLeftClose : PanelLeftOpen;
  const sidebarLabel = leftSidebarOpen ? '사이드바 닫기' : '사이드바 열기';

  return (
    <div className='flex w-15 h-full flex-col items-center justify-between border-r bg-sidebar-bg py-4'>
      <div className='flex flex-col items-center gap-2'>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={toggleLeftSidebar}
              variant='ghost'
              size='icon'
              className='h-9 w-9 text-icon-default hover:text-icon-active'
            >
              <SidebarIcon className='h-5 w-5' />
            </Button>
          </TooltipTrigger>
          <TooltipContent side='right'>{sidebarLabel}</TooltipContent>
        </Tooltip>
        {!leftSidebarOpen && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant='ghost'
                size='icon'
                className='h-9 w-9 text-icon-default hover:text-icon-active'
              >
                <Plus className='h-5 w-5' />
              </Button>
            </TooltipTrigger>
            <TooltipContent side='right'>새 항목</TooltipContent>
          </Tooltip>
        )}
      </div>
      {!leftSidebarOpen && (
        <div className='flex flex-col items-center gap-2'>
          {bottomIcons.map(({ icon: Icon, label }) => (
            <Tooltip key={label}>
              <TooltipTrigger asChild>
                <Button
                  variant='ghost'
                  size='icon'
                  className='h-9 w-9 text-icon-default hover:text-icon-active'
                >
                  <Icon className='h-5 w-5' />
                </Button>
              </TooltipTrigger>
              <TooltipContent side='right'>{label}</TooltipContent>
            </Tooltip>
          ))}
        </div>
      )}
    </div>
  );
}
