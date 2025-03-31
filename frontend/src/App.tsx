import "./App.css";
import { AuthProvider } from "./context/AuthContext";
import NavigationBar from "./components/NavigationBar";
import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import { LoadingSpinner } from "./components/LoadingSpinner";
import { ProtectedRoute } from "./components/ProtectedRoute";

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
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <LoadingSpinner />
  </div>
);

function App() {
  return (
    <AuthProvider>
      <NavigationBar />
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegistrationPage />} />

          {/* Protected routes */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/project"
            element={
              <ProtectedRoute>
                <ProjectListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/project/:projectId"
            element={
              <ProtectedRoute>
                <ProjectPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/project/:projectId/milestone"
            element={
              <ProtectedRoute>
                <MilestoneListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/project/:projectId/milestone/:milestoneId"
            element={
              <ProtectedRoute>
                <MilestonePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/project/:projectId/task"
            element={
              <ProtectedRoute>
                <TaskListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/project/:projectId/task/:taskId"
            element={
              <ProtectedRoute>
                <TaskPage />
              </ProtectedRoute>
            }
          />

          {/* Redirect root to projects */}
          <Route path="*" element={<Navigate to="/project" />} />
        </Routes>
      </Suspense>
    </AuthProvider>
  );
}

export default App;
