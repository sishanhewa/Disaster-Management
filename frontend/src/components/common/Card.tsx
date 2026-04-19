import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`bg-slate-800 border border-slate-700 rounded-xl shadow-lg transition ${onClick ? 'cursor-pointer hover:border-slate-600 active:scale-[0.99]' : ''} ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
