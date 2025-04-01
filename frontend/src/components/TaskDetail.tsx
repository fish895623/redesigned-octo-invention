import { useState, useEffect } from "react";
import { useProjects } from "../hooks/useProjects";
import { Task } from "../types/project";

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
    return (
      <div className="flex justify-center items-center p-8 text-gray-400">
        Loading task...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500 bg-red-900/20 rounded-md">
        {error}
      </div>
    );
  }

  if (!task) {
    return (
      <div className="p-4 text-center text-red-500 bg-red-900/20 rounded-md">
        Task not found
      </div>
    );
  }

  return (
    <div className="w-full p-6 bg-gray-900 rounded-lg shadow-md">
      {isEditing ? (
        <form onSubmit={handleUpdate} className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-300"
            >
              Title
            </label>
            <input
              id="title"
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              required
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-300"
            >
              Description
            </label>
            <textarea
              id="description"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              placeholder="Description (optional)"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px] resize-y"
            />
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="completed"
              checked={editCompleted}
              onChange={(e) => setEditCompleted(e.target.checked)}
              className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="completed" className="text-gray-300">
              Completed
            </label>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">{task.title}</h2>
            <div
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                task.completed
                  ? "bg-green-700 text-green-200"
                  : "bg-gray-700 text-gray-200"
              }`}
            >
              {task.completed ? "Completed" : "In Progress"}
            </div>
          </div>
          {task.description && (
            <p className="text-gray-300">{task.description}</p>
          )}

          <div className="space-y-1 text-sm text-gray-400">
            <p>Created: {new Date(task.createdAt).toLocaleString()}</p>
            <p>Updated: {new Date(task.updatedAt).toLocaleString()}</p>
            {task.milestoneId && <p>Milestone ID: {task.milestoneId}</p>}
          </div>

          <div className="flex flex-wrap gap-2 pt-4">
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Edit
            </button>
            <button
              onClick={handleToggleStatus}
              className={`px-4 py-2 ${
                task.completed
                  ? "bg-yellow-600 hover:bg-yellow-700"
                  : "bg-green-600 hover:bg-green-700"
              } text-white font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              {task.completed ? "Mark as Incomplete" : "Mark as Complete"}
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskDetail;
