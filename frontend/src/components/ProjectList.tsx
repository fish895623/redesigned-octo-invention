import { useState, useCallback, useMemo } from "react";
import { useProject } from "../context/ProjectContextDefinition";
import { Project } from "../types/project";
import CreateProjectModal from "./modal/CreateProjectModal";
import { Link } from "react-router-dom";

interface ProjectListProps {
  onSelectProject?: (id: string) => void;
}

// Main ProjectList component
const ProjectList = ({ onSelectProject }: ProjectListProps) => {
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
    [editTitle, editDescription, updateProject]
  );

  const handleDeleteProject = useCallback(
    (projectId: string) => {
      if (window.confirm("Are you sure you want to delete this project?")) {
        deleteProject(projectId);
      }
    },
    [deleteProject]
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
    <div className="w-full p-4 bg-gray-900 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-bold text-white">Projects</h2>
          <div className="text-sm text-blue-400 font-medium mt-1">
            Total Projects:{" "}
            <span className="bg-blue-600 text-white px-2 py-0.5 rounded-full ml-1">
              {projects.length}
            </span>
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <select
            className="p-2 border border-gray-700 rounded-md bg-gray-800 text-white"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          >
            <option value="updated">Sort by Updated</option>
            <option value="created">Sort by Created</option>
          </select>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            onClick={() => setShowProjectModal(true)}
          >
            Add Project
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        {sortedProjects.map((project) => (
          <div
            key={project.id}
            className="flex items-start gap-4 p-4 border border-gray-700 rounded-md bg-gray-800"
            onClick={() => onSelectProject && onSelectProject(project.id)}
          >
            {editingProjectId === project.id ? (
              <div className="flex-1 flex flex-col gap-2">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onBlur={() => handleSaveEdit(project)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && handleSaveEdit(project)
                  }
                  className="p-2 border border-gray-700 rounded-md w-full bg-gray-800 text-white"
                />
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  onBlur={() => handleSaveEdit(project)}
                  placeholder="Add description..."
                  className="p-2 border border-gray-700 rounded-md w-full bg-gray-800 text-white min-h-[100px] resize-y"
                />
              </div>
            ) : (
              <Link
                to={`/project/${project.id}/milestone`}
                className="flex-1 cursor-pointer no-underline text-inherit"
              >
                <div className="font-semibold mb-2 text-white">
                  {project.title}
                </div>
                {project.description && (
                  <div className="text-gray-400 mb-2">
                    {project.description}
                  </div>
                )}
                <div className="flex gap-4 mb-2 text-sm text-gray-300">
                  <span>Milestones: {project.milestones.length}</span>
                  <span>Tasks: {project.tasks.length}</span>
                </div>
                <div className="flex gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    Updated: {new Date(project.updatedAt).toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1">
                    Created: {new Date(project.createdAt).toLocaleString()}
                  </span>
                </div>
              </Link>
            )}
            <div className="flex gap-2">
              <button
                className="inline-block px-2 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  window.location.href = `/project/${project.id}`;
                }}
              >
                More
              </button>
              <button
                className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditProject(project);
                }}
              >
                Edit
              </button>
              <button
                className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteProject(project.id);
                }}
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
