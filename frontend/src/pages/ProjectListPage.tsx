import { ProjectProvider } from "../context/ProjectContext";
import ProjectList from "../components/ProjectList";

const ProjectListPage = () => {
  return (
    <ProjectProvider>
      <div className="container mx-auto px-4 py-8">
        <ProjectList />
      </div>
    </ProjectProvider>
  );
};

export default ProjectListPage;
