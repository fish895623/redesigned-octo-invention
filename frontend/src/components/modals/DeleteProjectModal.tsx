/**
 * This modal is used to delete a project.
 * It is used to delete a project from the database.
 * It is used to delete all the tasks, milestones, and subtasks associated with the project.
 * It is used to type the project name to confirm the deletion.
 */
import React, { useState } from 'react';
import { useProject } from '../../context/ProjectContext';
import DeleteModal from './DeleteModal';
import DeleteConfirmationForm from './DeleteConfirmationForm';

interface DeleteProjectModalProps {
  projectId: number;
  onClose: () => void;
  onProjectDeleted?: () => void;
}

const DeleteProjectModal: React.FC<DeleteProjectModalProps> = ({ projectId, onClose, onProjectDeleted }) => {
  const { deleteProject, projects } = useProject();
  const [confirmText, setConfirmText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Find the project in the projects array
  const project = projects.find((p) => p.id === projectId);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmText(e.target.value);
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!project) return;

    if (confirmText !== project.name) {
      setError('The project name does not match. Please try again.');
      return;
    }

    setIsLoading(true);

    try {
      await deleteProject(projectId);
      if (onProjectDeleted) onProjectDeleted();
      onClose();
    } catch (err) {
      setError('Failed to delete the project. Please try again.');
      setIsLoading(false);
    }
  };

  // Modal content with confirmation form
  const renderDeleteModalContent = () => {
    if (!project) {
      return (
        <div className="text-center py-4 text-red-500">
          Project not found. It may have been deleted or you don't have access to it.
        </div>
      );
    }

    return (
      <DeleteConfirmationForm
        entityName="Project"
        entityTitle={project.name}
        warningText="This will permanently delete the project and all associated tasks, milestones, and subtasks."
        confirmText={confirmText}
        onChange={handleInputChange}
        onSubmit={handleSubmit}
        onCancel={onClose}
        isLoading={isLoading}
        error={error}
        actionButtonText="Delete Project"
        loadingButtonText="Deleting..."
      />
    );
  };

  return (
    <DeleteModal name={project?.name || 'Project'} onClose={onClose} isLoading={isLoading}>
      {renderDeleteModalContent()}
    </DeleteModal>
  );
};

export default DeleteProjectModal;
