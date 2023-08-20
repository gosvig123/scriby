import React from 'react';
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

interface Props {
  price: number;
  clientSecret: string;
}

export default function CheckoutForm({ price, clientSecret }: Props) {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(
      window.location.search
    ).get('payment_intent_client_secret');

    if (!clientSecret) {
      return;
    }

    stripe
      .retrievePaymentIntent(clientSecret)
      .then(({ paymentIntent }) => {
        if (paymentIntent && paymentIntent.status) {
          switch (paymentIntent.status) {
            case 'succeeded':
              setMessage('Payment succeeded!');
              break;
            case 'processing':
              setMessage('Your payment is processing.');
              break;
            case 'requires_payment_method':
              setMessage(
                'Your payment was not successful, please try again.'
              );
              break;
            default:
              setMessage('Something went wrong.');
              break;
          }
        }
      });
  }, [stripe]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);
    const cardElement = elements.getElement(CardNumberElement);

    if (cardElement === null) {
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
      if (error.message) {
        setMessage(error.message);
      } else {
        setMessage('An unexpected error occurred.');
      }
    } else if (paymentIntent.status === 'succeeded') {
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
