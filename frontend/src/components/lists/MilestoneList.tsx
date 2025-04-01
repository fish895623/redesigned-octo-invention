/**
 * This component is used to display a list of milestones under the projects.
 * This requests to /api/projects/:projectId/milestones.
 * Authentication is requested.
 */
import { useState, useCallback, useMemo } from "react";
import { useProject } from "../../context/ProjectContextDefinition";
import { Project, Milestone } from "../../types/project";
import CreateMilestoneModal from "../modals/CreateMilestoneModal";

interface MilestoneListProps {
  onSelectMilestone?: (id: string) => void;
  projectId: string;
}

const MilestoneList = ({
  onSelectMilestone,
  projectId,
}: MilestoneListProps) => {
  const { milestones } = useProject();
  const [showMilestoneModal, setShowMilestoneModal] = useState(false);
  const [sortBy, setSortBy] = useState<"created" | "updated">("updated");

  return (
    <div className="w-full max-w-7xl mx-auto bg-gray-900 rounded-lg shadow-md overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 border-b border-gray-700">
        <div>
          <h2 className="text-xl font-bold text-white">Milestones</h2>
          <div className="text-sm text-blue-400 font-medium mt-1">
            Total Milestones:{" "}
            <span className="bg-blue-600 text-white px-2 py-0.5 rounded-full ml-1">
              {/* {milestones.length} */}
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
