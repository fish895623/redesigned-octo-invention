import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";

export const UserProfile = () => {
  const { user } = useAuth();

  if (!user || !user.authenticated) {
    return null;
  }

  return (
    <Link
      to="/profile"
      className="user-profile"
      style={{ cursor: "pointer", textDecoration: "none" }}
    >
      {user.picture && (
        <img
          src={user.picture}
          alt={`${user.name}'s profile`}
          className="profile-image"
          title={`${user.name} (${user.email})`}
        />
      )}
    </Link>
  );
};
