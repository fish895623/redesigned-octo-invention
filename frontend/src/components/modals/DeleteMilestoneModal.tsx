/**
 * This modal is used to delete a milestone.
 * It is used to delete a milestone from the database.
 * It is used to delete all the tasks associated with the milestone.
 * It is used to type the milestone name to confirm the deletion.
 */
import React, { useState } from 'react';
import { useProject } from '../../context/ProjectContext';
import DeleteModal from './DeleteModal';
import DeleteConfirmationForm from './DeleteConfirmationForm';

interface DeleteMilestoneModalProps {
  projectId: number;
  milestoneId: number;
  onClose: () => void;
  onMilestoneDeleted?: () => void;
}

const DeleteMilestoneModal: React.FC<DeleteMilestoneModalProps> = ({
  projectId,
  milestoneId,
  onClose,
  onMilestoneDeleted,
}) => {
  const { deleteMilestone, projects } = useProject();
  const [confirmText, setConfirmText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Find the project and milestone
  const project = projects.find((p) => p.id === projectId);
  const milestone = project?.milestones.find((m) => m.id === milestoneId);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmText(e.target.value);
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!milestone) return;

    if (confirmText !== milestone.title) {
      setError('The milestone name does not match. Please try again.');
      return;
    }

    setIsLoading(true);

    try {
      await deleteMilestone(projectId, milestoneId);
      if (onMilestoneDeleted) onMilestoneDeleted();
      onClose();
    } catch (err) {
      setError('Failed to delete the milestone. Please try again.');
      setIsLoading(false);
    }
  };

  // Modal content with confirmation form
  const renderDeleteModalContent = () => {
    if (!project || !milestone) {
      return (
        <div className="text-center py-4 text-red-500">
          Milestone not found. It may have been deleted or you don't have access to it.
        </div>
      );
    }

    return (
      <DeleteConfirmationForm
        entityName="Milestone"
        entityTitle={milestone.title}
        warningText="This will permanently delete the milestone and all associated tasks."
        confirmText={confirmText}
        onChange={handleInputChange}
        onSubmit={handleSubmit}
        onCancel={onClose}
        isLoading={isLoading}
        error={error}
        actionButtonText="Delete Milestone"
        loadingButtonText="Deleting..."
      />
    );
  };

  return (
    <DeleteModal
      name={milestone?.title || 'Milestone'}
      title="Delete Milestone"
      onClose={onClose}
      isLoading={isLoading}
    >
      {renderDeleteModalContent()}
    </DeleteModal>
  );
};

export default DeleteMilestoneModal;
