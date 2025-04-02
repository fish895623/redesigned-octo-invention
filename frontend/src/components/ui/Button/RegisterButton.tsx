import { useNavigate } from "react-router-dom";

export const RegisterButton = ({ label = "Register" }: { label?: string }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/register");
  };

  return (
    <button
      onClick={handleClick}
      className="px-4 py-2 border border-gray-300 hover:bg-gray-100 text-gray-700 font-medium rounded-md transition-colors"
    >
      {label}
    </button>
  );
};
