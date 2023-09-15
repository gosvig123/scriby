import PaymentModal from './payment/PaymentModal';
interface IUser {
  email: string;
  userId: number;
  iat: number;
  credits: number;
}

import { useEffect, useState } from 'react';
export default function DashboardSubHeader() {
  const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);
  const [user, setUser] = useState<IUser | undefined>();
  useEffect(() => {
    async function getMyUser() {
      const response = await fetch('/api/user/myuser', {
        method: 'GET',
        credentials: 'include',
      });
      const data = await response.json();
      setUser(data);
    }
    getMyUser();
  }, []);


  return (
    <div className='w-full flex flex-auto px-5 '>
      <div className='w-full gap-5   bg-white text-center items-center px-4 py-4 flex flex-auto justify-between rounded-lg shadow-lg'>
        <h1 className='text-2xl font-mono font-bold'>Dashboard</h1>
        <p className='text-lg '>
          You currently have ${user?.credits || ''} credits. {}{' '}
          minutes remaining.
        </p>
        <button
          className='solidGreenButton'
          onClick={() => setPaymentModalOpen(true)}
        >
          Buy Credits
        </button>
      </div>
      <div>
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setPaymentModalOpen(false)}
        />{' '}
      </div>
    </div>
  );
}
