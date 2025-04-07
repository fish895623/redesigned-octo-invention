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
      <div className="flex justify-between items-start mb-6 pb-4 border-b border-gray-700">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">{project.title}</h2>
          {project.description && <p className="text-gray-400 whitespace-pre-wrap">{project.description}</p>}
        </div>
      </div>
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
