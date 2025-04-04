import React, { useState, useEffect } from 'react';
import { useProject } from '../../context/ProjectContext';
import { Project } from '../../types/project';
import MilestoneList from '../lists/MilestoneList';
import TaskList from '../lists/TaskList';
import CreateMilestoneModal from '../modals/CreateMilestoneModal';
import { useNavigate } from 'react-router-dom';

interface ProjectDetailProps {
  projectId: number;
}

const ProjectDetail = ({ projectId }: ProjectDetailProps) => {
  const navigate = useNavigate();
  const { projects, updateProject, deleteProject } = useProject();
  const [project, setProject] = useState<Project | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [activeTab, setActiveTab] = useState<'milestones' | 'tasks'>('milestones');
  const [showMilestoneModal, setShowMilestoneModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleCloseMilestoneModal = () => {
    setShowMilestoneModal(false);
  };

  useEffect(() => {
    // Find the project in the projects array
    const foundProject = projects.find((p) => p.id === projectId);
    if (foundProject) {
      setProject(foundProject);
      setTitle(foundProject.title);
      setDescription(foundProject.description || '');
      setLoading(false);
    } else if (projects.length > 0) {
      // If we have projects but didn't find this one
      setError('Project not found');
      setLoading(false);
    }
  }, [projectId, projects]);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (project && title.trim()) {
      const updatedProject = {
        ...project,
        title: title.trim(),
        description: description.trim() || undefined,
        updatedAt: new Date(),
      };
      updateProject(updatedProject);
      setIsEditing(false);
    }
  };

  const handleDelete = async () => {
    if (project && window.confirm('프로젝트를 삭제하시겠습니까?')) {
      try {
        await deleteProject(project.id);
        navigate('/');
      } catch (error) {
        console.error('Error deleting project:', error);
        alert('프로젝트 삭제에 실패했습니다. 다시 시도해주세요.');
      }
    }
  };

  if (loading) {
    return <div>Loading project...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!project) {
    return <div className="error">Project not found</div>;
  }

  return (
    <div className="w-full max-w-7xl mx-auto bg-gray-900 rounded-lg shadow-md overflow-hidden p-6">
      {isEditing ? (
        <form onSubmit={handleUpdate} className="space-y-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description (optional)"
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-white min-h-[100px] resize-y focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex gap-3">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-md transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="flex justify-between items-start mb-6 pb-4 border-b border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">{project.title}</h2>
            {project.description && <p className="text-gray-400 whitespace-pre-wrap">{project.description}</p>}
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      )}
      <div className="flex gap-4 mb-6">
        <button
          className={`px-4 py-2 font-medium rounded-md transition-colors ${
            activeTab === 'milestones' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
          onClick={() => setActiveTab('milestones')}
        >
          Milestones ({project.milestones.length})
        </button>
        <button
          className={`px-4 py-2 font-medium rounded-md transition-colors ${
            activeTab === 'tasks' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
          onClick={() => setActiveTab('tasks')}
        >
          Tasks ({project.tasks.length})
        </button>
      </div>
      {showMilestoneModal && <CreateMilestoneModal projectId={project.id} onClose={handleCloseMilestoneModal} />}
      <div className="tab-content">
        {activeTab === 'milestones' ? (
          <MilestoneList projectId={project.id} milestones={project.milestones} />
        ) : (
          <TaskList projectId={project.id} tasks={project.tasks} milestones={project.milestones} />
        )}
      </div>
    </div>
  );
};

export default ProjectDetail;
