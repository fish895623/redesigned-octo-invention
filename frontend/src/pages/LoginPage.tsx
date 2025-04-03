import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const { user, loading, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const result = await login({ email, password });
      if (result.authenticated) {
        navigate('/project');
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
      console.error('Login error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="fixed inset-x-0 top-0 z-50 p-4 bg-gray-900 text-blue-500 text-center">Loading...</div>;
  }

  // Redirect if already authenticated
  if (user && user.authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
        <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden max-w-md w-full p-8 border border-gray-700">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-2">Already Logged In</h2>
            <p className="text-gray-300 mb-6">
              You are currently logged in as <span className="text-blue-400 font-medium">{user.email}</span>
            </p>
            <Link
              to="/project"
              className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
            >
              Go to Projects
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden max-w-4xl w-full border border-gray-700">
        <div className="flex flex-col md:flex-row">
          {/* Left side - Branding Section */}
          <div className="bg-gradient-to-br from-indigo-700 to-purple-800 p-10 md:w-5/12 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-white mb-3">Project Manager</h1>
              <p className="text-blue-100 mb-8 max-w-xs mx-auto">
                Access your projects and continue your productive workflow
              </p>
              <div className="space-y-3">
                <div className="text-sm text-blue-100">Resume your project work</div>
                <div className="text-sm text-blue-100">Check project updates</div>
                <div className="text-sm text-blue-100">Connect with team members</div>
              </div>
            </div>
          </div>

          {/* Right side - Login Form */}
          <div className="p-10 md:w-7/12">
            <div className="max-w-md mx-auto">
              <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
              <p className="text-gray-300 mb-8">Sign in to access your projects and tasks</p>

              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-500/10 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <label htmlFor="email" className="block text-gray-300 text-sm font-medium">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label htmlFor="password" className="block text-gray-300 text-sm font-medium">
                      Password
                    </label>
                    <a href="#" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                      Forgot password?
                    </a>
                  </div>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 bg-gray-700 border-gray-600 rounded text-blue-600 focus:ring-blue-500 focus:ring-offset-gray-800"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                    Remember me
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full flex justify-center items-center px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Logging in...' : 'Sign in'}
                </button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-gray-300">
                  Don't have an account?{' '}
                  <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                    Create account
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
