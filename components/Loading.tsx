import React, { useEffect, useState } from 'react';

export const LoadingSpinner = ({ isLoading }: { isLoading: boolean }) => {
  return (
    <div
      className={`fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 ${
        isLoading ? 'block' : 'hidden'
      }`}
    >
      <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-slate-500"></div>
    </div>
  );
};

export const LoadingText = ({ isLoading }: { isLoading: boolean }) => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setDots((prevDots) => (prevDots === '...' ? '' : prevDots + '.'));
      }, 500);

      return () => clearInterval(interval);
    }
  }, [isLoading]);

  return (
    <div
      className={`fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 ${
        isLoading ? 'block' : 'hidden'
      }`}
    >
      {isLoading && <div className="text-slate-500 text-lg font-medium">Loading{dots}</div>}
    </div>
  );
};
