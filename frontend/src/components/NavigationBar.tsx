import { useAuth } from "../hooks/useAuth";
import { UserProfile } from "./UserProfile";
import { Link } from "react-router-dom";

const NavigationBar = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <nav className="navigation-bar">
      <div className="nav-brand">
        <Link to="/project">Project Management</Link>
      </div>
      <div className="nav-links">
        {user && user.authenticated && (
          <>
            <Link to="/profile" className="nav-link">
              Profile
            </Link>
            <Link to="/project" className="nav-link">
              Projects
            </Link>
          </>
        )}
      </div>
      <div className="nav-items">
        {user && user.authenticated ? (
          <>
            <UserProfile />
          </>
        ) : (
          <div className="auth-nav-buttons">
            <Link to="/login" className="nav-link">
              Login
            </Link>
            <Link to="/register" className="nav-link">
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavigationBar;
