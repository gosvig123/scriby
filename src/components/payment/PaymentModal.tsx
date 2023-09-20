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
import { useState } from 'react';
interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const PaymentModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [clientSecret, setClientSecret] = useState<string | null>(
    null
  );
  const [hours, setHours] = useState(10);
  const [price, setPrice] = useState(6);
  const [showCardDetails, setShowCardDetails] = useState(false);

  function close() {
    setShowCardDetails(false);
    onClose();
  }

  if (!isOpen) return null;

  async function showCardDetailsHandler() {
    const totalPrice = price * hours;
    const response = await fetch('/api/createpayment', {
      // Change the endpoint to your server API
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ totalPrice }),
    });

    const data = await response.json();


    setClientSecret(data.clientSecret);

    setShowCardDetails(true);
  }

  return (
    <div className='fixed inset-0 flex items-center justify-center z-50'>
      <div className='bg-white p-8 rounded-lg shadow-lg w-5/6 z-10'>
        <button onClick={close} className='float-right'>
          Close
        </button>
        <h2 className='text-2xl mb-4'>Complete Your Purchase</h2>
        <div className='flex items-end'>
          <div className='flex flex-col items-center justify-center w-full gap-2 p-3 border rounded-lg border-gray-300'>
            {showCardDetails === false && (
              <>
                <ButtonCounter hours={hours} setHours={setHours} />
                <Slider hours={hours} setHours={setHours} />
              </>
            )}
            <PricingCard
              price={price}
              hours={hours}
              setPrice={setPrice}
              onButtonClick={showCardDetailsHandler}
              showCardDetails={showCardDetails}
            />
          </div>
          {showCardDetails && (
            <Elements stripe={stripePromise}>
              <CheckoutForm
                price={price}
                hours={hours}
                clientSecret={clientSecret}
                onClose={close}
              />
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
