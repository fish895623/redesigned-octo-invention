import { useAuth } from "../hooks/useAuth";
import { RegisterButton } from "../components/RegisterButton";
import { Link } from "react-router-dom";
import "../css/Auth.css";

const RegistrationPage = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  // Redirect if already authenticated
  if (user && user.authenticated) {
    return (
      <div className="app-container">
        <h2>You are already registered</h2>
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
        <h2>Create an Account</h2>
        <p>Join our project management platform to collaborate with your team</p>

        <div className="auth-options">
          <RegisterButton label="Register with Google" />
        </div>

        <div className="auth-footer">
          <p>
            Already have an account?{" "}
            <Link to="/login" className="auth-link">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;
