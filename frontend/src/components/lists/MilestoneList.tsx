/**
 * This component is used to display a list of milestones under the projects.
 * This requests to /api/projects/:projectId/milestones.
 * Authentication is requested.
 */
import { useState } from 'react';
import { Milestone } from '../../types/project';
import CreateMilestoneModal from '../modals/CreateMilestoneModal';
import { useProject } from '../../context/ProjectContext';

interface MilestoneListProps {
  projectId: number;
  milestones: Milestone[];
}

const MilestoneList = ({ projectId, milestones }: MilestoneListProps) => {
  const { deleteMilestone } = useProject();
  const [showMilestoneModal, setShowMilestoneModal] = useState(false);
  const [sortBy, setSortBy] = useState<'created' | 'updated'>('updated');

  const handleMilestoneClick = (milestoneId: number) => {
    window.location.href = `/project/${projectId}/milestone/${milestoneId}`;
  };

  const handleDelete = (milestoneId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    if (window.confirm('Are you sure you want to delete this milestone?')) {
      deleteMilestone(projectId, milestoneId);
    }
  };

  const sortedMilestones = [...milestones].sort((a, b) => {
    if (sortBy === 'updated') {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="w-full max-w-7xl mx-auto bg-gray-900 rounded-lg shadow-md overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 border-b border-gray-700">
        <div>
          <h2 className="text-xl font-bold text-white">Milestones</h2>
          <div className="text-sm text-blue-400 font-medium mt-1">
            Total Milestones:{' '}
            <span className="bg-blue-600 text-white px-2 py-0.5 rounded-full ml-1">{milestones.length}</span>
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
            onClick={() => setShowMilestoneModal(true)}
          >
            Add Milestone
          </button>
        </div>
      </div>
      <div className="p-4 flex flex-col gap-4">
        {sortedMilestones.map((milestone) => (
          <div
            key={milestone.id}
            className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors cursor-pointer"
            onClick={() => handleMilestoneClick(milestone.id)}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-white hover:text-blue-400 transition-colors">
                  {milestone.title}
                </h3>
                {milestone.description && <p className="text-gray-400 mt-1">{milestone.description}</p>}
              </div>
              <div className="flex items-center gap-3">
                <div
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    milestone.completed ? 'bg-green-600 text-green-100' : 'bg-yellow-600 text-yellow-100'
                  }`}
                >
                  {milestone.completed ? 'Completed' : 'In Progress'}
                </div>
                <button
                  onClick={(e) => handleDelete(milestone.id, e)}
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded-md transition-colors"
                  title="Delete milestone"
                >
                  Delete
                </button>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-400">
              {milestone.startDate && <div>Start: {new Date(milestone.startDate).toLocaleDateString()}</div>}
              {milestone.dueDate && <div>Due: {new Date(milestone.dueDate).toLocaleDateString()}</div>}
              <div>Tasks: {milestone.tasks.length}</div>
            </div>
          </div>
        ))}
        {sortedMilestones.length === 0 && (
          <div className="text-center text-gray-400 py-8">No milestones found. Create one to get started!</div>
        )}
      </div>
      {showMilestoneModal && (
        <CreateMilestoneModal onClose={() => setShowMilestoneModal(false)} projectId={projectId} />
      )}
    </div>
  );
};

export default MilestoneList;
