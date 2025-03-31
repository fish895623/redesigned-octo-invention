import { useState, useEffect } from "react";
import { useProjects } from "../hooks/useProjects";
import { Project } from "../types/project";
import MilestoneList from "./MilestoneList";
import TaskList from "./TaskList";
import CreateMilestoneModal from "./modal/CreateMilestoneModal";

interface ProjectDetailProps {
  projectId: string;
}

const ProjectDetail = ({ projectId }: ProjectDetailProps) => {
  const { projects, updateProject, deleteProject } = useProjects();
  const [project, setProject] = useState<Project | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [activeTab, setActiveTab] = useState<"milestones" | "tasks">(
    "milestones",
  );
  const [showMilestoneModal, setShowMilestoneModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleCloseMilestoneModal = () => {
    setShowMilestoneModal(false);
  };

  useEffect(() => {
    // Find the project in the projects array
    const foundProject = projects.find((p) => p.id === projectId);
    if (foundProject) {
      setProject(foundProject);
      setTitle(foundProject.title);
      setDescription(foundProject.description || "");
      setLoading(false);
    } else if (projects.length > 0) {
      // If we have projects but didn't find this one
      setError("Project not found");
      setLoading(false);
    }
  }, [projectId, projects]);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (project && title.trim()) {
      const updatedProject = {
        ...project,
        title: title.trim(),
        description: description.trim() || undefined,
        updatedAt: new Date(),
      };
      updateProject(updatedProject);
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    if (
      project &&
      window.confirm("Are you sure you want to delete this project?")
    ) {
      deleteProject(project.id);
    }
  };

  if (loading) {
    return <div>Loading project...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!project) {
    return <div className="error">Project not found</div>;
  }

  return (
    <div className="project-detail">
      {isEditing ? (
        <form onSubmit={handleUpdate} className="edit-project-form">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description (optional)"
          />
          <div className="form-actions">
            <button type="submit">Save</button>
            <button type="button" onClick={() => setIsEditing(false)}>
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="project-header">
          <div>
            <h2>{project.title}</h2>
            {project.description && <p>{project.description}</p>}
          </div>
          <div className="project-actions">
            <button onClick={() => setIsEditing(true)}>Edit</button>
            <button onClick={handleDelete} className="delete-button">
              Delete
            </button>
          </div>
        </div>
      )}
      <div className="project-tabs">
        <button
          className={activeTab === "milestones" ? "active" : ""}
          onClick={() => setActiveTab("milestones")}
        >
          Milestones ({project.milestones.length})
        </button>
        <button
          className={activeTab === "tasks" ? "active" : ""}
          onClick={() => setActiveTab("tasks")}
        >
          Tasks ({project.tasks.length})
        </button>
      </div>
      {showMilestoneModal && (
        <CreateMilestoneModal
          projectId={project.id}
          onClose={handleCloseMilestoneModal}
        />
      )}
      <div className="tab-content">
        {activeTab === "milestones" ? (
          <MilestoneList
            projectId={project.id}
            milestones={project.milestones}
          />
        ) : (
          <TaskList
            projectId={project.id}
            tasks={project.tasks}
            milestones={project.milestones}
          />
        )}
      </div>
    </div>
  );
};

export default ProjectDetail;
