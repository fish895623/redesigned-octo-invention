import { useState } from "react";
import { useProject } from "../../context/ProjectContextDefinition";
import { v4 as uuidv4 } from "uuid";

interface CreateMilestoneModalProps {
  projectId: string;
  onClose: () => void;
}

const CreateMilestoneModal = ({
  projectId,
  onClose,
}: CreateMilestoneModalProps) => {
  const { projects, updateProject } = useProject();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    const project = projects.find((p) => p.id === projectId);
    if (!project) {
      setError("Project not found");
      return;
    }

    const newMilestone = {
      id: uuidv4(),
      title: title.trim(),
      description: description.trim() || undefined,
      tasks: [],
      projectId,
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Add milestone to project
    updateProject({
      ...project,
      milestones: [...project.milestones, newMilestone],
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <h2 className="text-xl font-bold text-white mb-4">
            Create New Milestone
          </h2>
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="mb-4 p-2 bg-red-600 bg-opacity-25 border border-red-700 rounded text-red-100">
                {error}
              </div>
            )}
            <div className="mb-4">
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
                placeholder="Milestone title"
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Description (optional)
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white min-h-[100px]"
                placeholder="Milestone description"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateMilestoneModal;
