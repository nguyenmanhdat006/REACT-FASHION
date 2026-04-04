import React from 'react';
import { cn } from '@/utils/helpers';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  footer?: React.ReactNode;
  hover?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  className,
  title,
  footer,
  hover = false,
}) => {
  return (
    <div
      className={cn(
        'bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700',
        hover && 'transition-shadow hover:shadow-lg',
        className
      )}
    >
      {title && (
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
        </div>
      )}
      <div className="px-6 py-4">{children}</div>
      {footer && (
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
