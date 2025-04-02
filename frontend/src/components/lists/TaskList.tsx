import { useState, useCallback, useMemo } from "react";
import { useProject } from "../../context/ProjectContextDefinition";
import { Task, Milestone } from "../../types/project";
import CreateTaskModal from "../modals/CreateTaskModal";

interface TaskListProps {
  projectId: number;
  tasks?: Task[];
  milestones?: Milestone[];
}

// Main TaskList component
const TaskList = ({
  projectId,
  tasks = [],
  milestones = [],
}: TaskListProps) => {
  const { updateTask, deleteTask } = useProject();
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editMilestoneId, setEditMilestoneId] = useState<number | undefined>(
    undefined
  );
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [showTaskModal, setShowTaskModal] = useState(false);

  // Callbacks to avoid unnecessary rerenders
  const handleToggleTask = useCallback(
    (task: Task) => {
      updateTask({
        ...task,
        completed: !task.completed,
        updatedAt: new Date(),
      });
    },
    [updateTask]
  );

  const handleEditTask = useCallback((task: Task) => {
    setEditingTaskId(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description || "");
    setEditMilestoneId(task.milestoneId);
  }, []);

  const handleSaveEdit = useCallback(
    (task: Task) => {
      if (editTitle.trim()) {
        updateTask({
          ...task,
          title: editTitle.trim(),
          description: editDescription.trim() || undefined,
          milestoneId: editMilestoneId,
          updatedAt: new Date(),
        });
        setEditingTaskId(null);
      }
    },
    [editTitle, editDescription, editMilestoneId, updateTask]
  );

  const handleDeleteTask = useCallback(
    (taskId: number) => {
      if (window.confirm("Are you sure you want to delete this task?")) {
        deleteTask(projectId, taskId);
      }
    },
    [deleteTask, projectId]
  );

  // Sort tasks by update time
  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => {
      return b.updatedAt.getTime() - a.updatedAt.getTime();
    });
  }, [tasks]);

  // Filter tasks based on completion status
  const filteredTasks = useMemo(() => {
    return sortedTasks.filter((task) => {
      if (filter === "active") return !task.completed;
      if (filter === "completed") return task.completed;
      return true;
    });
  }, [sortedTasks, filter]);

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 pb-4 border-b border-gray-700">
        <div className="flex items-center mb-3 sm:mb-0">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as typeof filter)}
            className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
          >
            <option value="all">All Tasks</option>
            <option value="active">Active Tasks</option>
            <option value="completed">Completed Tasks</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`bg-gray-800 rounded-lg p-4 border ${
                task.completed ? "border-green-800" : "border-gray-700"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleToggleTask(task)}
                    className="mr-3 mt-1.5 h-4 w-4 rounded bg-gray-700 border-gray-600 text-blue-600"
                  />

                  {editingTaskId === task.id ? (
                    <div className="flex-1 space-y-3">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                        autoFocus
                      />
                      <textarea
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white resize-none"
                        rows={3}
                        placeholder="Add description..."
                      />
                      <select
                        value={editMilestoneId || ""}
                        onChange={(e) =>
                          setEditMilestoneId(
                            e.target.value ? Number(e.target.value) : undefined
                          )
                        }
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                      >
                        <option value="">No Milestone</option>
                        {milestones.map((milestone) => (
                          <option key={milestone.id} value={milestone.id}>
                            {milestone.title}
                          </option>
                        ))}
                      </select>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleSaveEdit(task)}
                          className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingTaskId(null)}
                          className="px-3 py-1 bg-gray-700 text-white text-sm rounded hover:bg-gray-600"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1">
                      <div
                        className={`text-lg font-medium ${
                          task.completed
                            ? "text-gray-400 line-through"
                            : "text-white"
                        }`}
                      >
                        {task.title}
                      </div>
                      {task.description && (
                        <div className="mt-1 text-gray-400 text-sm">
                          {task.description}
                        </div>
                      )}
                      {task.milestoneId && (
                        <div className="mt-2">
                          <span className="px-2 py-1 rounded text-xs bg-blue-900 text-blue-300">
                            {
                              milestones.find((m) => m.id === task.milestoneId)
                                ?.title
                            }
                          </span>
                        </div>
                      )}
                      <div className="mt-2 text-xs text-gray-500">
                        <span className="mr-3">
                          Updated:{" "}
                          {new Date(task.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {editingTaskId !== task.id && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditTask(task)}
                      className="px-2 py-1 bg-gray-700 text-white text-xs rounded hover:bg-gray-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="px-2 py-1 bg-red-700 text-white text-xs rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-400 py-6">
            No {filter !== "all" ? filter : ""} tasks found
          </div>
        )}
      </div>

      {showTaskModal && (
        <CreateTaskModal
          projectId={projectId}
          milestones={milestones}
          onClose={() => setShowTaskModal(false)}
        />
      )}
    </div>
  );
};

export default TaskList;
