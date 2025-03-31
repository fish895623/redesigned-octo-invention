import "./App.css";
import { AuthProvider } from "./context/AuthContext";
import NavigationBar from "./components/NavigationBar";
import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";

// Lazy load page components for better performance
const Profile = lazy(() => import("./ProfilePage"));
const ProjectListPage = lazy(() => import("./pages/ProjectListPage"));
const ProjectPage = lazy(() => import("./pages/ProjectPage"));
const MilestoneListPage = lazy(() => import("./pages/MilestoneListPage"));
const MilestonePage = lazy(() => import("./pages/MilestonePage"));
const TaskListPage = lazy(() => import("./pages/TaskListPage"));
const TaskPage = lazy(() => import("./pages/TaskPage"));

// Loading fallback component
const LoadingFallback = () => <div className="loading">Loading...</div>;

function App() {
  return (
    <AuthProvider>
      <NavigationBar />
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/profile" element={<Profile />} />
          <Route path="/project" element={<ProjectListPage />} />
          <Route path="/project/:projectId" element={<ProjectPage />} />
          <Route
            path="/project/:projectId/milestone"
            element={<MilestoneListPage />}
          />
          <Route
            path="/project/:projectId/milestone/:milestoneId"
            element={<MilestonePage />}
          />
          <Route path="/project/:projectId/task" element={<TaskListPage />} />
          <Route
            path="/project/:projectId/task/:taskId"
            element={<TaskPage />}
          />
          <Route path="*" element={<Navigate to="/project" />} />
        </Routes>
      </Suspense>
    </AuthProvider>
  );
}

export default App;
