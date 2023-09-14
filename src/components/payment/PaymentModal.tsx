import React, { useEffect } from 'react';
import CheckoutForm from './CheckoutForm';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import ButtonCounter from '../ButtonCounter';
import Slider from '../PricingSlider';
import PricingCard from '../PricingCard';
const stripePromise = loadStripe(
  'pk_test_51NmCIqCGmGe8KoMAJMokNwcKduvYjpunINiubvC8pI0OR68BtfC41tZ0hnvypZY3RpdrCBZAZHTFWqfPBcZgDDzu00V1Yhyamk'
);

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const PaymentModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  const [hours, setHours] = React.useState(10);
  const [price, setPrice] = React.useState(6);
  const [showCardDetails, setShowCardDetails] = React.useState(false);
  function showCardDetailsHandler() {
    setShowCardDetails(true);
  }

  return (
    <div className='fixed inset-0 flex items-center justify-center z-50'>
      <div className='bg-white p-8 rounded-lg shadow-lg w-5/6 z-10'>
        <button onClick={onClose} className='float-right'>
          Close
        </button>
        <h2 className='text-2xl mb-4'>Complete Your Purchase</h2>
        <div className='flex items-center'>
          <div className='flex flex-col items-center justify-center w-full gap-2 p-3 border rounded-lg border-gray-300'>
            <ButtonCounter hours={hours} setHours={setHours} />
            <Slider hours={hours} setHours={setHours} />
            <PricingCard
              price={price}
              hours={hours}
              setPrice={setPrice}
              onButtonClick={showCardDetailsHandler}
            />
          </div>
          {showCardDetails && (
            <Elements stripe={stripePromise}>
              <CheckoutForm price={price} hours={hours} />
            </Elements>
          )}
        </div>
      </div>
      <div
        className='fixed inset-0 bg-black opacity-50 z-0'
        onClick={onClose}
      ></div>
    </div>
  );
};

export default PaymentModal;
