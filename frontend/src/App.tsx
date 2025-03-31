import "./App.css";
import { AuthProvider } from "./context/AuthContext";
import NavigationBar from "./components/NavigationBar";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import { oauth2Service } from "./services/oauth2Service";

// Lazy load page components for better performance
const Profile = lazy(() => import("./ProfilePage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegistrationPage = lazy(() => import("./pages/RegistrationPage"));
const ProjectListPage = lazy(() => import("./pages/ProjectListPage"));
const ProjectPage = lazy(() => import("./pages/ProjectPage"));
const MilestoneListPage = lazy(() => import("./pages/MilestoneListPage"));
const MilestonePage = lazy(() => import("./pages/MilestonePage"));
const TaskListPage = lazy(() => import("./pages/TaskListPage"));
const TaskPage = lazy(() => import("./pages/TaskPage"));

// Loading fallback component
const LoadingFallback = () => <div className="loading">Loading...</div>;

// OAuth callback handler component
const OAuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        await oauth2Service.handleCallback();
        // Clear the URL parameters after successful authentication
        window.history.replaceState({}, document.title, "/oauth/callback");
        navigate("/project");
      } catch (error) {
        console.error("Error handling OAuth callback:", error);
        navigate("/login");
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Authentication successful</h2>
        <p className="text-gray-600">Redirecting to projects...</p>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <NavigationBar />
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/project" element={<ProjectListPage />} />
          <Route path="/project/:projectId" element={<ProjectPage />} />
          <Route path="/project/:projectId/milestone" element={<MilestoneListPage />} />
          <Route path="/project/:projectId/milestone/:milestoneId" element={<MilestonePage />} />
          <Route path="/project/:projectId/task" element={<TaskListPage />} />
          <Route path="/project/:projectId/task/:taskId" element={<TaskPage />} />
          <Route path="/oauth/callback" element={<OAuthCallback />} />
          <Route path="*" element={<Navigate to="/project" />} />
        </Routes>
      </Suspense>
    </AuthProvider>
  );
}

export default App;
