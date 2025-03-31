import { useAuth } from "../hooks/useAuth";

export const RegisterButton = ({ label = "Register with Google" }: { label?: string }) => {
  const { loginWithGoogle } = useAuth();

  return (
    <button onClick={loginWithGoogle} className="register-button">
      {label}
    </button>
  );
};
