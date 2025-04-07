import { useState, useCallback, useMemo } from 'react';
import { useProject } from '../../context/ProjectContext';
import { Task, Milestone } from '../../types/project';
import CreateTaskModal from '../modals/CreateTaskModal';
import EditTaskModal from '../modals/EditTaskModal';
import BaseCard from '../ui/Card/BaseCard';

interface TaskListProps {
  projectId: number;
  tasks?: Task[];
  milestones?: Milestone[];
}

const TaskList = ({ projectId, tasks = [], milestones = [] }: TaskListProps) => {
  const { updateTask, deleteTask, projects } = useProject();
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [sortBy, setSortBy] = useState<'created' | 'updated'>('updated');

  // Get tasks from the current project
  const currentTasks = useMemo(() => {
    const currentProject = projects.find((p) => p.id === projectId);
    return currentProject?.tasks || tasks;
  }, [projectId, projects, tasks]);

  // Callbacks to avoid unnecessary rerenders
  const handleToggleTask = useCallback(
    async (task: Task) => {
      try {
        await updateTask({
          ...task,
          completed: !task.completed,
          updatedAt: new Date(),
        });
      } catch (error) {
        console.error('Error updating task:', error);
      }
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
        } catch (error) {
          console.error('Error deleting task:', error);
          alert('Failed to delete task. Please try again.');
        }
      }
    },
    [deleteTask, projectId],
  );

  // Sort tasks by created/updated time
  const sortedTasks = useMemo(() => {
    return [...currentTasks].sort((a, b) => {
      if (sortBy === 'updated') {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [currentTasks, sortBy]);

  // Calculate task counts
  const taskCounts = useMemo(() => {
    const completed = currentTasks.filter((task) => task.completed).length;
    const active = currentTasks.length - completed;
    return { total: currentTasks.length, active, completed };
  }, [currentTasks]);

  return (
    <div className="w-full max-w-7xl mx-auto bg-gray-900 rounded-lg shadow-md overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 border-b border-gray-700">
        <div>
          <h2 className="text-xl font-bold text-white text-left">Tasks</h2>
          <div className="text-sm text-blue-400 font-medium mt-1">
            Total Tasks:{' '}
            <span className="bg-blue-600 text-white px-2 py-0.5 rounded-full ml-1">{taskCounts.total}</span>
            <span className="ml-2">
              Active:{' '}
              <span className="bg-yellow-600 text-white px-2 py-0.5 rounded-full ml-1">{taskCounts.active}</span>
            </span>
            <span className="ml-2">
              Completed:{' '}
              <span className="bg-green-600 text-white px-2 py-0.5 rounded-full ml-1">{taskCounts.completed}</span>
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
            onClick={() => setShowTaskModal(true)}
          >
            Create Task
          </button>
        </div>
      </div>

      <div className="p-4 flex flex-col gap-4">
        {sortedTasks.map((task) => (
          <BaseCard
            key={task.id}
            title={task.title}
            description={task.description || undefined}
            headerLeft={
              <>
                <div
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    task.completed ? 'bg-green-600 text-green-100' : 'bg-yellow-600 text-yellow-100'
                  }`}
                >
                  {task.completed ? 'Completed' : 'In Progress'}
                </div>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleToggleTask(task)}
                  className="h-4 w-4 rounded bg-gray-700 border-gray-600 text-blue-600"
                />
                <button
                  onClick={() => handleEditTask(task)}
                  className="px-3 py-1 bg-gray-700 text-white text-sm rounded-md hover:bg-gray-600 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded-md transition-colors"
                >
                  Delete
                </button>
              </>
            }
            footer={
              <>
                <div>Created: {new Date(task.createdAt).toLocaleDateString()}</div>
                <div>Updated: {new Date(task.updatedAt).toLocaleDateString()}</div>
                {task.milestoneId && <div>Milestone: {milestones.find((m) => m.id === task.milestoneId)?.title}</div>}
              </>
            }
            className={task.completed ? 'text-gray-400 line-through' : ''}
          />
        ))}
        {sortedTasks.length === 0 && (
          <div className="text-center text-gray-400 py-8">No tasks found. Create one to get started!</div>
        )}
      </div>

      {showTaskModal && (
        <CreateTaskModal
          projectId={projectId}
          milestones={milestones}
          onClose={() => setShowTaskModal(false)}
          onTaskCreated={() => setShowTaskModal(false)}
        />
      )}

      {editingTask && (
        <EditTaskModal
          task={editingTask}
          projectId={projectId}
          milestones={milestones}
          onClose={() => setEditingTask(null)}
          onTaskEdited={() => setEditingTask(null)}
        />
      )}
    </div>
  );
};

export default TaskList;
