import { useState, useCallback, useMemo } from 'react';
import { useProject } from '../../context/ProjectContextDefinition';
import { Project } from '../../types/project';
import CreateProjectModal from '../modals/CreateProjectModal';
import { Link, useNavigate } from 'react-router-dom';

interface ProjectListProps {
  onSelectProject?: (id: number) => void;
}

// Main ProjectList component
const ProjectList = ({ onSelectProject }: ProjectListProps) => {
  const navigate = useNavigate();
  const { projects, updateProject, deleteProject } = useProject();
  const [editingProjectId, setEditingProjectId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [sortBy, setSortBy] = useState<'created' | 'updated'>('updated');

  // Callbacks to avoid unnecessary rerenders
  const handleEditProject = useCallback((project: Project) => {
    setEditingProjectId(project.id);
    setEditTitle(project.title);
    setEditDescription(project.description || '');
  }, []);

  const handleSaveEdit = useCallback(
    (project: Project) => {
      if (editTitle.trim()) {
        updateProject({
          ...project,
          title: editTitle.trim(),
          description: editDescription.trim() || undefined,
          updatedAt: new Date(),
        });
        setEditingProjectId(null);
      }
    },
    [editTitle, editDescription, updateProject],
  );

  const handleDeleteProject = useCallback(
    async (projectId: number) => {
      if (window.confirm('프로젝트를 삭제하시겠습니까?')) {
        try {
          await deleteProject(projectId);
          // 삭제 후 페이지 이동을 제거하여 목록에서 바로 삭제되도록 수정
          // navigate('/');
        } catch (error) {
          console.error('Error deleting project:', error);
          alert('프로젝트 삭제에 실패했습니다. 다시 시도해주세요.');
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
          >
            <option value="updated">Sort by Updated</option>
            <option value="created">Sort by Created</option>
          </select>
          <button
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
            onClick={() => setShowProjectModal(true)}
          >
            Add Project
          </button>
        </div>
      </div>
      <div className="p-4 flex flex-col gap-4">
        {sortedProjects.map((project) => (
          <div
            key={project.id}
            className="flex items-start gap-4 p-4 border border-gray-700 rounded-md bg-gray-800 project-item"
            onClick={() => onSelectProject && onSelectProject(project.id)}
          >
            {editingProjectId === project.id ? (
              <div className="flex-1 flex flex-col gap-2">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onBlur={() => handleSaveEdit(project)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit(project)}
                  className="p-2 border border-gray-700 rounded-md w-full bg-gray-800 text-white focus:ring-2 focus:ring-blue-500"
                  data-testid="edit-project-title-input"
                />
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  onBlur={() => handleSaveEdit(project)}
                  placeholder="Add description..."
                  className="p-2 border border-gray-700 rounded-md w-full bg-gray-800 text-white min-h-[100px] resize-y focus:ring-2 focus:ring-blue-500"
                  data-testid="edit-project-description-input"
                />
                <div className="flex justify-end mt-2">
                  <button
                    onClick={() => handleSaveEdit(project)}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
                    data-testid="save-edit-project"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <Link to={`/project/${project.id}/milestone`} className="flex-1 cursor-pointer no-underline text-inherit">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2 text-left">{project.title}</h3>
                  {project.description && (
                    <p className="text-gray-400 text-sm whitespace-pre-wrap text-left">{project.description}</p>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2 text-left">{project.title}</h3>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2 text-left">
                    {(project as any).name || project.title}
                  </h3>
                  {project.description && (
                    <p className="text-gray-400 text-sm whitespace-pre-wrap text-left">{project.description}</p>
                  )}
                </div>
                <div className="flex gap-4 mb-2 text-sm text-gray-300">
                  <span>Milestones: {project.milestones.length}</span>
                  <span>Tasks: {project.tasks.length}</span>
                </div>
                <div className="flex gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    Updated: {new Date(project.updatedAt).toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1">
                    Created: {new Date(project.createdAt).toLocaleString()}
                  </span>
                </div>
              </Link>
            )}
            <div className="flex gap-2">
              <button
                className="inline-block px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-md transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/project/${project.id}`);
                }}
                data-testid={`view-project-${project.id}`}
              >
                More
              </button>
              <button
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditProject(project);
                }}
                data-testid={`edit-project-${project.id}`}
              >
                Edit
              </button>
              <button
                className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteProject(project.id);
                }}
                data-testid={`delete-project-${project.id}`}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      {showProjectModal && <CreateProjectModal onClose={() => setShowProjectModal(false)} />}
    </div>
  );
};

export default ProjectList;
