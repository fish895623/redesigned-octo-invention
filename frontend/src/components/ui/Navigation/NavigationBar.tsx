import { useAuth } from '../../../hooks/useAuth';
import { UserProfile } from '../User/UserProfile';
import { Link } from 'react-router-dom';
import DarkModeToggle from '../Button/DarkModeToggle';
import { useTheme } from '../../../context/ThemeContextDefinition';
import { useState } from 'react';

const NavigationBar = () => {
  const { user, loading } = useAuth();
  const { isDarkMode } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  if (loading) {
    return <div className="fixed inset-x-0 top-0 p-4 bg-gray-800 text-blue-500 text-center">Loading...</div>;
  }

  return (
    <nav
      className={`fixed inset-x-0 top-0 w-full flex flex-wrap justify-between items-center px-4 py-3 shadow-md z-10 transition-colors ${
        isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
      }`}
    >
      <div className="text-xl font-bold">
        <Link
          to="/project"
          className={`transition-colors ${
            isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'
          }`}
        >
          Project Management
        </Link>
      </div>

      {/* Mobile menu button */}
      <button
        className="md:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        onClick={toggleMobileMenu}
        aria-label="Toggle menu"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={isMobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
          />
        </svg>
      </button>

      <div className="hidden md:flex md:space-x-8">
        {user && user.authenticated && (
          <>
            <Link
              to="/profile"
              className={`transition-colors ${
                isDarkMode ? 'text-gray-200 hover:text-white' : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              Profile
            </Link>
            <Link
              to="/project"
              className={`transition-colors ${
                isDarkMode ? 'text-gray-200 hover:text-white' : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              Projects
            </Link>
          </>
        )}
      </div>

      <div className="hidden md:flex md:items-center md:space-x-4">
        <DarkModeToggle />

        {user && user.authenticated ? (
          <UserProfile />
        ) : (
          <div className="flex space-x-4">
            <Link
              to="/login"
              className={`px-4 py-2 rounded-md text-white transition-colors ${
                isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              Login
            </Link>
            <Link
              to="/register"
              className={`px-4 py-2 rounded-md transition-colors ${
                isDarkMode
                  ? 'border border-gray-600 text-gray-200 hover:bg-gray-700'
                  : 'border border-gray-300 text-gray-700 hover:bg-gray-100'
              }`}
            >
              Register
            </Link>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden w-full pt-2 pb-4">
          {user && user.authenticated && (
            <div className="flex flex-col space-y-2">
              <Link
                to="/profile"
                className={`block px-4 py-2 transition-colors ${
                  isDarkMode ? 'text-gray-200 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Profile
              </Link>
              <Link
                to="/project"
                className={`block px-4 py-2 transition-colors ${
                  isDarkMode ? 'text-gray-200 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Projects
              </Link>
            </div>
          )}

          <div className="mt-3 px-4 flex items-center justify-between">
            <DarkModeToggle />

            {!user?.authenticated && (
              <div className="flex space-x-2">
                <Link
                  to="/login"
                  className={`px-3 py-1 text-sm rounded-md text-white transition-colors ${
                    isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    isDarkMode
                      ? 'border border-gray-600 text-gray-200 hover:bg-gray-700'
                      : 'border border-gray-300 text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}

            {user?.authenticated && (
              <div className="mt-2">
                <UserProfile />
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavigationBar;
