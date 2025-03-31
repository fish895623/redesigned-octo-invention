import { useNavigate } from "react-router-dom";

export const LoginButton = ({
  label = "Login",
}: {
  label?: string;
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/login");
  };

  return (
    <button onClick={handleClick} className="login-button">
      {label}
    </button>
  );
};
