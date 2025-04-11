/**
 * This component is used to display a list of milestones under the projects.
 * This requests to /api/projects/:projectId/milestones.
 * Authentication is requested.
 */
import { useState, useCallback } from 'react';
import { Milestone } from '../../types/project';
import CreateMilestoneModal from '../modals/CreateMilestoneModal';
import EditMilestoneModal from '../modals/EditMilestoneModal';
import { useProject } from '../../context/ProjectContext';
import BaseCard from '../ui/Card/BaseCard';
import { useNavigate,Link } from 'react-router-dom';

interface MilestoneListProps {
  projectId: number;
  milestones: Milestone[];
}

const MilestoneList = ({ projectId, milestones }: MilestoneListProps) => {
  const { deleteMilestone } = useProject();
  const [showMilestoneModal, setShowMilestoneModal] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(null);
  const [sortBy, setSortBy] = useState<'created' | 'updated'>('updated');
  const navigate = useNavigate();

  const handleMilestoneClick = (milestoneId: number) => {
    navigate(`/project/${projectId}/milestone/${milestoneId}`);
  };

  const handleEditMilestone = useCallback((milestone: Milestone) => {
    setEditingMilestone(milestone);
  }, []);

  const handleDelete = useCallback(
    (milestoneId: number, event: React.MouseEvent) => {
      event.stopPropagation();
      if (window.confirm('Are you sure you want to delete this milestone?')) {
        try {
          deleteMilestone(projectId, milestoneId);
        } catch (error) {
          console.error('Error deleting milestone:', error);
          alert('Failed to delete milestone. Please try again.');
        }
      }
    },
    [deleteMilestone, projectId],
  );

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
          <h2 className="text-xl font-bold text-white text-left">Milestones</h2>
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
          {location.pathname !== `/project/${projectId}` && (
            <Link
            to={`/project/${projectId}`}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
                Back Project
            </Link>
          )}
        </div>
      </div>
      <div className="p-4 flex flex-col gap-4">
        {sortedMilestones.map((milestone) => (
          <BaseCard
            key={milestone.id}
            title={milestone.title}
            description={milestone.description || undefined}
            headerRight={
              <>
                <div className="flex gap-2 items-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditMilestone(milestone);
                    }}
                    className="px-3 py-1 bg-gray-700 text-white text-sm rounded-md hover:bg-gray-600 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => handleDelete(milestone.id, e)}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded-md transition-colors"
                    title="Delete milestone"
                  >
                    Delete
                  </button>
                </div>
              </>
            }
            footer={
              <>
                <div>Tasks: {milestone.tasks.length}</div>
              </>
            }
            onClick={() => handleMilestoneClick(milestone.id)}
          />
        ))}
        {sortedMilestones.length === 0 && (
          <div className="text-center text-gray-400 py-8">No milestones found. Create one to get started!</div>
        )}
      </div>
      {showMilestoneModal && (
        <CreateMilestoneModal onClose={() => setShowMilestoneModal(false)} projectId={projectId} />
      )}
      {editingMilestone && (
        <EditMilestoneModal milestone={editingMilestone} onClose={() => setEditingMilestone(null)} />
      )}
    </div>
  );
};

export default MilestoneList;
