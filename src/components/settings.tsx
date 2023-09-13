import React, { useState, forwardRef } from 'react';
import Link from 'next/link';
interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        className={`flex h-9 w-full rounded-md border border-white bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-500 disabled:cursor-not-allowed disabled:opacity-50 ${
          className || ''
        }`}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

interface IUser {
  email: string;
  userId: number;
  iat: number;
}

interface settingsProps {
  user: IUser;
}

const ProfileSettings: React.FC<settingsProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState('General');
  const [email, setEmail] = useState(user.email);
  const [newEmail, setNewEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handlePasswordChange = () => {
    if (!currentPassword) {
      alert('Please enter your current password.');
      return;
    }
    if (newPassword !== confirmPassword) {
      alert('New password and confirm password do not match.');
      return;
    }
    if (newPassword && currentPassword) {
      alert('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  const handleEmailChange = () => {
    if (!currentPassword) {
      alert('Please enter your current password to change email.');
      return;
    }
    if (newEmail) {
      setEmail(newEmail);
      setNewEmail('');
      alert('Email updated successfully!');
    }
  };

  return (
    <div className='flex w-full max-w-7xl mx-auto p-10 bg-gradient-to-b from-gray-500 to-gray-600 shadow-md rounded-lg text-white'>
      {/* Vertical Menu */}
      <div className='w-1/4 pr-10 border-r border-gray-300'>
        <ul className='space-y-4'>
          {['General', '', ''].map((tab) => (
            <li key={tab}>
              <button
                className={`w-full text-left px-3 py-2 rounded ${
                  activeTab === tab
                    ? 'bg-purple-500'
                    : 'bg-transparent'
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Content */}
      <div className='w-3/4 pl-10'>
        {activeTab === 'General' && (
          <>
            <h2 className='text-2xl font-bold mb-5'>
              General Settings
            </h2>
            <div className='mb-4'>
              <label className='block mb-2' htmlFor='currentEmail'>
                Current Email:
              </label>
              <Input
                id='currentEmail'
                type='email'
                value={email}
                readOnly
              />
            </div>

            <div className='mb-4'>
              <label className='block mb-2' htmlFor='currentPassword'>
                Current Password:
              </label>
              <Input
                id='current Password'
                type='password'
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div className='mb-4'>
              <label className='block mb-2' htmlFor='newPassword'>
                New Password:
              </label>
              <Input
                id='newPassword'
                type='password'
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className='mb-4'>
              <label className='block mb-2' htmlFor='confirmPassword'>
                Confirm New Password:
              </label>
              <Input
                id='confirmPassword'
                type='password'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button
              className='solidPurpleButton'
              onClick={handlePasswordChange}
            >
              Update Password
            </button>
            <Link href='/dashboard'>
              <button className='solidGreenButton ml-2'>
                back to dashboard
              </button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileSettings;
