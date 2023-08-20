import Link from 'next/link';
import React from 'react';

interface PricingCardProps {
  price: number;
  hours: number;
  totalPrice: number;
}

const PricingCard: React.FC<PricingCardProps> = ({
  price,
  hours,
  totalPrice,
}) => {
  return (
    <div className='bg-white rounded-lg mt-10  shadow-lg p-6  w-3/5'>
      <h2 className='text-5xl purpleText   mb-4'>Price</h2>
      <div className='flex justify-between items-center mb-1'>
        <p>Price/Hour: </p>
        <p>{price.toFixed(1)}$</p>
      </div>
      <div className='flex justify-between items-center mb-1'>
        <p>Total Hours:</p>
        <p>{hours}</p>
      </div>
      <div className='flex justify-between items-center mb-1'>
        <p>Total Price:</p>
        <p>{totalPrice.toFixed(1)}$</p>
      </div>
      <hr />
      <ul className='mt-4 mb-6'>
        <li className='flex items-center mb-2'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
            className='h-6 w-6 text-green-500 mr-2'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M5 13l4 4L19 7'
            ></path>
          </svg>
          <p>First 30 minutes free </p>
        </li>
        <li className='flex items-center mb-2'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
            className='h-6 w-6 text-green-500 mr-2'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M5 13l4 4L19 7'
            ></path>
          </svg>
          <p>Transcribes +100 languages</p>
        </li>
        <li className='flex items-center'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
            className='h-6 w-6 text-green-500 mr-2'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M5 13l4 4L19 7'
            ></path>
          </svg>
          <p>Automatically detects language</p>
        </li>
      </ul>
      <Link href={'/signup'}>
        <button className='solidPurpleButton w-full py font-sans-2 rounded-lg'>
          Try For Free
        </button>
      </Link>
    </div>
  );
};

export default PricingCard;
