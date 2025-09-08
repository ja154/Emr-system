import React from 'react';

interface CardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ title, icon, children, className = '' }) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-brand-gray-200 h-full flex flex-col ${className}`}>
      <div className="p-4 border-b border-brand-gray-200 flex items-center space-x-3">
        <div className="text-brand-blue">{icon}</div>
        <h2 className="text-lg font-semibold text-brand-gray-800">{title}</h2>
      </div>
      <div className="p-4 flex-grow">
        {children}
      </div>
    </div>
  );
};

export default Card;
