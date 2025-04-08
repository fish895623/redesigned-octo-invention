import React, { useState, useContext, ReactNode, useCallback } from 'react';
import { Comment } from '../types/project';
import { CommentContext } from './CommentContext'; // Import context from the other file
// import { apiClient } from '../api/apiClient'; // TODO: Uncomment when API endpoints are ready
// import { API_ENDPOINTS } from '../config/api'; // TODO: Uncomment when API endpoints are ready

// Define the props for the provider component
interface CommentProviderProps {
  children: ReactNode;
}

// Create the provider component
export const CommentProvider = ({ children }: CommentProviderProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch comments for a specific task (placeholder)
  const fetchComments = useCallback(async (taskId: number) => {
    setLoading(true);
    setError(null);
    console.log(`Fetching comments for task ${taskId}...`); // Placeholder
    try {
      // TODO: Replace with actual API call
      // const response = await apiClient.get<Comment[]>(API_ENDPOINTS.comments.list(taskId));
      // setComments(response.data);
      // Simulate API delay and set mock data for now
      await new Promise((resolve) => setTimeout(resolve, 500));
      const mockComments: Comment[] = [
        // Add mock comments if needed for testing, ensure they match the Comment type
        // { id: 1, content: 'Mock Comment 1', createdAt: new Date(), updatedAt: new Date(), taskId: taskId, userId: 1 },
      ];
      setComments(mockComments); // Set empty or mock data
      console.log(`Fetched comments for task ${taskId}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error(`Error fetching comments for task ${taskId}:`, errorMessage);
      setError(`Failed to fetch comments for task ${taskId}`);
      setComments([]); // Clear comments on error
    } finally {
      setLoading(false);
    }
  }, []);

  // Add a new comment (placeholder)
  const addComment = async (
    taskId: number,
    commentData: Omit<Comment, 'id' | 'createdAt' | 'updatedAt' | 'taskId' | 'userId' | 'userFullName'>,
  ): Promise<Comment | null> => {
    setLoading(true);
    setError(null);
    console.log('Adding comment:', commentData, 'to task', taskId); // Placeholder
    try {
      // TODO: Replace with actual API call
      // const response = await apiClient.post<Comment>(API_ENDPOINTS.comments.create(taskId), commentData);
      // const newComment = response.data;

      // Simulate API call and add locally
      await new Promise((resolve) => setTimeout(resolve, 300));
      const newComment: Comment = {
        ...commentData,
        id: Date.now(), // Temporary ID
        taskId: taskId,
        userId: 999, // Placeholder user ID
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setComments((prevComments) => [...prevComments, newComment]);
      return newComment;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error('Error adding comment:', errorMessage);
      setError('Failed to add comment');
      throw err; // Re-throw error to be caught by caller if needed
    } finally {
      setLoading(false);
    }
  };

  // Delete a comment (placeholder)
  const deleteComment = async (commentId: number): Promise<void> => {
    setLoading(true);
    setError(null);
    console.log('Deleting comment:', commentId); // Placeholder
    try {
      // TODO: Replace with actual API call
      // await apiClient.delete(API_ENDPOINTS.comments.delete(commentId));

      // Simulate API call and remove locally
      await new Promise((resolve) => setTimeout(resolve, 300));
      setComments((prevComments) => prevComments.filter((comment) => comment.id !== commentId));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error('Error deleting comment:', errorMessage);
      setError('Failed to delete comment');
      throw err; // Re-throw error
    } finally {
      setLoading(false);
    }
  };

  // Value provided by the context
  const value = {
    comments,
    loading,
    error,
    fetchComments,
    addComment,
    deleteComment,
  };

  // Use the imported CommentContext here
  return <CommentContext.Provider value={value}>{children}</CommentContext.Provider>;
};
