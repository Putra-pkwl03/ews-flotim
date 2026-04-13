import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

export const Card = ({ children, className = "", noPadding = false }: CardProps) => {
  return (
    <div className={`
      bg-white 
      rounded-[2.5rem] 
      shadow-[0_8px_30px_rgb(0,0,0,0.04)] 
      border border-slate-100 
      overflow-hidden 
      flex flex-col
      ${className}
    `}>
      <div className={`${noPadding ? '' : 'p-6 md:p-8'} h-full flex flex-col`}>
        {children}
      </div>
    </div>
  );
};