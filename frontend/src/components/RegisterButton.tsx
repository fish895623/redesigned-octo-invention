import { useNavigate } from "react-router-dom";

export const RegisterButton = ({ label = "Register" }: { label?: string }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/register");
  };

  return (
    <button onClick={handleClick} className="register-button">
      {label}
    </button>
  );
};
