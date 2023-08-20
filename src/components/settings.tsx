// ProfileSettings.tsx
import React from 'react';

const ProfileSettings: React.FC = () => {
  return (
    <div className='w-full max-w-md mx-auto p-10 bg-white shadow-md rounded-lg'>
      <h2 className='text-2xl font-bold mb-5 text-center'>
        Profile Settings
      </h2>

      <form className='space-y-5'>
        <div>
          <label
            className='block text-gray-700 text-sm font-bold mb-2 text-center'
            htmlFor='email'
          >
            Email:
          </label>
          <input
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='email'
            type='email'
            placeholder='Email Address'
          />
        </div>

        <div>
          <label
            className='block text-gray-700 text-sm font-bold mb-2 text-center'
            htmlFor='current-password'
          >
            Current Password (for password change):
          </label>
          <input
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='current-password'
            type='password'
            placeholder='Current Password'
          />
        </div>

        <div>
          <label
            className='block text-gray-700 text-sm font-bold mb-2 text-center'
            htmlFor='new-password'
          >
            New Password:
          </label>
          <input
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='new-password'
            type='password'
            placeholder='New Password'
          />
        </div>

        <div className='mt-5 text-center'>
          <p>
            For billing information and queries, please{' '}
            <a
              href='/billing'
              className='text-blue-500 hover:underline'
            >
              visit our billing page
            </a>
            .
          </p>
        </div>

        <div className='flex justify-center mt-8'>
          <button className='solidPurpleButton'>Save Changes</button>
        </div>
      </form>
    </div>
  );
};

export default ProfileSettings;
