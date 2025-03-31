import { useState, useRef, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";
import { LogoutButton } from "./LogoutButton";

export const UserProfile = () => {
  const { user } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!user || !user.authenticated) {
    return null;
  }

  return (
    <div className="user-profile-container" ref={dropdownRef}>
      <div 
        className="user-profile"
        onClick={() => setShowDropdown(!showDropdown)}
        style={{ cursor: "pointer" }}
      >
        {user.picture ? (
          <img
            src={user.picture}
            alt={`${user.name}'s profile`}
            className="profile-image"
            title={`${user.name} (${user.email})`}
          />
        ) : (
          <div className="profile-initial">
            {user.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>
        )}
      </div>
      
      {showDropdown && (
        <div className="profile-dropdown">
          <div className="dropdown-user-info">
            <p className="dropdown-username">{user.name}</p>
            <p className="dropdown-email">{user.email}</p>
          </div>
          <div className="dropdown-divider"></div>
          <Link to="/profile" className="dropdown-item" onClick={() => setShowDropdown(false)}>
            My Profile
          </Link>
          <Link to="/project" className="dropdown-item" onClick={() => setShowDropdown(false)}>
            My Projects
          </Link>
          <div className="dropdown-divider"></div>
          <div className="dropdown-item">
            <LogoutButton />
          </div>
        </div>
      )}
    </div>
  );
};