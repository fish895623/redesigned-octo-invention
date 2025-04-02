import { useState, useCallback, useMemo } from "react";
import { useProjects } from "../../hooks/useProjects";
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
  const { updateTask, deleteTask } = useProjects();
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
    <div className="task-list">
      <div className="task-list-header">
        <h2>Tasks</h2>
        <div className="task-list-controls">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as typeof filter)}
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
          <button onClick={() => setShowTaskModal(true)}>Add Task</button>
        </div>
      </div>
      <div className="task-list-content">
        {filteredTasks.map((task) => (
          <div key={task.id} className="task-item">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => handleToggleTask(task)}
            />
            {editingTaskId === task.id ? (
              <div className="task-edit">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onBlur={() => handleSaveEdit(task)}
                  onKeyDown={(e) => e.key === "Enter" && handleSaveEdit(task)}
                />
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  onBlur={() => handleSaveEdit(task)}
                  placeholder="Add description..."
                />
                <select
                  value={editMilestoneId || ""}
                  onChange={(e) =>
                    setEditMilestoneId(
                      e.target.value ? Number(e.target.value) : undefined
                    )
                  }
                  onBlur={() => handleSaveEdit(task)}
                >
                  <option value="">No Milestone</option>
                  {milestones.map((milestone) => (
                    <option key={milestone.id} value={milestone.id}>
                      {milestone.title}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="task-content">
                <div className="task-title">{task.title}</div>
                {task.description && (
                  <div className="task-description">{task.description}</div>
                )}
                {task.milestoneId && (
                  <div className="task-milestone">
                    {milestones.find((m) => m.id === task.milestoneId)?.title}
                  </div>
                )}
                <div className="task-meta">
                  <span className="task-date">
                    Updated: {new Date(task.updatedAt).toLocaleString()}
                  </span>
                  <span className="task-date">
                    Created: {new Date(task.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
            )}
            <div className="task-actions">
              <button onClick={() => handleEditTask(task)}>Edit</button>
              <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
            </div>
          </div>
        ))}
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
