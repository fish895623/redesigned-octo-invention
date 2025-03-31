import { useAuth } from "./hooks/useAuth";
import { LoginButton } from "./components/LoginButton";
import { UserProfile } from "./components/UserProfile";
import { LogoutButton } from "./components/LogoutButton";

const Profile = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user || !user.authenticated) {
    return (
      <div className="app-container">
        <h2>Please login to view your profile</h2>
        <LoginButton />
      </div>
    );
  }

  return (
    <div className="app-container">
      <h2>Profile</h2>
      <UserProfile />
      <div className="profile-actions">
        <LogoutButton />
      </div>
    </div>
  );
};

export default Profile;
