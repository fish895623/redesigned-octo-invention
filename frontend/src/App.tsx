import "./App.css";
import { AuthProvider } from "./context/AuthContext";
import NavigationBar from "./components/NavigationBar";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";

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
    // Short delay to allow authentication state to update
    const redirectTimer = setTimeout(() => {
      navigate("/project");
    }, 1500);

    return () => clearTimeout(redirectTimer);
  }, [navigate]);

  return <div className="loading">Authentication successful. Redirecting...</div>;
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
