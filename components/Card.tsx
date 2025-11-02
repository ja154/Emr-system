import React from 'react';

interface CardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ title, icon, children, className = '', action }) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-brand-gray-200 h-full flex flex-col ${className}`}>
      <div className="p-5 border-b border-brand-gray-100 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="text-brand-primary-500">{icon}</div>
          <h2 className="text-lg font-semibold text-brand-gray-800">{title}</h2>
        </div>
        {action && <div>{action}</div>}
      </div>
      <div className="p-5 flex-grow">
        {children}
      </div>
    </div>
  );
};

export default Card;