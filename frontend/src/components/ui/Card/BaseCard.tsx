import React, { ReactNode } from 'react';

export interface BaseCardProps {
  title?: string;
  description?: string;
  headerRight?: ReactNode;
  headerLeft?: ReactNode;
  footer?: ReactNode;
  children?: ReactNode;
  onClick?: () => void;
  className?: string;
}

const BaseCard: React.FC<BaseCardProps> = ({
  title,
  description,
  headerRight,
  headerLeft,
  footer,
  children,
  onClick,
  className = '',
}) => {
  return (
    <div
      className={`bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
      onClick={onClick}
    >
      {(title || headerRight) && (
        <div className="flex justify-between items-start">
          {title && (
            <div>
              <h3 className="text-lg font-semibold text-white hover:text-blue-400 transition-colors">{title}</h3>
              {description && <p className="text-gray-400 mt-1">{description}</p>}
            </div>
          )}
          {headerLeft && <div className="flex items-center gap-3">{headerLeft}</div>}
          {headerRight && <div className="flex items-center gap-3">{headerRight}</div>}
        </div>
      )}

      {children && <div className="mt-4">{children}</div>}

      {footer && <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-400">{footer}</div>}
    </div>
  );
};

export default BaseCard;
