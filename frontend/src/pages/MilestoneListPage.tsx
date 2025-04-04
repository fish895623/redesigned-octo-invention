/**
 * @file MilestoneListPage.tsx
 * @description This file is the main component for the MilestoneListPage.
 * It displays a list of milestones for a given project.
 */
import { useParams } from 'react-router-dom';
import { ProjectProvider } from '../context/ProjectContext';
import { useAuth } from '../hooks/useAuth';
import MilestoneList from '../components/lists/MilestoneList';
import { useProject } from '../context/ProjectContext';

const MilestoneListContent = () => {
  const { projectId: projectIdStr } = useParams<{ projectId: string }>();
  const { projects } = useProject();

  if (!projectIdStr) {
    return <div className="error">Project ID is required</div>;
  }

  const projectId = Number(projectIdStr);
  const project = projects.find((p) => p.id === projectId);

  if (!project) {
    return <div className="error">Project not found</div>;
  }

  return (
    <div className="w-full p-0 md:p-2 mt-16">
      <MilestoneList projectId={projectId} milestones={project.milestones} />
    </div>
  );
};

const MilestoneListPage = () => {
  const { loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <ProjectProvider>
      <MilestoneListContent />
    </ProjectProvider>
  );
};

export default MilestoneListPage;
