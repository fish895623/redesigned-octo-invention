import React, { useState } from 'react';
import { useProject } from '../../context/ProjectContext';
import { Milestone, Task } from '../../types/project';

interface EditTaskModalProps {
  task: Task;
  projectId: number;
  milestones: Milestone[];
  onClose: () => void;
  onTaskEdited?: () => void;
}

const EditTaskModal: React.FC<EditTaskModalProps> = ({ task, milestones, onClose, onTaskEdited }) => {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [milestoneId, setMilestoneId] = useState<number | undefined>(task.milestoneId);
  const [completed, setCompleted] = useState(task.completed);
  const [titleError, setTitleError] = useState('');
  const { updateTask } = useProject();

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    if (titleError) setTitleError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setTitleError('Title is required');
      return;
    }

    const updatedTask = {
      ...task,
      title: title.trim(),
      description: description.trim() || undefined,
      milestoneId,
      completed,
      updatedAt: new Date(),
    };

    try {
      await updateTask(updatedTask);

      // Call onTaskEdited callback if provided
      if (onTaskEdited) {
        onTaskEdited();
      }

      onClose();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="bg-gray-800 rounded-lg shadow-xl max-w-lg w-full mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center px-6 py-4 bg-gray-900 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">Edit Task</h2>
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

          <div className="mb-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={completed}
                onChange={() => setCompleted(!completed)}
                className="rounded text-blue-500"
              />
              <span className="text-white">Mark as completed</span>
            </label>
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
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTaskModal;
