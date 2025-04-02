import { useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../../context/ThemeContextDefinition";

export const LogoutButton = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      localStorage.clear();
      navigate("/login");
    } catch (error: unknown) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className={`w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white ${
        isDarkMode
          ? "bg-red-700 hover:bg-red-800"
          : "bg-red-600 hover:bg-red-700"
      } rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
      aria-label="Logout"
      disabled={isLoggingOut}
    >
      <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`${isLoggingOut ? "animate-pulse" : ""}`}
      >
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
        <polyline points="16 17 21 12 16 7"></polyline>
        <line x1="21" y1="12" x2="9" y2="12"></line>
      </svg>
    </button>
  );
};
