import { useState, useCallback, useMemo } from "react";
import { useProject } from "../../context/ProjectContextDefinition";
import { Milestone } from "../../types/project";
import { Link } from "react-router-dom";
import CreateMilestoneModal from "../modals/CreateMilestoneModal";

interface MilestoneListProps {
  projectId: string;
}

const MilestoneList = ({ projectId }: MilestoneListProps) => {
  const handleNewMilestone = async () => {
    // using fetch post request to create a new milestone
    const response = await fetch(`/api/projects/${projectId}/milestones`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: "New Milestone",
        description: "New Milestone Description",
        dueDate: new Date(),
      }),
    });
    await response.json();
  };

  return (
    <>
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        onClick={handleNewMilestone}
      >
        New Milestone
      </button>
    </>
  );
};

export default MilestoneList;
