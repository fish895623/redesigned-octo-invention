import { useParams } from "react-router-dom";
import { ProjectProvider } from "../context/ProjectContext";
import MilestoneDetail from "../components/details/MilestoneDetail";
import { useAuth } from "../hooks/useAuth";

const MilestonePage = () => {
  const { loading } = useAuth();
  const { projectId, milestoneId } = useParams<{
    projectId: string;
    milestoneId: string;
  }>();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!projectId || !milestoneId) {
    return (
      <div className="error">Project ID and Milestone ID are required</div>
    );
  }

  return (
    <ProjectProvider>
      <div className="app-container">
        <MilestoneDetail projectId={projectId} milestoneId={milestoneId} />
      </div>
    </ProjectProvider>
  );
};

export default MilestonePage;
