import React from 'react';

interface UserIconProps {
  name: string;
  className?: string;
}

const UserIcon: React.FC<UserIconProps> = ({ name, className }) => {
  return (
    <div
      className={`relative group w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-base sm:text-lg font-semibold bg-blue-600 text-white border-2 border-gray-800 cursor-pointer ${className}`}
    >
      {name.charAt(0)}
      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded bg-gray-900 text-white text-xs invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
        {name}
      </span>
    </div>
  );
};

export default UserIcon;
