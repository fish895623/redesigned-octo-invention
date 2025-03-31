import { useAuth } from "../hooks/useAuth";
import { LoginButton } from "../components/LoginButton";
import { Link } from "react-router-dom";
import "../css/Auth.css";

const LoginPage = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  // Redirect if already authenticated
  if (user && user.authenticated) {
    return (
      <div className="app-container">
        <h2>You are already logged in</h2>
        <p>You are currently logged in as {user.email}</p>
        <Link to="/project" className="primary-button">
          Go to Projects
        </Link>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="auth-container">
        <h2>Log In</h2>
        <p>Sign in to access your projects and tasks</p>

        <div className="auth-options">
          <LoginButton label="Login with Google" />
        </div>

        <div className="auth-footer">
          <p>
            Don't have an account?{" "}
            <Link to="/register" className="auth-link">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
