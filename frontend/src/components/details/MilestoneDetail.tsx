/**
 * This component is used to display a list of tasks under the milestones.
 * This requests to /api/projects/:projectId/milestones/:milestoneId/tasks.
 * Authentication is requested.
 */
import React, { useState, useEffect, useCallback } from 'react';
import { useProject } from '../../context/ProjectContext';
import { Milestone, Task } from '../../types/project';
import TaskList from '../lists/TaskList';
import CreateTaskModal from '../modals/CreateTaskModal';

interface MilestoneDetailProps {
  projectId: number;
  milestoneId: number;
}

const MilestoneDetail = ({ projectId, milestoneId }: MilestoneDetailProps) => {
  const { projects, updateMilestone, deleteMilestone } = useProject();
  const [milestone, setMilestone] = useState<Milestone | null>(null);
  const [projectTitle, setProjectTitle] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    // Find the project and milestone
    const project = projects.find((p) => p.id === projectId);
    if (project) {
      setProjectTitle(project.title);
      const foundMilestone = project.milestones.find((m) => m.id === milestoneId);
      if (foundMilestone) {
        setMilestone(foundMilestone);
        setTitle(foundMilestone.title);
        setDescription(foundMilestone.description || '');
        setCompleted(foundMilestone.completed);
        setLoading(false);
      } else {
        setError('Milestone not found in this project');
        setLoading(false);
      }
    } else if (projects.length > 0) {
      setError('Project not found');
      setLoading(false);
    }
  }, [projectId, milestoneId, projects, refreshKey]);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (milestone && title.trim()) {
      const updatedMilestone: Milestone = {
        ...milestone,
        title: title.trim(),
        description: description.trim() || undefined,
        completed,
        updatedAt: new Date(),
      };
      updateMilestone(updatedMilestone);
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    if (milestone && window.confirm('Are you sure you want to delete this milestone?')) {
      deleteMilestone(projectId, milestone.id);
      // Navigate back to milestone list (this will be handled by the router)
      window.location.href = `/project/${projectId}/milestone`;
    }
  };

  const handleTaskCreated = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

  if (loading) {
    return <div className="text-white p-6">Loading milestone...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-6">{error}</div>;
  }

  if (!milestone) {
    return <div className="text-red-500 p-6">Milestone not found</div>;
  }

  // Filter tasks that belong to this milestone
  const milestoneTasks: Task[] = milestone.tasks || [];
  // Get all milestones for the project
  const projectMilestones = projects.find((p) => p.id === projectId)?.milestones || [];

  return (
    <div className="w-full max-w-7xl mx-auto bg-gray-900 rounded-lg shadow-md overflow-hidden">
      {isEditing ? (
        <form
          onSubmit={handleUpdate}
          className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 border-b border-gray-700"
        >
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description (optional)"
              rows={4}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white resize-none"
            />
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

          <div className="flex gap-3 mt-6">
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700">
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-gray-700 text-white font-medium rounded-md hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="flex flex-col p-4 border-b border-gray-700">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-white text-left">{milestone.title}</h2>
              <div className="text-sm text-blue-400 mb-2 text-left">Project: {projectTitle}</div>
              {milestone.description && (
                <p className=" text-sm text-left text-gray-300 whitespace-pre-wrap">{milestone.description}</p>
              )}
            </div>
            <div className="flex gap-4 items-center">
              <button
                onClick={() => setIsEditing(true)}
                className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="px-3 py-1.5 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-lg p-1">
        {milestoneTasks.length > 0 ? (
          <TaskList projectId={projectId} tasks={milestoneTasks} milestones={projectMilestones} />
        ) : (
          <div className="text-center py-8 text-gray-400">
            No tasks found for this milestone. Add a task to get started.
          </div>
        )}
      </div>

      {/* Task Creation Modal */}
      {showCreateTaskModal && (
        <CreateTaskModal
          projectId={projectId}
          milestones={projectMilestones}
          selectedMilestoneId={milestoneId}
          onClose={() => setShowCreateTaskModal(false)}
          onTaskCreated={handleTaskCreated}
        />
      )}
    </div>
  );
};

export default MilestoneDetail;
