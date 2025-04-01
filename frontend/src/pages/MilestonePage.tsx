import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { ProjectProvider } from "../context/ProjectContext";
import { Milestone, Task } from "../types/project";
import { API_BASE_URL, createHeaders } from "../config/api";

const MilestonePageContent = () => {
  const { projectId, milestoneId } = useParams();
  const [milestone, setMilestone] = useState<Milestone | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, _setLoading] = useState(true);
  const [error, _setError] = useState<string | null>(null);

  // Convert array date format to JavaScript Date
  const formatDate = useCallback((dateValue: number[] | Date | string | null): string => {
    if (!dateValue) return "N/A";

    try {
      let date: Date;

      if (Array.isArray(dateValue)) {
        if (dateValue.length >= 3) {
          const year = dateValue[0];
          const month = dateValue[1] - 1; // JS months are 0-indexed
          const day = dateValue[2];

          if (dateValue.length >= 6) {
            const hour = dateValue[3];
            const minute = dateValue[4];
            const second = dateValue[5];
            date = new Date(year, month, day, hour, minute, second);
          } else {
            date = new Date(year, month, day);
          }
          return date.toLocaleDateString();
        }
      } else if (dateValue instanceof Date) {
        return dateValue.toLocaleDateString();
      } else {
        date = new Date(dateValue);
        return isNaN(date.getTime()) ? "N/A" : date.toLocaleDateString();
      }
    } catch (e) {
      console.error("Error formatting date:", e);
    }

    return "N/A";
  }, []);

  useEffect(() => {
    const fetchMilestoneData = async () => {
      try {
        const milestoneResponse = await fetch(`${API_BASE_URL}/api/projects/${projectId}/milestones/${milestoneId}`, {
          credentials: "include",
          headers: createHeaders(),
        });
        const milestoneData = await milestoneResponse.json();
        setMilestone(milestoneData);

        const tasksResponse = await fetch(`${API_BASE_URL}/api/projects/${projectId}/milestones/${milestoneId}/tasks`, {
          credentials: "include",
          headers: createHeaders(),
        });
        const tasksData = await tasksResponse.json();
        setTasks(tasksData);
      } catch (error) {
        console.error("Error fetching milestone data:", error);
      }
    };

    fetchMilestoneData();
  }, [projectId, milestoneId]);

  if (loading) return <div className="loading-container">Loading...</div>;
  if (error) return <div className="error-container">Error: {error}</div>;
  if (!milestone) return <div className="not-found-container">Milestone not found</div>;

  return (
    <div className="milestone-page">
      <div className="milestone-header">
        <h1 className="milestone-title">{milestone.title}</h1>
        <div className="milestone-meta-container">
          <div className="milestone-meta vertical">
            <div className="milestone-meta-item">
              <span className="meta-label">Status:</span>
              <span className={`status-badge ${milestone.completed ? "completed" : "in-progress"}`}>
                {milestone.completed ? "Completed" : "In Progress"}
              </span>
            </div>
            {milestone.startDate && (
              <div className="milestone-meta-item">
                <span className="meta-label">Start:</span>
                <span className="meta-value">{formatDate(milestone.startDate)}</span>
              </div>
            )}
            {milestone.dueDate && (
              <div className="milestone-meta-item">
                <span className="meta-label">Due:</span>
                <span className="meta-value">{formatDate(milestone.dueDate)}</span>
              </div>
            )}
          </div>
        </div>
        {milestone.description && <div className="milestone-description">{milestone.description}</div>}
      </div>
      <div className="milestone-tasks">
        <div className="milestone-task-header">
          {/* TODO Add Header Information about the tasks in this milestone */}
        </div>
        <div className="milestone-task-list">
          {tasks.map((task) => (
            <MilestoneTaskCard key={task.id} task={task} />
          ))}
        </div>
      </div>
    </div>
  );
};

const MilestoneTaskCard = ({ task }: { task: Task }) => {
  return (
    <div className="milestone-task">
      <div className="milestone-task-title">{task.title}</div>
      <div className="milestone-task-description">{task.description}</div>
      <div className="milestone-task-actions">
        <div className="action-buttons">
          <button className="milestone-task-button">Edit</button>
          <button className="milestone-task-button">Delete</button>
        </div>
      </div>
    </div>
  );
};

const MilestonePage = () => {
  return (
    <ProjectProvider>
      <MilestonePageContent />
    </ProjectProvider>
  );
};

export default MilestonePage;
