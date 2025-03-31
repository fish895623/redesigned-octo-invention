import { useAuth } from "../hooks/useAuth";

export const RegisterButton = () => {
  const { loginWithGoogle } = useAuth();

  return (
    <button onClick={loginWithGoogle} className="register-button">
      Register with Google
    </button>
  );
};
