import { useState, useCallback, useMemo } from "react";
import { useProject } from "../../context/ProjectContextDefinition";
import { Project, Milestone } from "../../types/project";
import CreateMilestoneModal from "../modals/CreateMilestoneModal";
import { Link } from "react-router-dom";
import CreateMilestoneModal from "../modals/CreateMilestoneModal";

interface MilestoneListProps {
  onSelectMilestone?: (id: string) => void;
  projectId: string;
}

const MilestoneList = ({
  onSelectMilestone,
  projectId,
}: MilestoneListProps) => {
  const { projects, updateProject, deleteProject } = useProject();
  const [editingMilestoneId, setEditingMilestoneId] = useState<string | null>(
    null
  );
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [showMilestoneModal, setShowMilestoneModal] = useState(false);
  const [sortBy, setSortBy] = useState<"created" | "updated">("updated");

  const handleEditMilestone = useCallback((milestone: Milestone) => {
    setEditingMilestoneId(milestone.id);
    setEditTitle(milestone.title);
    setEditDescription(milestone.description || "");
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
        setEditingMilestoneId(null);
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
    <div className="w-full max-w-7xl mx-auto bg-gray-900 rounded-lg shadow-md overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 border-b border-gray-700">
        <div>
          <h2 className="text-xl font-bold text-white">Milestones</h2>
          <div className="text-sm text-blue-400 font-medium mt-1">
            Total Milestones:{" "}
            <span className="bg-blue-600 text-white px-2 py-0.5 rounded-full ml-1">
              {projects.length}
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
      <div className="p-4 flex flex-col gap-4"></div>
      {showMilestoneModal && (
        <CreateMilestoneModal
          onClose={() => setShowMilestoneModal(false)}
          projectId={projectId}
        />
      )}
    </div>
  );
};

export default MilestoneList;
