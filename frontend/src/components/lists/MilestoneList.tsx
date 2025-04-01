import { useState, useCallback, useMemo } from "react";
import { useProject } from "../../context/ProjectContextDefinition";
import { Project, Milestone } from "../../types/project";
import CreateMilestoneModal from "../modals/CreateMilestoneModal";
import { Link } from "react-router-dom";

interface MilestoneListProps {
  projectId: string;
  onSelectMilestone?: (id: string) => void;
}

const MilestoneList = ({
  projectId,
  onSelectMilestone,
}: MilestoneListProps) => {
  const { projects, updateProject } = useProject();
  const [editingMilestoneId, setEditingMilestoneId] = useState<string | null>(
    null
  );
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [showMilestoneModal, setShowMilestoneModal] = useState(false);
  const [sortBy, setSortBy] = useState<"created" | "updated">("updated");

  const project = useMemo(() => {
    return projects.find((p) => p.id === projectId);
  }, [projects, projectId]);

  const milestones = useMemo(() => {
    return project?.milestones || [];
  }, [project]);

  const handleEditMilestone = useCallback((milestone: Milestone) => {
    setEditingMilestoneId(milestone.id);
    setEditTitle(milestone.title);
    setEditDescription(milestone.description || "");
  }, []);

  const handleSaveEdit = useCallback(
    (milestone: Milestone) => {
      if (!project || !editTitle.trim()) return;

      const updatedMilestones = project.milestones.map((m) =>
        m.id === milestone.id
          ? {
              ...m,
              title: editTitle.trim(),
              description: editDescription.trim() || undefined,
              updatedAt: new Date(),
            }
          : m
      );

      updateProject({
        ...project,
        milestones: updatedMilestones,
      });
      setEditingMilestoneId(null);
    },
    [editTitle, editDescription, project, updateProject]
  );

  const handleDeleteMilestone = useCallback(
    (milestoneId: string) => {
      if (
        !project ||
        !window.confirm("Are you sure you want to delete this milestone?")
      )
        return;

      const updatedMilestones = project.milestones.filter(
        (m) => m.id !== milestoneId
      );

      updateProject({
        ...project,
        milestones: updatedMilestones,
      });
    },
    [project, updateProject]
  );

  const sortedMilestones = useMemo(() => {
    return [...milestones].sort((a, b) => {
      const dateA = sortBy === "created" ? a.createdAt : a.updatedAt;
      const dateB = sortBy === "created" ? b.createdAt : b.updatedAt;
      return dateB.getTime() - dateA.getTime();
    });
  }, [milestones, sortBy]);

  if (!project) {
    return <div className="text-white">Project not found</div>;
  }

  return (
    <div className="w-full max-w-7xl mx-auto bg-gray-900 rounded-lg shadow-md overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 border-b border-gray-700">
        <div>
          <h2 className="text-xl font-bold text-white">Milestones</h2>
          <div className="text-sm text-blue-400 font-medium mt-1">
            Total Milestones:{" "}
            <span className="bg-blue-600 text-white px-2 py-0.5 rounded-full ml-1">
              {milestones.length}
            </span>
          </div>
        </div>
        <div className="flex gap-4 items-center mt-4 sm:mt-0">
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
            onClick={() => setShowMilestoneModal(true)}
          >
            Add Milestone
          </button>
        </div>
      </div>
      <div className="p-4 flex flex-col gap-4">
        {sortedMilestones.map((milestone) => (
          <div
            key={milestone.id}
            className="flex items-start gap-4 p-4 border border-gray-700 rounded-md bg-gray-800"
            onClick={() => onSelectMilestone && onSelectMilestone(milestone.id)}
          >
            {editingMilestoneId === milestone.id ? (
              <div className="flex-1 flex flex-col gap-2">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onBlur={() => handleSaveEdit(milestone)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && handleSaveEdit(milestone)
                  }
                  className="p-2 border border-gray-700 rounded-md w-full bg-gray-800 text-white"
                />
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  onBlur={() => handleSaveEdit(milestone)}
                  placeholder="Add description..."
                  className="p-2 border border-gray-700 rounded-md w-full bg-gray-800 text-white min-h-[100px] resize-y"
                />
              </div>
            ) : (
              <Link
                to={`/project/${projectId}/milestone/${milestone.id}`}
                className="flex-1 cursor-pointer no-underline text-inherit"
              >
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2 text-left">
                    {milestone.title}
                  </h3>
                  {milestone.description && (
                    <p className="text-gray-400 text-sm whitespace-pre-wrap text-left">
                      {milestone.description}
                    </p>
                  )}
                </div>
                <div className="flex gap-4 mb-2 text-sm text-gray-300">
                  <span>Tasks: {milestone.tasks.length}</span>
                </div>
                <div className="flex gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    Updated: {new Date(milestone.updatedAt).toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1">
                    Created: {new Date(milestone.createdAt).toLocaleString()}
                  </span>
                </div>
              </Link>
            )}
            <div className="flex gap-2">
              <button
                className="inline-block px-2 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  window.location.href = `/project/${projectId}/milestone/${milestone.id}`;
                }}
              >
                More
              </button>
              <button
                className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditMilestone(milestone);
                }}
              >
                Edit
              </button>
              <button
                className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteMilestone(milestone.id);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      {showMilestoneModal && (
        <CreateMilestoneModal
          projectId={projectId}
          onClose={() => setShowMilestoneModal(false)}
        />
      )}
    </div>
  );
};

export default MilestoneList;
