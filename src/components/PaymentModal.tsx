import React from 'react';
import CheckoutForm from './CheckoutForm';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
const stripePromise = loadStripe(
  'pk_test_51NmCIqCGmGe8KoMAJMokNwcKduvYjpunINiubvC8pI0OR68BtfC41tZ0hnvypZY3RpdrCBZAZHTFWqfPBcZgDDzu00V1Yhyamk'
);

interface Props {
  isOpen: boolean;
  onClose: () => void;
  price: number;
}

const PaymentModal: React.FC<Props> = ({
  isOpen,
  onClose,
  price,
}) => {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 flex items-center justify-center z-50'>
      <div className='bg-white p-8 rounded-lg shadow-lg w-1/2 z-10'>
        <button onClick={onClose} className='float-right'>
          Close
        </button>
        <h2 className='text-2xl mb-4'>Complete Your Payment</h2>
        <Elements stripe={stripePromise}>
          <CheckoutForm price={price} />
        </Elements>
      </div>
      <div
        className='fixed inset-0 bg-black opacity-50 z-0'
        onClick={onClose}
      ></div>
    </div>
  );
};

export default PaymentModal;
