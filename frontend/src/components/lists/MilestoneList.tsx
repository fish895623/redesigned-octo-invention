import { useState, useCallback, useMemo } from "react";
import { useProject } from "../../context/ProjectContextDefinition";
import { Milestone } from "../../types/project";
import { Link } from "react-router-dom";
import CreateMilestoneModal from "../modals/CreateMilestoneModal";

interface MilestoneListProps {
  projectId: string;
}

const MilestoneList = ({ projectId }: MilestoneListProps) => {
  const { projects, updateMilestone, deleteMilestone } = useProject();
  const [editingMilestoneId, setEditingMilestoneId] = useState<string | null>(
    null
  );
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [showMilestoneModal, setShowMilestoneModal] = useState(false);
  const [sortBy, setSortBy] = useState<"created" | "updated" | "dueDate">(
    "dueDate"
  );

  // Find the current project
  const currentProject = useMemo(() => {
    return projects.find((p) => p.id === projectId);
  }, [projects, projectId]);

  // Callbacks to avoid unnecessary rerenders
  const handleEditMilestone = useCallback((milestone: Milestone) => {
    setEditingMilestoneId(milestone.id);
    setEditTitle(milestone.title);
    setEditDescription(milestone.description || "");
  }, []);

  const handleSaveEdit = useCallback(
    (milestone: Milestone) => {
      if (editTitle.trim()) {
        updateMilestone({
          ...milestone,
          title: editTitle.trim(),
          description: editDescription.trim() || undefined,
          updatedAt: new Date(),
        });
        setEditingMilestoneId(null);
      }
    },
    [editTitle, editDescription, updateMilestone]
  );

  const handleDeleteMilestone = useCallback(
    (milestoneId: string) => {
      if (window.confirm("Are you sure you want to delete this milestone?")) {
        deleteMilestone(projectId, milestoneId);
      }
    },
    [deleteMilestone, projectId]
  );

  // Sort milestones by either created, updated time or due date
  const sortedMilestones = useMemo(() => {
    if (!currentProject) return [];

    return [...currentProject.milestones].sort((a, b) => {
      if (sortBy === "created") {
        return b.createdAt.getTime() - a.createdAt.getTime();
      } else if (sortBy === "updated") {
        return b.updatedAt.getTime() - a.updatedAt.getTime();
      } else if (sortBy === "dueDate") {
        // Handle milestones without due dates (place them at the end)
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return a.dueDate.getTime() - b.dueDate.getTime();
      }
      return 0;
    });
  }, [currentProject, sortBy]);

  if (!currentProject) {
    return <div className="text-white">Project not found</div>;
  }

  return (
    <div className="w-full max-w-7xl mx-auto bg-gray-900 rounded-lg shadow-md overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 border-b border-gray-700">
        <div>
          <Link
            to="/projects"
            className="text-blue-400 hover:text-blue-300 mb-2 inline-block"
          >
            ← Back to Projects
          </Link>
          <h2 className="text-xl font-bold text-white">
            Milestones for {currentProject.title}
          </h2>
          <div className="text-sm text-blue-400 font-medium mt-1">
            Total Milestones:{" "}
            <span className="bg-blue-600 text-white px-2 py-0.5 rounded-full ml-1">
              {currentProject.milestones.length}
            </span>
          </div>
        </div>
        <div className="flex gap-4 items-center mt-4 sm:mt-0">
          <select
            className="p-2 border border-gray-700 rounded-md bg-gray-800 text-white"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          >
            <option value="dueDate">Sort by Due Date</option>
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
        {sortedMilestones.length > 0 ? (
          sortedMilestones.map((milestone) => (
            <div
              key={milestone.id}
              className="flex items-start gap-4 p-4 border border-gray-700 rounded-md bg-gray-800"
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
                    <span
                      className={`${
                        milestone.completed
                          ? "text-green-400"
                          : "text-orange-400"
                      }`}
                    >
                      Status:{" "}
                      {milestone.completed ? "Completed" : "In Progress"}
                    </span>
                    <span>Tasks: {milestone.tasks.length}</span>
                  </div>
                  {milestone.dueDate && (
                    <div className="text-sm text-gray-400 mb-2">
                      Due: {new Date(milestone.dueDate).toLocaleDateString()}
                    </div>
                  )}
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
          ))
        ) : (
          <div className="text-center py-6 text-gray-400">
            No milestones found. Click "Add Milestone" to create one.
          </div>
        )}
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
