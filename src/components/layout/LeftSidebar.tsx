'use client';

import { ThreadList } from '@/components/chat/ThreadList';
import { useChatStore } from '@/stores/chat-store';
import { usePanelStore } from '@/stores/panel-store';
import {
  Calendar,
  Info,
  PanelLeftClose,
  Plus,
  SlidersHorizontal,
} from 'lucide-react';
import { Button } from '../ui/button';

export function LeftSidebar() {
  const createThread = useChatStore((s) => s.createThread);
  const toggleLeftSidebar = usePanelStore((s) => s.toggleLeftSidebar);

  return (
    <div className='flex h-full w-[220px] shrink-0 flex-col gap-2 bg-sidebar-bg px-3 py-4'>
      <div className='flex items-center justify-between'>
        <Button
          onClick={createThread}
          className='flex items-center gap-1.5 text-text-primary'
          variant={'ghost'}
        >
          <Plus className='h-5 w-5' />
          <span className='text-[13px] font-medium'>새 채팅</span>
        </Button>
        <Button
          onClick={toggleLeftSidebar}
          variant='ghost'
          size='icon'
          className='text-icon-default hover:text-icon-active'
        >
          <PanelLeftClose className='h-5 w-5' />
        </Button>
      </div>

      <ThreadList />

      <div className='mt-auto flex items-center justify-center gap-4 border-t border-border-primary pt-3'>
        <Button
          variant='ghost'
          size='icon'
          className='text-icon-default hover:text-icon-active'
        >
          <SlidersHorizontal className='h-5 w-5' />
        </Button>
        <Button
          variant='ghost'
          size='icon'
          className='text-icon-default hover:text-icon-active'
        >
          <Calendar className='h-5 w-5' />
        </Button>
        <Button
          variant='ghost'
          size='icon'
          className='text-icon-default hover:text-icon-active'
        >
          <Info className='h-5 w-5' />
        </Button>
      </div>
    </div>
  );
}
