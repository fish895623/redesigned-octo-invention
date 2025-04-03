import { useState, useCallback, useMemo } from 'react';
import { useProject } from '../../context/ProjectContextDefinition';
import { Task, Milestone } from '../../types/project';
import CreateTaskModal from '../modals/CreateTaskModal';
import EditTaskModal from '../modals/EditTaskModal';

interface TaskListProps {
  projectId: number;
  tasks?: Task[];
  milestones?: Milestone[];
}

// Main TaskList component
const TaskList = ({ projectId, tasks = [], milestones = [] }: TaskListProps) => {
  const { updateTask, deleteTask } = useProject();
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [refreshKey, setRefreshKey] = useState(0);

  // Callbacks to avoid unnecessary rerenders
  const handleToggleTask = useCallback(
    (task: Task) => {
      updateTask({
        ...task,
        completed: !task.completed,
        updatedAt: new Date(),
      });
    },
    [updateTask],
  );

  const handleEditTask = useCallback((task: Task) => {
    setEditingTask(task);
  }, []);

  const handleDeleteTask = useCallback(
    async (taskId: number) => {
      if (window.confirm('Are you sure you want to delete this task?')) {
        try {
          await deleteTask(projectId, taskId);
          // Force refresh after successful deletion
          setRefreshKey((prev) => prev + 1);
        } catch (error) {
          console.error('Error deleting task:', error);
          // Show user-friendly error message
          alert('Failed to delete task. Please try again.');
        }
      }
    },
    [deleteTask, projectId],
  );

  const handleTaskCreated = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

  // Sort tasks by update time
  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => {
      const dateA = new Date(a.updatedAt);
      const dateB = new Date(b.updatedAt);
      return dateB.getTime() - dateA.getTime();
    });
  }, [tasks, refreshKey]);

  // Filter tasks based on completion status
  const filteredTasks = useMemo(() => {
    return sortedTasks.filter((task) => {
      if (filter === 'active') return !task.completed;
      if (filter === 'completed') return task.completed;
      return true;
    });
  }, [sortedTasks, filter]);

  return (
    <div className="w-full">
      <div className="flex justify-end mb-4">
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

      <div className="space-y-4">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <div key={task.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <div className="flex justify-between items-start">
                <div className="text-left">
                  <h3
                    className={`text-lg font-semibold ${task.completed ? 'text-gray-400 line-through' : 'text-white'}`}
                  >
                    {task.title}
                  </h3>
                  {task.description && <p className="text-gray-400 mt-1">{task.description}</p>}
                  <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-400">
                    <div>Status: {task.completed ? 'Completed' : 'In Progress'}</div>
                  </div>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    task.completed ? 'bg-green-600 text-green-100' : 'bg-yellow-600 text-yellow-100'
                  }`}
                >
                  {task.completed ? 'Completed' : 'In Progress'}
                </div>
              </div>
              <div className="mt-2 flex space-x-2 justify-end">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleToggleTask(task)}
                  className="mr-1 mt-1 h-4 w-4 rounded bg-gray-700 border-gray-600 text-blue-600"
                />
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
            </div>
          ))
        ) : (
          <div className="text-center text-gray-400 py-8">
            No tasks found for this milestone. Add a task to get started.
          </div>
        )}
      </div>

      {showTaskModal && (
        <CreateTaskModal
          projectId={projectId}
          milestones={milestones}
          onClose={() => setShowTaskModal(false)}
          onTaskCreated={handleTaskCreated}
        />
      )}

      {editingTask && (
        <EditTaskModal
          task={editingTask}
          projectId={projectId}
          milestones={milestones}
          onClose={() => setEditingTask(null)}
          onTaskEdited={handleTaskCreated}
        />
      )}
    </div>
  );
};

export default TaskList;
