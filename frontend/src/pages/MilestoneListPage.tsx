import { useParams } from "react-router-dom";
import { ProjectProvider } from "../context/ProjectContext";
import { useAuth } from "../hooks/useAuth";
import MilestoneList from "../components/lists/MilestoneList";

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
      {/* Container with no padding on mobile and minimal padding on larger screens */}
      <div className="w-full p-0 md:p-2 mt-16">
        <MilestoneList projectId={projectId} />
      </div>
    </ProjectProvider>
  );
};

export default MilestoneListPage;
