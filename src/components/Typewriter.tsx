import React, { useState, useEffect } from 'react';

interface TypewriterProps {
  baseText: string;
  rotatingText?: string[];
}

function TypewriterComponent({
  baseText,
  rotatingText = [],
}: TypewriterProps) {
  const [displayedBaseText, setDisplayedBaseText] = useState('');
  const [displayedRotatingText, setDisplayedRotatingText] =
    useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [baseTextWritten, setBaseTextWritten] = useState(false);

  useEffect(() => {
    if (rotatingText.length > 0) {
      const timer = setTimeout(() => {
        if (!baseTextWritten) {
          setDisplayedBaseText(
            baseText.substring(0, displayedBaseText.length + 1)
          );
          if (displayedBaseText.length === baseText.length) {
            setBaseTextWritten(true);
          }
        } else {
          const currentWord =
            rotatingText[currentIndex % rotatingText.length];

          if (isDeleting) {
            setDisplayedRotatingText(
              currentWord.substring(
                0,
                displayedRotatingText.length - 1
              )
            );

            if (displayedRotatingText === '') {
              setIsDeleting(false);
              setCurrentIndex(
                (prevIndex) => (prevIndex + 1) % rotatingText.length
              );
            }
          } else {
            setDisplayedRotatingText(
              currentWord.substring(
                0,
                displayedRotatingText.length + 1
              )
            );

            if (displayedRotatingText.length === currentWord.length) {
              setIsDeleting(true);
            }
          }
        }
      }, 80 + Math.random() * 80);

      return () => clearTimeout(timer);
    }
  }, [
    displayedBaseText,
    displayedRotatingText,
    baseText,
    rotatingText,
    currentIndex,
    isDeleting,
    baseTextWritten,
  ]);

  return (
    <div
      className='flex-col mx-auto'
      style={{ flexGrow: 0, flexShrink: 0, flexBasis: '50%' }}
    >
      <span className='purpleText text-4xl break-words'>
        {displayedBaseText}
      </span>
      {rotatingText.length > 0 && (
        <span className='text-green-600 h-6 text-4xl break-words'>
          {displayedRotatingText}
        </span>
      )}
    </div>
  );
}

export default TypewriterComponent;
