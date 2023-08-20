import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

interface NotificationProps {
  text: string;
  status: 'success' | 'failure' | 'info';
}

const Notification = ({ text, status }: NotificationProps) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  let color, icon;
  switch (status) {
    case 'success':
      color = 'border-green-500';
      icon = '✅';
      break;
    case 'failure':
      color = 'border-red-500';
      icon = '❌';
      break;
    default:
      color = 'border-gray-500';
      icon = 'ℹ️';
  }

  return visible ? (
    <div
      className={`fixed mt-5 left-1/2 transform -translate-x-1/2 w-11/12 max-w-lg rounded-lg shadow-lg bg-white text-purple-700 p-4 flex justify-start items-center ${color} border-l-4`}
      style={{ top: '5%' }}
    >
      <span className='mr-4 text-2xl'>{icon}</span>
      <p className='text-center'>{text}</p>
    </div>
  ) : null;
};

Notification.propTypes = {
  text: PropTypes.string.isRequired,
  status: PropTypes.oneOf(['success', 'failure', 'info']).isRequired,
};

export default Notification;
