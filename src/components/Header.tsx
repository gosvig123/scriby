'use client';
import { useState } from 'react';
import Link from 'next/link';
import LoginModal from './auth/LoginModal';
import { useRouter } from 'next/router';

const AvatarIcon = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    viewBox='0 0 24 24'
    stroke='currentColor'
    className='h-6 w-6'
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={2}
      d='M4 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6z'
    />
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={2}
      d='M8.5 10.5A1.5 1.5 0 0110 9h4a1.5 1.5 0 011.5 1.5v1a1.5 1.5 0 01-1.5 1.5h-4A1.5 1.5 0 018.5 11.5v-1zM7 17h10'
    />
  </svg>
);

export default function Header() {
  const router = useRouter();
  const fullUrl = router.asPath;

  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [userEmail, setUserEmail] = useState('test123');
  return (
    <div
      className={`flex flex-col overflow-hidden items-center justify-between p-5 ${
        isAuthenticated ? 'bg-transparent' : 'bg-white'
      }`}
    >
      <div className='flex justify-between items-center w-full'>
        <div>
          <Link href='/'>
            <h1>Logo</h1>
          </Link>
        </div>
        {!fullUrl.includes('dashboard') && (
          <Link href={'/dashboard'}>
            <button className='solidPurpleButton'>
              Go to My Dashboard
            </button>
          </Link>
        )}
        {isAuthenticated ? (
          <div className='flex items-center gap-5'>
            <span>{userEmail}</span>
            {
              <Link href='/settings'>
                <AvatarIcon />
              </Link>
            }
          </div>
        ) : (
          <div className='flex space-x-4 items-center gap-10'>
            <div className='flex space-x-7'>
              <Link href='/'>Home</Link>
              <Link href='/about'>About</Link>
              <Link href='/pricing'>Pricing</Link>
              <Link href='/contact'>Contact</Link>
            </div>
            <div className='flex space-x-4'>
              <Link href='/signup'>
                <button className='solidPurpleButton'>Sign up</button>
              </Link>
              <LoginModal />
            </div>
          </div>
        )}
      </div>
      {isAuthenticated && (
        <div className='border-b-2 border-solid p-2 border-gray-300 w-full'></div>
      )}
    </div>
  );
}
