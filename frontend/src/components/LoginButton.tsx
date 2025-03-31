import { useAuth } from "../hooks/useAuth";

export const LoginButton = ({
  label = "Login with Google",
}: {
  label?: string;
}) => {
  const { loginWithGoogle } = useAuth();

  return (
    <button onClick={loginWithGoogle} className="login-button">
      {label}
    </button>
  );
};
