'use client';
import Header from '../components/Header';
import { useState, useEffect } from 'react';
import PricingCard from '../components/PricingCard';
import Slider from '@/components/PricingSlider';
import ButtonCounter from '@/components/ButtonCounter';
export default function Pricing() {
  const [hours, setHours] = useState(10);
  const BASE_PRICE = 6;
  const [pricePerHour, setPricePerHour] = useState(BASE_PRICE);

  const calculatePrice = () => {
    let discount = Math.floor(hours / 10) * 10;
    discount = Math.min(discount, 60);
    const discountedPrice =
      BASE_PRICE - BASE_PRICE * (discount / 100);
    setPricePerHour(discountedPrice);
  };

  // redirect to login page
  const redirect = () => {
    window.location.href = '/signup';
  };

  useEffect(() => {
    calculatePrice();
  }, [hours, pricePerHour]);

  return (
    <div className='w-screen h-screen overflow-hidden'>
      <Header user={undefined} />
      <div className='flex w-full h-3/4 px-5 '>
        <div className='w-3/5 h-3/4 text-center  flex-auto justify-around items-center px-20 flex flex-col '>
          <h1 className='text-3xl font-sans font-bold mt-20 mb-10'>
            Pricing
          </h1>
          <p className='text-xl text-gray-500 mb-6'>
            Our Pricing is simple, 1 hour is $6 for every 10 hours you
            purchase you get an additional 10% off your total, up to
            60% off your total. use our calculator to see how much
            you'll pay
          </p>
          <ButtonCounter hours={hours} setHours={setHours} />
          <Slider hours={hours} setHours={setHours} />
        </div>
        <div className='w-3/5 h-3/4 rounded-xl justify-center  flex flex-col mt-10 bg-white mx-auto p-10'>
          <PricingCard
            price={pricePerHour}
            hours={hours}
            setPrice={setPricePerHour}
            onButtonClick={redirect}
          />
        </div>
      </div>
    </div>
  );
}
