import React, { useEffect, useState } from 'react';
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

interface Props {
  price: number;
}

const clientSecret =
  'sk_test_51MWlLsGBL31qIrQExIrjz7aRXJWxfirJB6ABrOzfsccq55HZ3SNYIlDYP66Jv0pLk7WXq1eJkqaKFUlf0VoRnd0600sG0s3rKS';
export default function CheckoutForm({ price }: Props) {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [clientSecret, setClientSecret] = useState<string | null>(
    null
  );

  useEffect(() => {
    // Fetch the client secret from the server
    
    async function fetchClientSecret() {
      const response = await fetch('/api/createpayment', {
        // Change the endpoint to your server API
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ price }),
      });

      const data = await response.json();

      setClientSecret(data.clientSecret);
    }

    fetchClientSecret();
  }, [price]);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      setMessage('Payment cannot be processed at this time.');
      return;
    }

    setIsLoading(true);

    const cardElement = elements.getElement(CardNumberElement);

    if (!cardElement) {
      setMessage('Payment cannot be processed at this time.');
      setIsLoading(false);
      return;
    }

    const { error, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: cardElement,
        },
      }
    );

    if (error) {
      setMessage(error.message || 'An unexpected error occurred.');
    } else if (paymentIntent?.status === 'succeeded') {
      setMessage('Payment succeeded!');
    } else {
      setMessage('Payment failed, please try again.');
    }

    setIsLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='w-full max-w-md mx-auto p-8 space-y-4 bg-white shadow-lg rounded-xl'
    >
      <div className='bg-gray-200 rounded-lg p-2'>
        <label className='block'>
          <p className='text-lg text-gray-700 mb-1'>Card Number</p>
          <CardNumberElement
            className='focus:outline-none w-full p-2 rounded-lg bg-transparent'
            options={{
              style: {
                base: {
                  fontSize: '20px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
              },
            }}
          />
        </label>
      </div>
      <div className='bg-gray-200 rounded-lg p-2'>
        <label className='block'>
          <p className='text-lg text-gray-700 mb-1'>
            Expiration Date
          </p>
          <CardExpiryElement
            className='focus:outline-none w-full p-2 rounded-lg bg-transparent'
            options={{
              style: {
                base: {
                  fontSize: '20px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
              },
            }}
          />
        </label>
      </div>
      <div className='bg-gray-200 rounded-lg p-2'>
        <label className='block'>
          <p className='text-lg text-gray-700 mb-1'>CVC</p>
          <CardCvcElement
            className='focus:outline-none w-full p-2 rounded-lg bg-transparent'
            options={{
              style: {
                base: {
                  fontSize: '20px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
              },
            }}
          />
        </label>
      </div>
      <button
        disabled={isLoading || !stripe || !elements}
        className='bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg w-full mt-4 transition duration-200 ease-in-out transform hover:scale-105'
      >
        {isLoading ? (
          <svg
            className='animate-spin h-5 w-5 mr-3 ...'
            viewBox='0 0 24 24'
          >
            <circle
              className='opacity-25'
              cx='12'
              cy='12'
              r='10'
              stroke='currentColor'
              strokeWidth='4'
            ></circle>
            <path
              className='opacity-75'
              fill='currentColor'
              d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
            ></path>
          </svg>
        ) : (
          `Pay $${price}`
        )}
      </button>
      {message && <div className='text-red-500 pt-2'>{message}</div>}
    </form>
  );
}
