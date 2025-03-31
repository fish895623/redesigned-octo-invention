import { useState, useCallback, useMemo, useEffect } from "react";
import { useProject } from "../context/ProjectContext";
import { Milestone } from "../types/project";
import CreateMilestoneModal from "./modal/CreateMilestoneModal";
import "../css/MilestoneList.css";

interface MilestoneListProps {
  projectId: string;
  milestones?: Milestone[];
}

// Main MilestoneList component
const MilestoneList = ({ projectId }: MilestoneListProps) => {
  const { updateMilestone, deleteMilestone } = useProject();
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingMilestoneId, setEditingMilestoneId] = useState<string | null>(
    null,
  );
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [showMilestoneModal, setShowMilestoneModal] = useState(false);
  const [sortBy, setSortBy] = useState<"created" | "updated">("updated");

  // Helper function to convert array date format to JavaScript Date
  const convertArrayToDate = useCallback((dateArray: any): Date | null => {
    if (!dateArray) return null;

    // Check if it's an array format from the server
    if (Array.isArray(dateArray)) {
      try {
        // Handle full datetime array [year, month, day, hour, minute, second, nano]
        if (dateArray.length >= 3) {
          // Note: JavaScript months are 0-indexed, but the server sends 1-indexed months
          const year = dateArray[0];
          const month = dateArray[1] - 1; // Subtract 1 to convert to JS month (0-11)
          const day = dateArray[2];

          // If we have time components
          if (dateArray.length >= 6) {
            const hour = dateArray[3];
            const minute = dateArray[4];
            const second = dateArray[5];
            return new Date(year, month, day, hour, minute, second);
          }

          // If we only have date components
          return new Date(year, month, day);
        }
      } catch (e) {
        console.error("Error converting date array:", dateArray, e);
      }
    }

    // If it's already a Date object
    if (dateArray instanceof Date) {
      return dateArray;
    }

    // If it's a string or timestamp
    if (dateArray) {
      try {
        const date = new Date(dateArray);
        return isNaN(date.getTime()) ? null : date;
      } catch (e) {
        console.error("Error converting date value:", dateArray, e);
      }
    }

    return null;
  }, []);

  // Helper function to safely format dates
  const formatDate = useCallback(
    (dateValue: any): string => {
      const date = convertArrayToDate(dateValue);
      if (!date) return "N/A";
      return date.toLocaleString();
    },
    [convertArrayToDate],
  );

  // Fetch milestones from API
  useEffect(() => {
    const fetchMilestones = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/projects/${projectId}/milestones`);
        if (!response.ok) {
          throw new Error(`Failed to fetch milestones: ${response.statusText}`);
        }
        const data = await response.json();
        console.log("Raw milestone data from API:", data);

        // Process the data to ensure dates are properly formatted
        const processedData = data.map((milestone: any) => {
          console.log("Processing milestone:", milestone.id, {
            createdAt: milestone.createdAt,
            updatedAt: milestone.updatedAt,
            startDate: milestone.startDate,
            dueDate: milestone.dueDate,
          });

          // Convert all date fields using our array converter
          const processed = {
            ...milestone,
            createdAt: convertArrayToDate(milestone.createdAt) || new Date(),
            updatedAt: convertArrayToDate(milestone.updatedAt) || new Date(),
            startDate: convertArrayToDate(milestone.startDate),
            dueDate: convertArrayToDate(milestone.dueDate),
          };

          console.log("Processed milestone dates:", {
            id: milestone.id,
            createdAt: processed.createdAt,
            updatedAt: processed.updatedAt,
            startDate: processed.startDate,
            dueDate: processed.dueDate,
          });

          return processed;
        });

        setMilestones(processedData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred",
        );
        console.error("Error fetching milestones:", err);
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchMilestones();
    }
  }, [projectId, convertArrayToDate]);

  // Function to refresh milestones
  const refreshMilestones = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/projects/${projectId}/milestones`);
      if (!response.ok) {
        throw new Error(`Failed to refresh milestones: ${response.statusText}`);
      }
      const data = await response.json();
      console.log("Refresh: Raw milestone data from API:", data);

      // Process the data to ensure dates are properly formatted
      const processedData = data.map((milestone: any) => {
        console.log("Refresh: Processing milestone:", milestone.id, {
          createdAt: milestone.createdAt,
          updatedAt: milestone.updatedAt,
          startDate: milestone.startDate,
          dueDate: milestone.dueDate,
        });

        // Convert all date fields using our array converter
        const processed = {
          ...milestone,
          createdAt: convertArrayToDate(milestone.createdAt) || new Date(),
          updatedAt: convertArrayToDate(milestone.updatedAt) || new Date(),
          startDate: convertArrayToDate(milestone.startDate),
          dueDate: convertArrayToDate(milestone.dueDate),
        };

        console.log("Refresh: Processed milestone dates:", {
          id: milestone.id,
          createdAt: processed.createdAt,
          updatedAt: processed.updatedAt,
          startDate: processed.startDate,
          dueDate: processed.dueDate,
        });

        return processed;
      });

      setMilestones(processedData);
    } catch (err) {
      console.error("Error refreshing milestones:", err);
    } finally {
      setLoading(false);
    }
  }, [projectId, convertArrayToDate]);

  // Callbacks to avoid unnecessary rerenders
  const handleEditMilestone = useCallback((milestone: Milestone) => {
    setEditingMilestoneId(milestone.id);
    setEditTitle(milestone.title);
    setEditDescription(milestone.description || "");
  }, []);

  const handleSaveEdit = useCallback(
    async (milestone: Milestone) => {
      if (editTitle.trim()) {
        try {
          const response = await fetch(
            `/api/projects/${projectId}/milestones/${milestone.id}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                title: editTitle.trim(),
                description: editDescription.trim() || undefined,
              }),
            },
          );

          if (!response.ok) {
            throw new Error(
              `Failed to update milestone: ${response.statusText}`,
            );
          }

          // Update local state optimistically
          updateMilestone({
            ...milestone,
            title: editTitle.trim(),
            description: editDescription.trim() || undefined,
            updatedAt: new Date(),
          });

          // Refresh from server
          refreshMilestones();
        } catch (err) {
          console.error("Error updating milestone:", err);
        }

        setEditingMilestoneId(null);
      }
    },
    [editTitle, editDescription, updateMilestone, projectId, refreshMilestones],
  );

  const handleDeleteMilestone = useCallback(
    async (milestoneId: string) => {
      if (window.confirm("Are you sure you want to delete this milestone?")) {
        try {
          const response = await fetch(
            `/api/projects/${projectId}/milestones/${milestoneId}`,
            {
              method: "DELETE",
            },
          );

          if (!response.ok) {
            throw new Error(
              `Failed to delete milestone: ${response.statusText}`,
            );
          }

          // Update local state
          deleteMilestone(projectId, milestoneId);

          // Refresh from server
          refreshMilestones();
        } catch (err) {
          console.error("Error deleting milestone:", err);
        }
      }
    },
    [deleteMilestone, projectId, refreshMilestones],
  );

  const handleToggleMilestone = useCallback(
    async (milestone: Milestone) => {
      // Clone milestone to avoid direct state mutation
      const newCompletedState = !milestone.completed;
      const currentTimestamp = new Date();

      console.log("Toggling milestone:", milestone.id, {
        from: milestone.completed,
        to: newCompletedState,
        currentTimestamp,
      });

      // Immediately update local state for instantaneous UI feedback
      setMilestones((currentMilestones) =>
        currentMilestones.map((m) =>
          m.id === milestone.id
            ? {
                ...m,
                completed: newCompletedState,
                updatedAt: currentTimestamp,
              }
            : m,
        ),
      );

      // Also update the global state
      updateMilestone({
        ...milestone,
        completed: newCompletedState,
        updatedAt: currentTimestamp,
      });

      try {
        // Prepare request body with all fields
        interface MilestoneUpdateRequest {
          title: string;
          description?: string;
          completed: boolean;
          // Server expects dates in their original format when updating
          startDate?: any;
          dueDate?: any;
        }

        const requestBody: MilestoneUpdateRequest = {
          title: milestone.title,
          description: milestone.description,
          completed: newCompletedState,
        };

        // Include original date fields to preserve the format the server expects
        if (milestone.startDate) {
          requestBody.startDate = milestone.startDate;
        }

        if (milestone.dueDate) {
          requestBody.dueDate = milestone.dueDate;
        }

        console.log("Sending update to server:", requestBody);

        // Backend uses PUT for updates
        const response = await fetch(
          `/api/projects/${projectId}/milestones/${milestone.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
          },
        );

        if (!response.ok) {
          throw new Error(`Failed to toggle milestone: ${response.statusText}`);
        }

        // Log response data
        const responseData = await response.json().catch(() => null);
        console.log("Server response:", responseData);
      } catch (err) {
        console.error("Error toggling milestone completion:", err);

        // Revert both local and global state in case of error
        setMilestones((currentMilestones) =>
          currentMilestones.map((m) =>
            m.id === milestone.id
              ? {
                  ...m,
                  completed: milestone.completed,
                  updatedAt: milestone.updatedAt,
                }
              : m,
          ),
        );

        updateMilestone({
          ...milestone,
          completed: milestone.completed,
          updatedAt: milestone.updatedAt,
        });

        // Show error to user
        alert("Failed to update milestone status. Please try again.");
      }
    },
    [updateMilestone, projectId, setMilestones],
  );

  // Sort milestones by either created or updated time
  const sortedMilestones = useMemo(() => {
    return [...milestones].sort((a, b) => {
      const rawDateA = sortBy === "created" ? a.createdAt : a.updatedAt;
      const rawDateB = sortBy === "created" ? b.createdAt : b.updatedAt;

      // Convert dates using our date converter
      const dateA = convertArrayToDate(rawDateA);
      const dateB = convertArrayToDate(rawDateB);

      // Get timestamps (or default to 0 if null)
      const timeA = dateA ? dateA.getTime() : 0;
      const timeB = dateB ? dateB.getTime() : 0;

      return timeB - timeA; // Sort descending (newest first)
    });
  }, [milestones, sortBy, convertArrayToDate]);

  return (
    <div className="milestone-list">
      <div className="milestone-list-header">
        <h2>Milestones</h2>
        <div className="milestone-list-controls">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          >
            <option value="updated">Sort by Updated</option>
            <option value="created">Sort by Created</option>
          </select>
          <button onClick={() => setShowMilestoneModal(true)}>
            Add Milestone
          </button>
        </div>
      </div>
      <div className="milestone-list-content">
        {loading ? (
          <div className="loading-message">Loading milestones...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : sortedMilestones.length === 0 ? (
          <div className="empty-message">
            No milestones found for this project.
          </div>
        ) : (
          sortedMilestones.map((milestone) => (
            <div key={milestone.id} className="milestone-item">
              {editingMilestoneId === milestone.id ? (
                <div className="milestone-edit">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onBlur={() => handleSaveEdit(milestone)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && handleSaveEdit(milestone)
                    }
                  />
                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    onBlur={() => handleSaveEdit(milestone)}
                    placeholder="Add description..."
                  />
                </div>
              ) : (
                <div className="milestone-content">
                  <div className="milestone-header">
                    <div className="milestone-info">
                      <div>
                        <div
                          className={`milestone-title ${
                            milestone.completed ? "completed" : ""
                          }`}
                        >
                          <span className="milestone-id">
                            (ID: {milestone.id}){" "}
                          </span>
                          {milestone.title}
                        </div>
                        {milestone.description && (
                          <div className="milestone-description">
                            {milestone.description}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="milestone-actions">
                      <button
                        className={`toggle ${
                          milestone.completed ? "complete" : "incomplete"
                        }`}
                        onClick={() => handleToggleMilestone(milestone)}
                      >
                        {milestone.completed ? "Completed" : "Mark Complete"}
                      </button>
                      <button
                        onClick={() =>
                          (window.location.href = `/project/${projectId}/milestone/${milestone.id}`)
                        }
                        className="more-info-button"
                      >
                        More Info
                      </button>
                      <button
                        className="edit"
                        onClick={() => handleEditMilestone(milestone)}
                      >
                        Edit
                      </button>
                      <button
                        className="delete"
                        onClick={() => handleDeleteMilestone(milestone.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <div className="milestone-stats">
                    <span>Tasks: {milestone.tasks.length}</span>
                    <span>
                      Status:{" "}
                      {milestone.completed ? "Completed" : "In Progress"}
                    </span>
                  </div>
                  <div className="milestone-meta">
                    <span className="milestone-date">
                      Updated: {formatDate(milestone.updatedAt)}
                    </span>
                    <span className="milestone-date">
                      Created: {formatDate(milestone.createdAt)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
      {showMilestoneModal && (
        <CreateMilestoneModal
          projectId={projectId}
          onClose={() => {
            setShowMilestoneModal(false);
            refreshMilestones();
          }}
        />
      )}
    </div>
  );
};

export default MilestoneList;
