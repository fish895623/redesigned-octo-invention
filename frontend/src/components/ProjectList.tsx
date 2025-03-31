import { useState, useCallback, useMemo } from "react";
import { useProject } from "../context/ProjectContext";
import { Project } from "../types/project";
import CreateProjectModal from "./modal/CreateProjectModal";
import { Link } from "react-router-dom";
import "../css/ProjectList.css";

interface ProjectListProps {
  onSelectProject?: (id: string) => void;
}

// Main ProjectList component
const ProjectList = ({}: ProjectListProps) => {
  const { projects, updateProject, deleteProject } = useProject();
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [sortBy, setSortBy] = useState<"created" | "updated">("updated");

  // Callbacks to avoid unnecessary rerenders
  const handleEditProject = useCallback((project: Project) => {
    setEditingProjectId(project.id);
    setEditTitle(project.title);
    setEditDescription(project.description || "");
  }, []);

  const handleSaveEdit = useCallback(
    (project: Project) => {
      if (editTitle.trim()) {
        updateProject({
          ...project,
          title: editTitle.trim(),
          description: editDescription.trim() || undefined,
          updatedAt: new Date(),
        });
        setEditingProjectId(null);
      }
    },
    [editTitle, editDescription, updateProject],
  );

  const handleDeleteProject = useCallback(
    (projectId: string) => {
      if (window.confirm("Are you sure you want to delete this project?")) {
        deleteProject(projectId);
      }
    },
    [deleteProject],
  );

  // Sort projects by either created or updated time
  const sortedProjects = useMemo(() => {
    return [...projects].sort((a, b) => {
      const dateA = sortBy === "created" ? a.createdAt : a.updatedAt;
      const dateB = sortBy === "created" ? b.createdAt : b.updatedAt;
      return dateB.getTime() - dateA.getTime();
    });
  }, [projects, sortBy]);

  return (
    <div className="project-list">
      <div className="project-list-header">
        <h2>Projects</h2>
        <div className="project-list-controls">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          >
            <option value="updated">Sort by Updated</option>
            <option value="created">Sort by Created</option>
          </select>
          <button onClick={() => setShowProjectModal(true)}>Add Project</button>
        </div>
      </div>
      <div className="project-list-content">
        {sortedProjects.map((project) => (
          <div key={project.id} className="project-item">
            {editingProjectId === project.id ? (
              <div className="project-edit">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onBlur={() => handleSaveEdit(project)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && handleSaveEdit(project)
                  }
                />
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  onBlur={() => handleSaveEdit(project)}
                  placeholder="Add description..."
                />
              </div>
            ) : (
              <Link
                to={`/project/${project.id}/milestone`}
                className="project-content"
                style={{
                  cursor: "pointer",
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                <div className="project-title">{project.title}</div>
                {project.description && (
                  <div className="project-description">
                    {project.description}
                  </div>
                )}
                <div className="project-stats">
                  <span>Milestones: {project.milestones.length}</span>
                  <span>Tasks: {project.tasks.length}</span>
                </div>
                <div className="project-meta">
                  <span className="project-date">
                    Updated: {new Date(project.updatedAt).toLocaleString()}
                  </span>
                  <span className="project-date">
                    Created: {new Date(project.createdAt).toLocaleString()}
                  </span>
                </div>
              </Link>
            )}
            <div className="project-actions">
              <button
                className="button"
                style={{ display: "inline-block", textDecoration: "none" }}
                onClick={() =>
                  (window.location.href = `/project/${project.id}`)
                }
              >
                More
              </button>
              <button
                className="edit"
                onClick={() => handleEditProject(project)}
              >
                Edit
              </button>
              <button
                className="delete"
                onClick={() => handleDeleteProject(project.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      {showProjectModal && (
        <CreateProjectModal onClose={() => setShowProjectModal(false)} />
      )}
    </div>
  );
};

export default ProjectList;
