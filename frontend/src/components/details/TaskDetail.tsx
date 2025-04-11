import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useProjects } from '../../hooks/useProjects';
import { useComments } from '../../hooks/useComments';
import { Task } from '../../types/project';
import CommentCard from '../ui/Card/CommentCard';

interface TaskDetailProps {
  projectId: number;
  taskId: number;
}

const TaskDetail = ({ projectId, taskId }: TaskDetailProps) => {
  const { projects, updateTask, deleteTask } = useProjects();
  const {
    comments,
    loading: commentsLoading,
    error: commentsError,
    fetchComments,
    addComment,
    deleteComment,
  } = useComments();

  const [task, setTask] = useState<Task | null>(null);
  const [taskLoading, setTaskLoading] = useState(true);
  const [taskError, setTaskError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editCompleted, setEditCompleted] = useState(false);
  const [projectTitle, setProjectTitle] = useState<string>('');
  const [milestoneTitle, setMilestoneTitle] = useState<string | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [newCommentContent, setNewCommentContent] = useState('');

  useEffect(() => {
    setTaskLoading(true);
    setTaskError(null);
    setProjectTitle('');
    setMilestoneTitle(null);

    const project = projects.find((p) => p.id === projectId);
    if (!project) {
      setTaskError('Project not found');
      setTaskLoading(false);
      return;
    }
    setProjectTitle(project.title);

    const foundTask = project.tasks.find((t) => t.id === taskId);
    if (!foundTask) {
      setTaskError('Task not found');
      setTaskLoading(false);
      return;
    }

    setTask(foundTask);
    setEditTitle(foundTask.title);
    setEditDescription(foundTask.description || '');
    setEditCompleted(foundTask.completed);

    if (foundTask.milestoneId) {
      const milestone = project.milestones.find((m) => m.id === foundTask.milestoneId);
      setMilestoneTitle(milestone ? milestone.title : `Milestone ID: ${foundTask.milestoneId} (Not Found)`);
    } else {
      setMilestoneTitle(null);
    }

    setTaskLoading(false);
  }, [projectId, taskId, projects]);

  useEffect(() => {
    if (projectId && taskId) {
      fetchComments(projectId, taskId);
    }
  }, [projectId, taskId, fetchComments]);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (task && editTitle.trim()) {
      updateTask({
        ...task,
        title: editTitle.trim(),
        description: editDescription.trim() || undefined,
        completed: editCompleted,
        updatedAt: new Date(),
      });
      setIsEditing(false);
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    }
  };

  const handleToggleStatus = () => {
    if (task) {
      updateTask({
        ...task,
        completed: !task.completed,
        updatedAt: new Date(),
      });
    }
  };

  const handleDeleteTask = () => {
    if (task && window.confirm('Are you sure you want to delete this task?')) {
      deleteTask(projectId, task.id);
    }
  };

  const handleAddComment = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const content = newCommentContent.trim();
      if (content && task) {
        const added = await addComment(projectId, taskId, { content });
        if (added) {
          setNewCommentContent('');
        }
      }
    },
    [newCommentContent, task, projectId, taskId, addComment],
  );

  const handleDeleteComment = useCallback(
    async (commentId: number) => {
      if (window.confirm('Are you sure you want to delete this comment?')) {
        await deleteComment(projectId, taskId, commentId);
      }
    },
    [projectId, taskId, deleteComment],
  );

  if (taskLoading) {
    return <div className="flex justify-center items-center p-8 text-gray-400">Loading task...</div>;
  }

  if (taskError) {
    return <div className="p-4 text-center text-red-500 bg-red-900/20 rounded-md">{taskError}</div>;
  }

  if (!task) {
    return <div className="p-4 text-center text-red-500 bg-red-900/20 rounded-md">Task not found</div>;
  }

  return (
    <div className="w-full p-6 bg-gray-900 rounded-lg shadow-md">
      {isEditing ? (
        <form onSubmit={handleUpdate} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="title" className="block text-sm font-medium text-gray-300">
              Title
            </label>
            <input
              id="title"
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              required
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-300">
              Description
            </label>
            <textarea
              id="description"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              placeholder="Description (optional)"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px] resize-y"
            />
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="completed"
              checked={editCompleted}
              onChange={(e) => setEditCompleted(e.target.checked)}
              className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="completed" className="text-gray-300">
              Completed
            </label>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-4 text-left">
          <div className="flex justify-between items-start mb-4 pb-4 border-b border-gray-700">
            <div>
              <h2 className="text-xl font-bold text-white mb-1">{task.title}</h2>
              <div className="flex space-x-1">
                <div className="text-sm text-blue-400">Project: {projectTitle}</div>
                {milestoneTitle && <div className="text-sm text-blue-400">Milestone: {milestoneTitle}</div>}
              </div>
            </div>
            <div
              className={`flex-shrink-0 px-3 py-1 rounded-full text-sm font-medium ${
                task.completed ? 'bg-green-700 text-green-200' : 'bg-gray-700 text-gray-200'
              }`}
            >
              {task.completed ? 'Completed' : 'In Progress'}
            </div>
          </div>
          {showSuccessMessage && (
            <div className="mb-4 p-3 bg-green-800/50 text-green-300 rounded-md text-center transition-opacity duration-300">
              Task updated successfully!
            </div>
          )}
          {task.description && <p className="text-gray-300 whitespace-pre-wrap mb-4">{task.description}</p>}
          <div className="flex space-x-1 text-sm text-gray-400 mb-4">
            <p>Created: {new Date(task.createdAt).toLocaleString()}</p>
            <p>Updated: {new Date(task.updatedAt).toLocaleString()}</p>
          </div>
          <div className="flex flex-wrap gap-2 pt-4 mb-4 pb-4 border-b border-gray-700">
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Edit Task
            </button>
            <button
              onClick={handleToggleStatus}
              className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              {task.completed ? 'Mark as In Progress' : 'Mark as Completed'}
            </button>
            <button
              onClick={handleDeleteTask}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Delete Task
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

          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">Comments</h3>

            <form onSubmit={handleAddComment} className="space-y-3">
              <textarea
                value={newCommentContent}
                onChange={(e) => setNewCommentContent(e.target.value)}
                placeholder="Add a comment..."
                required
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px] resize-y"
              />
              <button
                type="submit"
                disabled={commentsLoading || !newCommentContent.trim()}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-500 text-white font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {commentsLoading ? 'Adding...' : 'Add Comment'}
              </button>
            </form>

            {commentsError && (
              <div className="p-3 text-center text-red-400 bg-red-900/30 rounded-md">
                Error loading or modifying comments: {commentsError}
              </div>
            )}

            <div className="space-y-4">
              {commentsLoading && comments.length === 0 && (
                <div className="text-center text-gray-400 py-4">Loading comments...</div>
              )}
              {!commentsLoading && comments.length === 0 && !commentsError && (
                <div className="text-center text-gray-400 py-4">No comments yet.</div>
              )}
              {comments.map((comment) => (
                <div key={comment.id} className="relative group">
                  <CommentCard
                    date={comment.createdAt.toLocaleString()}
                    author={`User ${comment.userId}`}
                    content={comment.content}
                  />
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    disabled={commentsLoading}
                    className="absolute top-2 right-2 p-1 bg-red-700/50 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Delete comment"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskDetail;
