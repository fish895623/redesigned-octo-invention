import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProject } from "../context/ProjectContextDefinition";
import { ProjectProvider } from "../context/ProjectContext";
import { useAuth } from "../hooks/useAuth";

const MilestoneDetails = () => {
  const { projectId, milestoneId } = useParams<{
    projectId: string;
    milestoneId: string;
  }>();
  const navigate = useNavigate();
  const { projects, updateProject } = useProject();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const project = useMemo(() => {
    return projects.find((p) => p.id === projectId);
  }, [projects, projectId]);

  const milestone = useMemo(() => {
    return project?.milestones.find((m) => m.id === milestoneId);
  }, [project, milestoneId]);

  useEffect(() => {
    if (milestone) {
      setTitle(milestone.title);
      setDescription(milestone.description || "");
    }
  }, [milestone]);

  const handleSave = () => {
    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    if (!project || !milestone) {
      setError("Project or milestone not found");
      return;
    }

    const updatedMilestones = project.milestones.map((m) =>
      m.id === milestoneId
        ? {
            ...m,
            title: title.trim(),
            description: description.trim() || undefined,
            updatedAt: new Date(),
          }
        : m
    );

    updateProject({
      ...project,
      milestones: updatedMilestones,
    });

    setIsEditing(false);
    setError(null);
  };

  const handleToggleComplete = () => {
    if (!project || !milestone) return;

    const updatedMilestones = project.milestones.map((m) =>
      m.id === milestoneId
        ? {
            ...m,
            completed: !m.completed,
            updatedAt: new Date(),
          }
        : m
    );

    updateProject({
      ...project,
      milestones: updatedMilestones,
    });
  };

  const handleDelete = () => {
    if (!project || !milestone) return;
    if (!window.confirm("Are you sure you want to delete this milestone?"))
      return;

    const updatedMilestones = project.milestones.filter(
      (m) => m.id !== milestoneId
    );

    updateProject({
      ...project,
      milestones: updatedMilestones,
    });

    navigate(`/project/${projectId}/milestone`);
  };

  if (!milestone) {
    return <div className="text-white p-4">Milestone not found</div>;
  }

  return (
    <div className="w-full max-w-4xl mx-auto bg-gray-900 rounded-lg shadow-md p-6">
      <div className="mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            {isEditing ? (
              <div className="mb-4">
                {error && (
                  <div className="mb-4 p-2 bg-red-600 bg-opacity-25 border border-red-700 rounded text-red-100">
                    {error}
                  </div>
                )}
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white text-xl font-bold"
                />
              </div>
            ) : (
              <h1 className="text-2xl font-bold text-white mb-2">
                {milestone.title}
              </h1>
            )}
            <div className="text-sm text-gray-400">
              <div className="flex gap-4 mb-2">
                <span>Project: {project?.title}</span>
                <span>
                  Status: {milestone.completed ? "Completed" : "In Progress"}
                </span>
              </div>
              <div className="flex gap-4">
                <span>
                  Created: {new Date(milestone.createdAt).toLocaleString()}
                </span>
                <span>
                  Updated: {new Date(milestone.updatedAt).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Save
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={handleToggleComplete}
                  className={`px-3 py-1 rounded transition-colors ${
                    milestone.completed
                      ? "bg-green-700 hover:bg-green-800 text-white"
                      : "bg-gray-700 hover:bg-gray-600 text-white"
                  }`}
                >
                  {milestone.completed ? "Completed" : "Mark Complete"}
                </button>
                <button
                  onClick={handleDelete}
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </>
            )}
          </div>
        </div>

        {isEditing ? (
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded text-white min-h-[150px] mb-4"
            placeholder="Enter milestone description..."
          />
        ) : (
          <div className="mt-4 text-gray-300 whitespace-pre-wrap">
            {milestone.description || "No description provided."}
          </div>
        )}
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold text-white mb-4">
          Tasks ({milestone.tasks.length})
        </h2>
        {milestone.tasks.length === 0 ? (
          <div className="text-gray-400 p-4 bg-gray-800 rounded">
            No tasks have been added to this milestone yet.
          </div>
        ) : (
          <div className="space-y-3">
            {milestone.tasks.map((task) => (
              <div
                key={task.id}
                className="p-4 bg-gray-800 border border-gray-700 rounded"
              >
                <h3 className="text-lg font-semibold text-white">
                  {task.title}
                </h3>
                {task.description && (
                  <p className="text-gray-400 mt-1">{task.description}</p>
                )}
                <div className="flex justify-between mt-2 text-sm text-gray-500">
                  <span>
                    Status: {task.completed ? "Completed" : "In Progress"}
                  </span>
                  <span>
                    Updated: {new Date(task.updatedAt).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="mt-4">
          <button
            onClick={() =>
              navigate(
                `/project/${projectId}/task/new?milestoneId=${milestoneId}`
              )
            }
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Add Task
          </button>
        </div>
      </div>
    </div>
  );
};

const MilestonePage = () => {
  const { loading } = useAuth();

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <ProjectProvider>
      <div className="container mx-auto p-4">
        <MilestoneDetails />
      </div>
    </ProjectProvider>
  );
};

export default MilestonePage;
