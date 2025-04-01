import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";

const RegistrationPage = () => {
  const { user, loading, register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate password match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Validate password strength
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await register({
        name,
        email,
        password,
      });

      if (result.authenticated) {
        navigate("/project");
      } else {
        setError("Registration failed. Please try again.");
      }
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
      console.error("Registration error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed top-0 left-0 right-0 z-50 text-center p-4 bg-gray-900 text-blue-500">
        Loading...
      </div>
    );
  }

  // Redirect if already authenticated
  if (user && user.authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
        <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden max-w-md w-full p-8 border border-gray-700">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-2">
              Already Registered
            </h2>
            <p className="text-gray-300 mb-6">
              You are currently logged in as{" "}
              <span className="text-blue-400 font-medium">{user.email}</span>
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
          <div className="bg-gradient-to-br from-blue-700 to-indigo-800 p-10 md:w-5/12 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-white mb-3">
                Project Manager
              </h1>
              <p className="text-blue-100 mb-8 max-w-xs mx-auto">
                Join our platform and start managing your projects more
                efficiently
              </p>
              <div className="space-y-3">
                <div className="text-sm text-blue-100">
                  Create and track projects
                </div>
                <div className="text-sm text-blue-100">
                  Collaborate with team members
                </div>
                <div className="text-sm text-blue-100">
                  Monitor progress and deadlines
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Registration Form */}
          <div className="p-10 md:w-7/12">
            <div className="max-w-md mx-auto">
              <h2 className="text-2xl font-bold text-white mb-2">
                Create an Account
              </h2>
              <p className="text-gray-300 mb-8">
                Join our project management platform to collaborate with your
                team
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-500/10 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <label
                    htmlFor="name"
                    className="block text-gray-300 text-sm font-medium"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    autoComplete="name"
                    placeholder="Your full name"
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="block text-gray-300 text-sm font-medium"
                  >
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
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="password"
                    className="block text-gray-300 text-sm font-medium"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                    minLength={6}
                    placeholder="At least 6 characters"
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="confirmPassword"
                    className="block text-gray-300 text-sm font-medium"
                  >
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                    placeholder="Confirm your password"
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full justify-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creating account..." : "Create Account"}
                </button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-gray-300">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-blue-400 font-medium hover:text-blue-300 transition-colors"
                  >
                    Sign in
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

export default RegistrationPage;
