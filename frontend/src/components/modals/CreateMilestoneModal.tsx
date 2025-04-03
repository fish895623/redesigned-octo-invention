import { useState } from 'react';
import { useProject } from '../../context/ProjectContextDefinition';

interface CreateMilestoneModalProps {
  projectId: number;
  onClose: () => void;
}

const CreateMilestoneModal = ({ projectId, onClose }: CreateMilestoneModalProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [titleError, setTitleError] = useState('');
  const { addMilestone } = useProject();

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    if (titleError) setTitleError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setTitleError('Milestone title is required');
      return;
    }

    addMilestone(projectId, {
      title: title.trim(),
      description: description.trim() || undefined,
      startDate: startDate ? new Date(startDate) : undefined,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      completed: false,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="bg-gray-800 rounded-lg shadow-xl max-w-lg w-full mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center px-6 py-4 bg-gray-900 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">Create New Milestone</h2>
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
            <h3 className="text-sm font-medium text-gray-300 mb-2">Milestone Title</h3>
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              placeholder="Enter milestone title"
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
              placeholder="Enter milestone description (optional)"
              rows={4}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <h3 className="text-sm font-medium text-gray-300 mb-2">Start Date (Optional)</h3>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-300 mb-2">Due Date (Optional)</h3>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
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
              Create Milestone
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateMilestoneModal;
