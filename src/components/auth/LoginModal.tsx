'use client';
import { FormEvent, useEffect, useState } from 'react';

import dynamic from 'next/dynamic';
const GoogleLogin = dynamic(() => import('./GoogleLogin'), {
  ssr: false,
});
const clientId =
  '358155175620-tmo0ped23qte9gpnv4dovqr1i6tj11r6.apps.googleusercontent.com';

export default function () {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Logged in:', data);
        setIsOpen(false);
      } else {
        const data = await response.json();
        console.error('Login error:', data.error);
        // handle login failure here
      }
    } catch (error) {
      console.error('An error occurred:', error);
      // handle fetch error here
    }
  };
  const handleGoogleLogin = async (googleId: string) => {
    login({ googleId });
  };

  const login = async ({
    email,
    password,
    googleId,
  }: {
    email?: string;
    password?: string;
    googleId?: string;
  }) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, googleId }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Logged in:', data);
        setIsOpen(false);
        // handle login success here
      } else {
        const data = await response.json();
        console.error('Login error:', data.error);
        // handle login failure here
      }
    } catch (error) {
      console.error('An error occurred:', error);
      // handle fetch error here
    }
  };

  return (
    <div className=' justify-center items-center p-2 transparentPurpleButton'>
      <button onClick={() => setIsOpen(true)}>Login</button>

      {isOpen && (
        <div
          className='fixed top-0 left-0 w-full h-full flex items-center justify-center'
          style={{ background: 'rgba(0, 0, 0, .8)' }}
        >
          <div className='relative w-4/6 h-4/5 bg-white text-center items-center px-32 py-10 flex flex-col justify-around rounded-lg shadow-lg'>
            <button
              style={{
                position: 'absolute',
                right: 20,
                top: 20,
                fontSize: '2rem',
              }}
              onClick={() => setIsOpen(false)}
            >
              &times;
            </button>
            <div className='flex flex-col w-full '>
              <h1 className='text-3xl font-sans font-bold'>Login</h1>
              <p className='text-sm text-gray-500 mt-3'>
                Login with Google or use the form to access your
                account.
              </p>
            </div>
            <GoogleLogin onSuccess={handleGoogleLogin} />
            <div className='w-full flex flex-col '>
              <form
                className='flex flex-col gap-5 text-left'
                onSubmit={handleLogin}
              >
                <label>
                  Email
                  <input
                    type='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder='Enter your email'
                    className='mt-1 w-full bg-[#ECECECFF] p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500'
                  />
                </label>
                <label>
                  Password
                  <input
                    type='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder='Enter your password'
                    className='mt-1 w-full bg-[#ECECECFF] p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500'
                  />
                </label>
                <button
                  className='w-full solidPurpleButton'
                  type='submit'
                >
                  Login
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
