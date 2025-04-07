import { useParams } from 'react-router-dom';
import { ProjectProvider } from '../context/ProjectContext';
import ProjectDetail from '../components/details/ProjectDetail';
import { useAuth } from '../hooks/useAuth';

const ProjectPage = () => {
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
      <div className="w-full p-0 md:p-2 mt-16">
        <ProjectDetail projectId={Number(projectId)} />
      </div>
    </ProjectProvider>
  );
};

export default ProjectPage;
