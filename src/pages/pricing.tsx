'use client';
import Header from '../components/Header';
import { useState, useEffect } from 'react';
import PricingCard from '../components/PricingCard';

export default function Pricing() {
  const BASE_PRICE = 6;
  const [hours, setHours] = useState(10);
  const [pricePerHour, setPricePerHour] = useState(BASE_PRICE);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isMonthly, setIsMonthly] = useState(true);

  const calculatePrice = () => {
    let discount = isMonthly ? Math.floor(hours / 10) * 10 : 10;
    discount = Math.min(discount, 60); // cap discount at 60%
    const discountedPrice =
      BASE_PRICE - BASE_PRICE * (discount / 100);
    setPricePerHour(discountedPrice);
    setTotalPrice(discountedPrice * hours);
  };

  const handleSliderChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setHours(Number(e.target.value));
  };

  useEffect(() => {
    calculatePrice();
  }, [hours, isMonthly, pricePerHour]); // recalculate whenever hours or isMonthly change

  return (
    <div className='w-screen h-full '>
      <Header />
      <div className='flex w-full   h-full '>
        <div className='w-3/5 h-full text-center  items-center p-10 flex flex-col '>
          <h1 className='text-3xl font-sans font-bold mt-20 mb-10'>
            Pricing
          </h1>
          <p className='text-xl text-gray-500 mb-6'>
            Our Pricing is simple, 1 hour is $6 for every 10 hours you
            purchase you get an additional 10% off your total, up to
            60% off your total. use our calculator to see how much
            you'll pay
          </p>
          <div className='bg-white flex p-1 justify-center rounded-xl items-center mb-8'>
            <button
              onClick={() => setHours(hours - 1 < 1 ? 1 : hours - 1)}
              className='bg-gray-200 rounded-lg w-9 h-9'
            >
              -
            </button>
            <p className=' ml-3 font-mono h-full mr-3'>{hours}</p>
            <button
              onClick={() => setHours(hours + 1)}
              className=' w-9 h-9 text-white pBackground rounded-lg'
            >
              +
            </button>
            <p className='ml-3'>Hours</p>
          </div>

          <input
            type='range'
            id='hours'
            name='hours'
            min='1'
            max='60'
            value={hours}
            onChange={handleSliderChange}
            className='slider'
            style={{
              background: `linear-gradient(90deg, #805AD5 ${
                (hours / 60) * 100
              }%, #E5E7EB ${(hours / 60) * 100}% 100%)`,
              backgroundImage: `-webkit-gradient(linear, left top, right top, color-stop(${
                (hours / 60) * 90
              }%, #805AD5), color-stop(${
                (hours / 60) * 100
              }%, #E5E7EB))`,
              backgroundSize: '100% 100%',
            }}
          />
        </div>
        <div className='w-3/5 h-full flex flex-col mt-10 items-center'>
          {/* <div className='flex justify-center pBackground mt-28 gap-2 rounded-xl p-1 mb-4'>
            <button
              onClick={() => setIsMonthly(true)}
              className={`py-2 px-4 font-roboto rounded-lg ${
                isMonthly
                  ? 'purpleText bg-white'
                  : 'text-white pBackground'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsMonthly(false)}
              className={`py-2 px-4 rounded-lg ${
                !isMonthly
                  ? 'bg-white purpleText'
                  : 'text-white pBackground'
              }`}
            >
              Yearly
            </button>
          </div> */}
          <PricingCard
            price={pricePerHour}
            hours={hours}
            totalPrice={totalPrice}
          />
        </div>
      </div>
    </div>
  );
}
