import { useNavigate } from 'react-router-dom';

export const LoginButton = ({ label = 'Login' }: { label?: string }) => {
  const navigate = useNavigate();

  const handleClick = async () => {
    try {
      // Call backend API to check auth status
      const response = await fetch('/api/auth/status', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        // If not authenticated, navigate to login page
        navigate('/login');
      } else {
        // If already authenticated, potentially navigate to dashboard
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error checking authentication status:', error);
      navigate('/login');
    }
  };

  return (
    <button
      onClick={handleClick}
      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md transition-colors"
    >
      {label}
    </button>
  );
};
