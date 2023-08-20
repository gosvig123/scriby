import React from 'react';

interface OpenSourceLogosProps {
  logos: string[];
}

const OpenSourceLogos: React.FC<OpenSourceLogosProps> = ({
  logos,
}) => {
  return (
    <div className='flex flex-col mt-20 items-center space-y-5'>
      <h2 className='text-4xl purpleText font-roboto mb-12 font-bold'>
        Trusted by
      </h2>
      <div className='flex justify-center gap-10 w-full '>
        {logos.map((logoUrl, index) => (
          <img
            key={index}
            src={logoUrl}
            alt={`Open Source Logo ${index + 1}`}
            className='w-32 h-16 object-contain rounded-full'
          />
        ))}
      </div>
    </div>
  );
};

export default OpenSourceLogos;
