import { useState, useCallback, useMemo } from 'react';
import { useProject } from '../../context/ProjectContext';
import { Project } from '../../types/project';
import CreateProjectModal from '../modals/CreateProjectModal';
import EditProjectModal from '../modals/EditProjectModal';
import { Link, useNavigate } from 'react-router-dom';
import BaseCard from '../ui/Card/BaseCard';

interface ProjectListProps {
  onSelectProject?: (id: number) => void;
}

// Main ProjectList component
const ProjectList = ({ onSelectProject }: ProjectListProps) => {
  const navigate = useNavigate();
  const { projects, deleteProject, loading } = useProject();
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [sortBy, setSortBy] = useState<'created' | 'updated'>('updated');
  const [deletingProjectId, setDeletingProjectId] = useState<number | null>(null);

  // Callbacks to avoid unnecessary rerenders
  const handleEditProject = useCallback((project: Project) => {
    setEditingProject(project);
  }, []);

  const convertLocalDateTimeArrayToDate = (arr) => {
    if (!arr || arr.length < 7) return null;
    const [year, month, day, hour, minute, second, nano] = arr;
    const jsMonth = month - 1;

    const millisecond = Math.floor(nano / 1000000);
    return new Date(year, jsMonth, day, hour, minute, second, millisecond);
  };

  const handleDeleteProject = useCallback(
    async (projectId: number) => {
      if (window.confirm('프로젝트를 삭제하시겠습니까?')) {
        try {
          setDeletingProjectId(projectId);
          await deleteProject(projectId);
        } catch (error) {
          console.error('Error deleting project:', error);
          alert('프로젝트 삭제에 실패했습니다. 다시 시도해주세요.');
        } finally {
          setDeletingProjectId(null);
        }
      }
    },
    [deleteProject],
  );

  // Sort projects by either created or updated time with safe date handling
  const sortedProjects = useMemo(() => {
    return [...projects].sort((a, b) => {
      try {
        // Handle potential missing or invalid date fields
        const dateA = sortBy === 'created' ? a.createdAt : a.updatedAt;
        const dateB = sortBy === 'created' ? b.createdAt : b.updatedAt;

        // Convert to timestamp if possible
        const timeA = dateA ? (dateA instanceof Date ? dateA.getTime() : new Date(dateA).getTime()) : 0;
        const timeB = dateB ? (dateB instanceof Date ? dateB.getTime() : new Date(dateB).getTime()) : 0;

        return timeB - timeA;
      } catch (error) {
        // If there's any error in date handling, don't change the order
        return 0;
      }
    });
  }, [projects, sortBy]);

  return (
    <div className="w-full max-w-7xl mx-auto bg-gray-900 rounded-lg shadow-md overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 border-b border-gray-700">
        <div>
          <h2 className="text-xl font-bold text-white">Projects</h2>
          <div className="text-sm text-blue-400 font-medium mt-1">
            Total Projects:{' '}
            <span className="bg-blue-600 text-white px-2 py-0.5 rounded-full ml-1">{projects.length}</span>
          </div>
        </div>
        <div className="flex gap-4 items-center mt-4 sm:mt-0">
          <select
            className="p-2 border border-gray-700 rounded-md bg-gray-800 text-white focus:ring-2 focus:ring-blue-500"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            disabled={loading}
          >
            <option value="updated">Sort by Updated</option>
            <option value="created">Sort by Created</option>
          </select>
          <button
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => setShowProjectModal(true)}
            disabled={loading}
          >
            Add Project
          </button>
        </div>
      </div>
      <div className="p-4 flex flex-col gap-4">
        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        )}
        {!loading &&
          sortedProjects.map((project) => (
            <BaseCard
              key={project.id}
              title={project.title}
              description={project.description || undefined}
              onClick={() => {
                if (onSelectProject) onSelectProject(project.id);
                else navigate(`/project/${project.id}/milestone`);
              }}
              headerLeft={
                <div className="flex gap-2">
                  <button
                    className="inline-block px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/project/${project.id}`);
                    }}
                    data-testid={`view-project-${project.id}`}
                    disabled={loading}
                  >
                    More
                  </button>
                  <button
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditProject(project);
                    }}
                    data-testid={`edit-project-${project.id}`}
                    disabled={loading}
                  >
                    Edit
                  </button>
                  <button
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteProject(project.id);
                    }}
                    data-testid={`delete-project-${project.id}`}
                    disabled={loading || deletingProjectId === project.id}
                  >
                    {deletingProjectId === project.id ? (
                      <span className="flex items-center gap-1">
                        <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                        Deleting...
                      </span>
                    ) : (
                      'Delete'
                    )}
                  </button>
                </div>
              }
              footer={
                <>
                  <div className="flex gap-4 mb-2 text-sm text-gray-300">
                    <span>Milestones: {project.milestones.length}</span>
                    <span>Tasks: {project.tasks.length}</span>
                  </div>
                  <div className="flex gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      Updated: {convertLocalDateTimeArrayToDate(project.updatedAt)?.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      Created: {convertLocalDateTimeArrayToDate(project.createdAt)?.toLocaleString()}
                    </span>
                  </div>
                </>
              }
            />
          ))}
      </div>
      {showProjectModal && <CreateProjectModal onClose={() => setShowProjectModal(false)} />}
      {editingProject && <EditProjectModal project={editingProject} onClose={() => setEditingProject(null)} />}
    </div>
  );
};

export default ProjectList;
