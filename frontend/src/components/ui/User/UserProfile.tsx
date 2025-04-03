import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { Link } from 'react-router-dom';
import { LogoutButton } from '../Button/LogoutButton';
import { useTheme } from '../../../context/ThemeContextDefinition';

export const UserProfile = () => {
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!user || !user.authenticated) {
    return null;
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="flex items-center cursor-pointer" onClick={() => setShowDropdown(!showDropdown)}>
        {user.picture ? (
          <img
            src={user.picture}
            alt={`${user.name}'s profile`}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-gray-300"
            title={`${user.name} (${user.email})`}
          />
        ) : (
          <div
            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-base sm:text-lg font-semibold ${
              isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
            }`}
          >
            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
        )}
      </div>

      {showDropdown && (
        <div
          className={`absolute right-0 mt-2 w-48 sm:w-64 rounded-md shadow-lg py-1 z-20 max-h-[90vh] overflow-y-auto ${
            isDarkMode
              ? 'bg-gray-800 text-white border border-gray-700'
              : 'bg-white text-gray-800 border border-gray-200'
          }`}
          style={{ right: 0, maxWidth: 'calc(100vw - 32px)' }}
        >
          <div className="px-4 py-3">
            <p className="text-sm font-medium truncate">{user.name}</p>
            <p className={`text-xs truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{user.email}</p>
          </div>
          <div className={`border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}></div>
          <Link
            to="/profile"
            className={`block px-4 py-2 text-sm ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
            onClick={() => setShowDropdown(false)}
          >
            My Profile
          </Link>
          <Link
            to="/project"
            className={`block px-4 py-2 text-sm ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
            onClick={() => setShowDropdown(false)}
          >
            My Projects
          </Link>
          <div className={`border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}></div>
          <div className="px-4 py-2">
            <LogoutButton />
          </div>
        </div>
      )}
    </div>
  );
};
