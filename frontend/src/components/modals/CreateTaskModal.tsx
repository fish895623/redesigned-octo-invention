import React, { useState, useEffect } from 'react';
import { Milestone } from '../../types/project';
import { useProject } from '../../context/ProjectContext';

interface CreateTaskModalProps {
  projectId: number;
  milestones: Milestone[];
  onClose: () => void;
  onTaskCreated?: () => void;
  selectedMilestoneId?: number | null;
}

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  projectId,
  milestones,
  onClose,
  onTaskCreated,
  selectedMilestoneId,
}) => {
  const { addTask } = useProject();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [milestoneId, setMilestoneId] = useState<number | undefined>(undefined);
  const [titleError, setTitleError] = useState('');

  // Set the milestone ID when the modal opens with a selected milestone
  useEffect(() => {
    if (selectedMilestoneId) {
      setMilestoneId(selectedMilestoneId);
    }
  }, [selectedMilestoneId]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    if (titleError) setTitleError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setTitleError('Task title is required');
      return;
    }

    try {
      await addTask(projectId, {
        title,
        description,
        milestoneId,
        completed: false,
      });

      // Call onTaskCreated if provided to refresh the task list
      if (onTaskCreated) {
        onTaskCreated();
      }

      onClose();
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="bg-gray-800 rounded-lg shadow-xl max-w-lg w-full mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center px-6 py-4 bg-gray-900 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">Create New Task</h2>
          <button
            className="text-gray-400 hover:text-white text-2xl font-bold focus:outline-none"
            onClick={onClose}
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>
        <form className="px-6 py-4" onSubmit={handleSubmit}>
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-300 mb-2">Task Title</h3>
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              placeholder="Enter task title"
              autoFocus
              className={`w-full px-3 py-2 bg-gray-700 border rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                titleError ? 'border-red-500' : 'border-gray-600'
              }`}
            />
            {titleError && <div className="mt-1 text-sm text-red-500">{titleError}</div>}
          </div>

          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-300 mb-2">Description</h3>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter task description (optional)"
              rows={4}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-300 mb-2">Milestone</h3>
            <select
              value={milestoneId || ''}
              onChange={(e) => setMilestoneId(e.target.value ? Number(e.target.value) : undefined)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">No Milestone</option>
              {milestones.map((milestone) => (
                <option key={milestone.id} value={milestone.id}>
                  {milestone.title}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTaskModal;
