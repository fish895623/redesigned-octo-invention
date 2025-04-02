import { ProjectProvider } from "../context/ProjectContext";
import ProjectList from "../components/lists/ProjectList";

const ProjectListPage = () => {
  return (
    <ProjectProvider>
      {/* Container with no padding on mobile and minimal padding on larger screens */}
      <div className="w-full p-0 md:p-2 mt-16">
        <ProjectList />
      </div>
    </ProjectProvider>
  );
};

export default ProjectListPage;
