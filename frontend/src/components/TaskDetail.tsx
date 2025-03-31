import { useState, useEffect } from "react";
import { useProjects } from "../hooks/useProjects";
import { Task } from "../types/project";
import "../css/TaskDetail.css";

interface TaskDetailProps {
  projectId: string;
  taskId: string;
}

const TaskDetail = ({ projectId, taskId }: TaskDetailProps) => {
  const { projects, updateTask, deleteTask } = useProjects();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editCompleted, setEditCompleted] = useState(false);

  useEffect(() => {
    // Find the project and task
    const project = projects.find((p) => p.id === projectId);
    if (!project) {
      setError("Project not found");
      setLoading(false);
      return;
    }

    const foundTask = project.tasks.find((t) => t.id === taskId);
    if (!foundTask) {
      setError("Task not found");
      setLoading(false);
      return;
    }

    setTask(foundTask);
    setEditTitle(foundTask.title);
    setEditDescription(foundTask.description || "");
    setEditCompleted(foundTask.completed);
    setLoading(false);
  }, [projectId, taskId, projects]);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (task && editTitle.trim()) {
      updateTask({
        ...task,
        title: editTitle.trim(),
        description: editDescription.trim() || undefined,
        completed: editCompleted,
        updatedAt: new Date(),
      });
      setIsEditing(false);
    }
  };

  const handleToggleStatus = () => {
    if (task) {
      updateTask({
        ...task,
        completed: !task.completed,
        updatedAt: new Date(),
      });
    }
  };

  const handleDelete = () => {
    if (task && window.confirm("Are you sure you want to delete this task?")) {
      deleteTask(projectId, task.id);
      // Redirect would happen via react-router navigation in a real app
    }
  };

  if (loading) {
    return <div className="loading">Loading task...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!task) {
    return <div className="error">Task not found</div>;
  }

  return (
    <div className="task-detail">
      {isEditing ? (
        <form onSubmit={handleUpdate} className="edit-task-form">
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              placeholder="Description (optional)"
            />
          </div>
          <div className="form-group checkbox">
            <label>
              <input
                type="checkbox"
                checked={editCompleted}
                onChange={(e) => setEditCompleted(e.target.checked)}
              />
              Completed
            </label>
          </div>
          <div className="form-actions">
            <button type="submit">Save</button>
            <button type="button" onClick={() => setIsEditing(false)}>
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="task-info">
          <div className="task-header">
            <h2>{task.title}</h2>
            <div className="status-badge">
              {task.completed ? "Completed" : "In Progress"}
            </div>
          </div>
          {task.description && (
            <p className="description">{task.description}</p>
          )}

          <div className="task-meta">
            <p>Created: {new Date(task.createdAt).toLocaleString()}</p>
            <p>Updated: {new Date(task.updatedAt).toLocaleString()}</p>
            {task.milestoneId && <p>Milestone ID: {task.milestoneId}</p>}
          </div>

          <div className="task-actions">
            <button onClick={() => setIsEditing(true)}>Edit</button>
            <button onClick={handleToggleStatus}>
              {task.completed ? "Mark as Incomplete" : "Mark as Complete"}
            </button>
            <button onClick={handleDelete} className="delete-button">
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskDetail;
