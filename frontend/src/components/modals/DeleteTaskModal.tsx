/**
 * This modal is used to delete a task.
 * It is used to delete a task from the database.
 * It is used to type the task name to confirm the deletion.
 */
import React, { useState } from 'react';
import { useProject } from '../../context/ProjectContext';
import DeleteModal from './DeleteModal';

interface DeleteTaskModalProps {
  projectId: number;
  taskId: number;
  onClose: () => void;
  onTaskDeleted?: () => void;
}

const DeleteTaskModal: React.FC<DeleteTaskModalProps> = ({ projectId, taskId, onClose, onTaskDeleted }) => {
  const { deleteTask, projects } = useProject();
  const [confirmText, setConfirmText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Find the project and task
  const project = projects.find((p) => p.id === projectId);
  // Look in both project tasks and milestone tasks
  const task =
    project?.tasks.find((t) => t.id === taskId) ||
    project?.milestones.flatMap((m) => m.tasks).find((t) => t.id === taskId);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmText(e.target.value);
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!task) return;

    if (confirmText !== task.title) {
      setError('The task name does not match. Please try again.');
      return;
    }

    setIsLoading(true);

    try {
      await deleteTask(projectId, taskId);
      if (onTaskDeleted) onTaskDeleted();
      onClose();
    } catch (err) {
      setError('Failed to delete the task. Please try again.');
      setIsLoading(false);
    }
  };

  // Custom DeleteTaskModal content to inject into DeleteModal
  const renderDeleteModalContent = () => {
    if (!project || !task) {
      return (
        <div className="text-center py-4 text-red-500">
          Task not found. It may have been deleted or you don't have access to it.
        </div>
      );
    }

    return (
      <>
        <div className="mb-4 text-red-500 text-center">
          <p className="font-semibold">Warning: This action cannot be undone</p>
          <p className="mt-2 text-gray-300">This will permanently delete the task and all its data.</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-4">
          <div className="mb-4">
            <p className="text-sm text-gray-300 mb-2">
              To confirm deletion, please type the task name: <span className="font-semibold">{task.title}</span>
            </p>
            <input
              type="text"
              value={confirmText}
              onChange={handleInputChange}
              placeholder="Type task name to confirm"
              autoFocus
              className={`w-full px-3 py-2 bg-gray-700 border rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                error ? 'border-red-500' : 'border-gray-600'
              }`}
            />
            {error && <div className="mt-1 text-sm text-red-500">{error}</div>}
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || confirmText !== task.title}
              className={`px-4 py-2 text-white font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 ${
                isLoading || confirmText !== task.title
                  ? 'bg-red-800 cursor-not-allowed opacity-70'
                  : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {isLoading ? 'Deleting...' : 'Delete Task'}
            </button>
          </div>
        </form>
      </>
    );
  };

  // Here we customize the DeleteModal
  class CustomDeleteModal extends DeleteModal {
    render() {
      const renderResult = super.render();

      // Clone the result to customize it
      const customizedModal = React.cloneElement(
        renderResult,
        {
          onClick: onClose, // Add click handler to close when clicking outside
        },
        React.cloneElement(
          renderResult.props.children,
          {},
          <>
            {/* Replace the header section with our custom one */}
            <div className="flex justify-between items-center px-6 py-4 bg-gray-900 border-b border-gray-700">
              <h2 className="text-xl font-semibold text-white">Delete Task</h2>
              <button
                className="text-gray-400 hover:text-white text-2xl font-bold focus:outline-none"
                onClick={onClose}
                aria-label="Close modal"
              >
                &times;
              </button>
            </div>

            {/* Replace the body section with our custom content */}
            <div className="px-6 py-4">{renderDeleteModalContent()}</div>
          </>,
        ),
      );

      return customizedModal;
    }
  }

  return <CustomDeleteModal name="Task" />;
};

export default DeleteTaskModal;
