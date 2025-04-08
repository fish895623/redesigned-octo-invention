import { useState, useEffect } from 'react';
import { useProjects } from '../../hooks/useProjects';
import { Task } from '../../types/project';
import CommentCard from '../ui/Card/CommentCard';
import { Comment } from '../../types/project';

interface TaskDetailProps {
  projectId: number;
  taskId: number;
}

const TaskDetail = ({ projectId, taskId }: TaskDetailProps) => {
  const { projects, updateTask, deleteTask } = useProjects();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editCompleted, setEditCompleted] = useState(false);
  const [projectTitle, setProjectTitle] = useState<string>('');
  const [milestoneTitle, setMilestoneTitle] = useState<string | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      content: "This looks good, but let's double-check the requirements.",
      taskId: taskId,
      userId: 101,
    },
    {
      id: 2,
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      content: "Agreed. I'll review the spec document again.",
      taskId: taskId,
      userId: 102,
    },
  ]);

  useEffect(() => {
    setLoading(true); // Reset loading state on dependency change
    setError(null); // Reset error state
    setProjectTitle(''); // Reset project title
    setMilestoneTitle(null); // Reset milestone title

    const project = projects.find((p) => p.id === projectId);
    if (!project) {
      setError('Project not found');
      setLoading(false);
      return;
    }
    setProjectTitle(project.title); // Set project title

    const foundTask = project.tasks.find((t) => t.id === taskId);
    if (!foundTask) {
      setError('Task not found');
      setLoading(false);
      return;
    }

    setTask(foundTask);
    setEditTitle(foundTask.title);
    setEditDescription(foundTask.description || '');
    setEditCompleted(foundTask.completed);

    // Find milestone title if milestoneId exists
    if (foundTask.milestoneId) {
      const milestone = project.milestones.find((m) => m.id === foundTask.milestoneId);
      if (milestone) {
        setMilestoneTitle(milestone.title);
      } else {
        // Handle case where milestone ID exists but milestone is not found (optional)
        console.warn(`Milestone with ID ${foundTask.milestoneId} not found for task ${foundTask.id}`);
        setMilestoneTitle(`Milestone ID: ${foundTask.milestoneId} (Not Found)`);
      }
    } else {
      setMilestoneTitle(null);
    }

    setLoading(false);
  }, [projectId, taskId, projects]);

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
      setTimeout(() => setShowSuccessMessage(false), 3000); // Hide after 3 seconds
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

  const handleDelete = () => {
    if (task && window.confirm('Are you sure you want to delete this task?')) {
      deleteTask(projectId, task.id);
      // Redirect would happen via react-router navigation in a real app
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedComment = newComment.trim();
    if (trimmedComment && task) {
      // In a real app, you would make a POST request here
      console.log('Submitting comment:', trimmedComment, 'for task', task.id, 'in project', projectId);

      // Simulate adding the comment locally, matching the Comment type
      const newCommentData: Comment = {
        id: Date.now(), // Temporary ID generation
        createdAt: new Date(),
        updatedAt: new Date(), // Add updatedAt
        content: trimmedComment,
        taskId: task.id, // Add taskId
        userId: 999, // Placeholder user ID, replace with actual logged-in user ID
      };
      setComments([...comments, newCommentData]);
      setNewComment(''); // Clear the input field
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center p-8 text-gray-400">Loading task...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500 bg-red-900/20 rounded-md">{error}</div>;
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
              }
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
              Edit
            </button>
            <button
              onClick={handleToggleStatus}
              className={`px-4 py-2 ${
                task.completed ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-green-600 hover:bg-green-700'
              } text-white font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              {task.completed ? 'Mark as Incomplete' : 'Mark as Complete'}
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Delete
            </button>
          </div>

          {/* Comment Section */}
          <div className="mt-6 pt-6 border-t border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Comments</h3>

            {/* List of comments (Using CommentCard) */}
            <div className="space-y-4 mb-6">
              {comments.map((comment) => (
                <CommentCard
                  key={comment.id}
                  date={comment.createdAt.toLocaleString()}
                  author={`User ${comment.userId}`}
                  content={comment.content}
                />
              ))}
            </div>

            {/* Add Comment Form (Basic Structure) */}
            <form onSubmit={handleAddComment} className="space-y-3">
              <textarea
                placeholder="Add a comment..."
                rows={3}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!newComment.trim()}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Comment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskDetail;
