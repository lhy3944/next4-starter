'use client';

import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  showName?: boolean;
}

export function Logo({ showName = false }: LogoProps) {
  return (
    <Link href='/' className='flex items-center gap-2'>
      {/* 라이트 모드 로고 */}
      <Image
        src='/logo_icon_light.png'
        alt='AISE logo'
        width={36}
        height={36}
        priority
        className='dark:hidden'
        style={{ width: 36, height: 36 }}
      />

      {/* 다크 모드 로고 */}
      <Image
        src='/logo_icon.png'
        alt='AISE logo'
        width={36}
        height={36}
        priority
        className='hidden dark:block'
        style={{ width: 36, height: 36 }}
      />
      <div className={`relative items-center ml-1 ${showName ? 'flex' : 'hidden md:flex'}`}>
        <span className='text-2xl font-bold'>AISE</span>
        <span className='text-lg font-bold absolute -top-1.5 -right-3.5'>
          +
        </span>
      </div>
    </Link>
  );
}
