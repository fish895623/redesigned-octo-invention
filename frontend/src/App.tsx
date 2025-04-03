import './App.css';
import { AuthProvider } from './context/AuthContext';
import NavigationBar from './components/ui/Navigation/NavigationBar';
import { Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { LoadingSpinner } from './components/ui/Loading/LoadingSpinner';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { ProjectProvider } from './context/ProjectContext';

// Lazy load page components for better performance
const Profile = lazy(() => import('./ProfilePage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const UserRegister = lazy(() => import('./pages/UserRegister'));
const ProjectListPage = lazy(() => import('./pages/ProjectListPage'));
const ProjectPage = lazy(() => import('./pages/ProjectPage'));
const MilestoneListPage = lazy(() => import('./pages/MilestoneListPage'));
const MilestonePage = lazy(() => import('./pages/MilestonePage'));
const TaskListPage = lazy(() => import('./pages/TaskListPage'));
const TaskPage = lazy(() => import('./pages/TaskPage'));

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
          <Route path="/register" element={<UserRegister />} />

          {/* Protected routes */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Project routes with ProjectProvider */}
          <Route
            path="/project"
            element={
              <ProtectedRoute>
                <ProjectProvider>
                  <ProjectListPage />
                </ProjectProvider>
              </ProtectedRoute>
            }
          />
          <Route
            path="/project/:projectId"
            element={
              <ProtectedRoute>
                <ProjectProvider>
                  <ProjectPage />
                </ProjectProvider>
              </ProtectedRoute>
            }
          />
          <Route
            path="/project/:projectId/milestone"
            element={
              <ProtectedRoute>
                <ProjectProvider>
                  <MilestoneListPage />
                </ProjectProvider>
              </ProtectedRoute>
            }
          />
          <Route
            path="/project/:projectId/milestone/:milestoneId"
            element={
              <ProtectedRoute>
                <ProjectProvider>
                  <MilestonePage />
                </ProjectProvider>
              </ProtectedRoute>
            }
          />
          <Route
            path="/project/:projectId/task"
            element={
              <ProtectedRoute>
                <ProjectProvider>
                  <TaskListPage />
                </ProjectProvider>
              </ProtectedRoute>
            }
          />
          <Route
            path="/project/:projectId/task/:taskId"
            element={
              <ProtectedRoute>
                <ProjectProvider>
                  <TaskPage />
                </ProjectProvider>
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
