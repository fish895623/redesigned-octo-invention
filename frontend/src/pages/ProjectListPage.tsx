import { ProjectProvider } from "../context/ProjectContext";
import ProjectList from "../components/ProjectList";

const ProjectListPage = () => {
  return (
    <ProjectProvider>
      <div className="app-container">
        <ProjectList />
      </div>
    </ProjectProvider>
  );
};

export default ProjectListPage;
