/**
 * This modal is used to delete a task.
 * It is used to delete a task from the database.
 * It is used to type the task name to confirm the deletion.
 */
import React, { useState } from 'react';
import { useProject } from '../../context/ProjectContext';
import DeleteModal from './DeleteModal';
import DeleteConfirmationForm from './DeleteConfirmationForm';

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

  // Modal content with confirmation form
  const renderDeleteModalContent = () => {
    if (!project || !task) {
      return (
        <div className="text-center py-4 text-red-500">
          Task not found. It may have been deleted or you don't have access to it.
        </div>
      );
    }

    return (
      <DeleteConfirmationForm
        entityName="Task"
        entityTitle={task.title}
        warningText="This will permanently delete the task and all its data."
        confirmText={confirmText}
        onChange={handleInputChange}
        onSubmit={handleSubmit}
        onCancel={onClose}
        isLoading={isLoading}
        error={error}
        actionButtonText="Delete Task"
        loadingButtonText="Deleting..."
      />
    );
  };

  return (
    <DeleteModal name={task?.title || 'Task'} title="Delete Task" onClose={onClose} isLoading={isLoading}>
      {renderDeleteModalContent()}
    </DeleteModal>
  );
};

export default DeleteTaskModal;
