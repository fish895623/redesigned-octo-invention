import { useParams, Link } from 'react-router-dom';
import { ProjectProvider } from '../context/ProjectContext';
import TaskList from '../components/lists/TaskList';
import { useAuth } from '../hooks/useAuth';

const TaskListPage = () => {
  const { loading } = useAuth();
  const { projectId } = useParams<{ projectId: string }>();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!projectId) {
    return <div className="error">Project ID is required</div>;
  }

  return (
    <ProjectProvider>
      <div className="app-container">
        <div className="navigation-buttons">
          <Link to={`/project/${projectId}`} className="back-button">
            Back to Project
          </Link>
        </div>
        <TaskList projectId={Number(projectId)} />
      </div>
    </ProjectProvider>
  );
};

export default TaskListPage;
