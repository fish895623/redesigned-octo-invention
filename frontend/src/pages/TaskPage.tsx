import { useParams } from 'react-router-dom';
import { ProjectProvider } from '../context/ProjectContext';
import TaskDetail from '../components/details/TaskDetail';
import { useAuth } from '../hooks/useAuth';

const TaskPage = () => {
  const { loading } = useAuth();
  const { projectId, taskId } = useParams<{
    projectId: string;
    taskId: string;
  }>();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!projectId || !taskId) {
    return <div className="error">Project ID and Task ID are required</div>;
  }

  return (
    <ProjectProvider>
      <div className="w-full p-0 md:p-2 mt-16">
        <TaskDetail projectId={Number(projectId)} taskId={Number(taskId)} />
      </div>
    </ProjectProvider>
  );
};

export default TaskPage;
