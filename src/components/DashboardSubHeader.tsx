import PaymentModal from './PaymentModal';

import { useState } from 'react';
export default function DashboardSubHeader() {
  const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);
  const price = 4500;
  //TODO get user minutes
  //TODO get price
  return (
    <div className='w-full flex flex-auto px-5 '>
      <div className='w-full gap-5   bg-white text-center items-center px-4 py-4 flex flex-auto justify-between rounded-lg shadow-lg'>
        <h1 className='text-2xl font-mono font-bold'>Dashboard</h1>
        <p className='text-lg '>
          You currently have x minutes remaining.
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
          price={price}
        />{' '}
      </div>
    </div>
  );
}
