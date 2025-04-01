import { useParams } from "react-router-dom";
import { ProjectProvider } from "../context/ProjectContext";
import MilestoneList from "../components/lists/MilestoneList";
import { useAuth } from "../hooks/useAuth";

const MilestoneListPage = () => {
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
        <MilestoneList projectId={projectId} />
      </div>
    </ProjectProvider>
  );
};

export default MilestoneListPage;
