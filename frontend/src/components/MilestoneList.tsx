import { useState, useCallback, useMemo, useEffect } from "react";
import { useProject } from "../context/ProjectContextDefinition";
import { Milestone } from "../types/project";
import CreateMilestoneModal from "./modal/CreateMilestoneModal";
import { API_BASE_URL, createHeaders } from "../config/api";

// Define date array type from backend
type DateArray =
  | [number, number, number, number?, number?, number?, number?]
  | null;
type DateValue = Date | DateArray | string | null;

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
    null
  );
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [showMilestoneModal, setShowMilestoneModal] = useState(false);
  const [sortBy, setSortBy] = useState<"created" | "updated">("updated");

  // Helper function to convert array date format to JavaScript Date
  const convertArrayToDate = useCallback(
    (dateValue: DateValue): Date | null => {
      if (!dateValue) return null;

      // Check if it's an array format from the server
      if (Array.isArray(dateValue)) {
        try {
          // Handle full datetime array [year, month, day, hour, minute, second, nano]
          if (dateValue.length >= 3) {
            // Note: JavaScript months are 0-indexed, but the server sends 1-indexed months
            const year = dateValue[0];
            const month = dateValue[1] - 1; // Subtract 1 to convert to JS month (0-11)
            const day = dateValue[2];

            // If we have time components
            if (dateValue.length >= 6) {
              const hour = dateValue[3] || 0;
              const minute = dateValue[4] || 0;
              const second = dateValue[5] || 0;
              return new Date(year, month, day, hour, minute, second);
            }

            // If we only have date components
            return new Date(year, month, day);
          }
        } catch (e) {
          console.error("Error converting date array:", dateValue, e);
        }
      }

      // If it's already a Date object
      if (dateValue instanceof Date) {
        return dateValue;
      }

      // If it's a string or timestamp
      if (typeof dateValue === "string") {
        try {
          const date = new Date(dateValue);
          return isNaN(date.getTime()) ? null : date;
        } catch (e) {
          console.error("Error converting date value:", dateValue, e);
        }
      }

      return null;
    },
    []
  );

  // Helper function to safely format dates
  const formatDate = useCallback(
    (dateValue: DateValue): string => {
      const date = convertArrayToDate(dateValue);
      if (!date) return "N/A";
      return date.toLocaleString();
    },
    [convertArrayToDate]
  );

  // Fetch milestones from API
  useEffect(() => {
    const fetchMilestones = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/projects/${projectId}/milestones`,
          {
            credentials: "include",
            headers: createHeaders(),
          }
        );
        const data = await response.json();
        console.log("Raw milestone data from API:", data);

        // Process the data to ensure dates are properly formatted
        const processedData = data.map((milestone: Milestone) => {
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
          err instanceof Error ? err.message : "An unknown error occurred"
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
      const response = await fetch(
        `${API_BASE_URL}/api/projects/${projectId}/milestones`,
        {
          credentials: "include",
          headers: createHeaders(),
        }
      );
      const data = await response.json();
      console.log("Refresh: Raw milestone data from API:", data);

      // Process the data to ensure dates are properly formatted
      const processedData = data.map((milestone: Milestone) => {
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
            `${API_BASE_URL}/api/projects/${projectId}/milestones/${milestone.id}`,
            {
              method: "PUT",
              credentials: "include",
              headers: createHeaders(),
              body: JSON.stringify({
                title: editTitle.trim(),
                description: editDescription.trim() || undefined,
              }),
            }
          );

          if (!response.ok) {
            throw new Error(
              `Failed to update milestone: ${response.statusText}`
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
    [editTitle, editDescription, updateMilestone, projectId, refreshMilestones]
  );

  const handleDeleteMilestone = useCallback(
    async (milestoneId: string) => {
      if (window.confirm("Are you sure you want to delete this milestone?")) {
        try {
          await fetch(
            `${API_BASE_URL}/api/projects/${projectId}/milestones/${milestoneId}`,
            {
              method: "DELETE",
              credentials: "include",
              headers: createHeaders(),
            }
          );

          // Update local state
          deleteMilestone(projectId, milestoneId);

          // Refresh from server
          refreshMilestones();
        } catch (err) {
          console.error("Error deleting milestone:", err);
        }
      }
    },
    [deleteMilestone, projectId, refreshMilestones]
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
            : m
        )
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
          startDate?: DateValue;
          dueDate?: DateValue;
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
          `${API_BASE_URL}/api/projects/${projectId}/milestones/${milestone.id}`,
          {
            method: "PUT",
            credentials: "include",
            headers: createHeaders(),
            body: JSON.stringify(requestBody),
          }
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
              : m
          )
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
    [updateMilestone, projectId, setMilestones]
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
    <div className="w-full p-4 bg-gray-900 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white">Milestones</h2>
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
            onClick={() => setShowMilestoneModal(true)}
          >
            Add Milestone
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        {loading ? (
          <div className="p-4 text-center text-gray-400">
            Loading milestones...
          </div>
        ) : error ? (
          <div className="p-4 text-center text-red-500 bg-red-900/20 rounded-md">
            {error}
          </div>
        ) : sortedMilestones.length === 0 ? (
          <div className="p-4 text-center text-gray-400">
            No milestones found for this project.
          </div>
        ) : (
          sortedMilestones.map((milestone) => (
            <div
              key={milestone.id}
              className="p-4 border border-gray-700 rounded-md bg-gray-800"
            >
              {editingMilestoneId === milestone.id ? (
                <div className="flex flex-col gap-3">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onBlur={() => handleSaveEdit(milestone)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && handleSaveEdit(milestone)
                    }
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    onBlur={() => handleSaveEdit(milestone)}
                    placeholder="Add description..."
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px] resize-y"
                  />
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex justify-between flex-wrap gap-3">
                    <div className="space-y-2">
                      <div>
                        <div
                          className={`font-semibold text-lg ${
                            milestone.completed
                              ? "text-green-400"
                              : "text-white"
                          }`}
                        >
                          <span className="text-xs text-gray-400 font-normal">
                            (ID: {milestone.id}){" "}
                          </span>
                          {milestone.title}
                        </div>
                        {milestone.description && (
                          <div className="text-gray-400 mt-1">
                            {milestone.description}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        className={`px-3 py-1 rounded text-sm font-medium ${
                          milestone.completed
                            ? "bg-green-700 hover:bg-green-800 text-white"
                            : "bg-gray-700 hover:bg-gray-600 text-white"
                        } transition-colors`}
                        onClick={() => handleToggleMilestone(milestone)}
                      >
                        {milestone.completed ? "Completed" : "Mark Complete"}
                      </button>
                      <button
                        onClick={() =>
                          (window.location.href = `/project/${projectId}/milestone/${milestone.id}`)
                        }
                        className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm font-medium transition-colors"
                      >
                        More Info
                      </button>
                      <button
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium transition-colors"
                        onClick={() => handleEditMilestone(milestone)}
                      >
                        Edit
                      </button>
                      <button
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm font-medium transition-colors"
                        onClick={() => handleDeleteMilestone(milestone.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-4 text-sm text-gray-300">
                    <span>Tasks: {milestone.tasks.length}</span>
                    <span>
                      Status:{" "}
                      {milestone.completed ? "Completed" : "In Progress"}
                    </span>
                  </div>
                  <div className="flex gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      Updated: {formatDate(milestone.updatedAt)}
                    </span>
                    <span className="flex items-center gap-1">
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
