import React, { ReactNode } from 'react';

export interface BaseCardProps {
  title?: string;
  description?: string;
  assignees?: ReactNode;
  participants?: ReactNode;
  headerRight?: ReactNode;
  footer?: ReactNode;
  children?: ReactNode;
  onClick?: () => void;
  className?: string;
}

const BaseCard: React.FC<BaseCardProps> = ({
  title,
  description,
  assignees,
  participants,
  headerRight,
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
          {headerRight && <div className="flex items-center gap-4 ml-auto">{headerRight}</div>}
        </div>
      )}

      {children && <div className="mt-4">{children}</div>}

      <div className="flex gap-4 text-sm text-gray-400">
        {footer && <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-400">{footer}</div>}
        <div className="flex gap-4 text-sm text-gray-400">
          {assignees && <div className="mt-4  gap-4 text-sm text-gray-400">{assignees}</div>}
          {participants && <div className="mt-4 gap-4 text-sm text-gray-400">{participants}</div>}
        </div>
      </div>
    </div>
  );
};

export default BaseCard;
