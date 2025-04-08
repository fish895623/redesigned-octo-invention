import React, { useState, ReactNode, useCallback } from 'react';
import { Comment } from '../types/project';
import { CommentContext, CommentContextType } from './CommentContext'; // Import context and type
import { apiClient } from '../api/apiClient'; // Uncommented
import { API_ENDPOINTS } from '../config/api'; // Uncommented

// Define the props for the provider component
interface CommentProviderProps {
  children: ReactNode;
}

// Create the provider component
export const CommentProvider = ({ children }: CommentProviderProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch comments for a specific task
  const fetchComments = useCallback(async (projectId: number, taskId: number) => {
    setLoading(true);
    setError(null);
    console.log(`Fetching comments for task ${taskId} in project ${projectId}...`);
    try {
      const response = await apiClient.get<any[]>(API_ENDPOINTS.comments.readAll(projectId, taskId));
      const rawComments = (response.data || []) as any[];
      // Adapt inline
      const adaptedComments = rawComments.map((rawComment) => ({
        ...rawComment,
        id: Number(rawComment.id),
        taskId: Number(rawComment.taskId),
        userId: Number(rawComment.userId),
        createdAt: new Date(rawComment.createdAt),
        updatedAt: new Date(rawComment.updatedAt),
      }));
      setComments(adaptedComments);
      console.log(`Fetched ${adaptedComments.length} comments for task ${taskId}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error(`Error fetching comments for task ${taskId}:`, errorMessage);
      setError(`Failed to fetch comments for task ${taskId}`);
      setComments([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Add a new comment
  const addComment = async (
    projectId: number,
    taskId: number,
    commentData: Pick<Comment, 'content'>,
  ): Promise<Comment | null> => {
    setLoading(true);
    setError(null);
    console.log('Adding comment:', commentData, 'to task', taskId, 'in project', projectId);
    const payload = {
      content: commentData.content,
    };

    try {
      const response = await apiClient.post<any>(API_ENDPOINTS.comments.create(projectId, taskId), payload); // Use any for response type
      // Adapt inline
      const rawNewComment = response.data;
      const newComment: Comment = {
        ...rawNewComment,
        id: Number(rawNewComment.id),
        taskId: Number(rawNewComment.taskId),
        userId: Number(rawNewComment.userId),
        createdAt: new Date(rawNewComment.createdAt),
        updatedAt: new Date(rawNewComment.updatedAt),
      };

      setComments((prevComments) => [...prevComments, newComment]);
      return newComment;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error('Error adding comment:', errorMessage);
      setError('Failed to add comment');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Delete a comment
  const deleteComment = async (projectId: number, taskId: number, commentId: number): Promise<void> => {
    setLoading(true);
    setError(null);
    console.log('Deleting comment:', commentId, 'from task', taskId, 'in project', projectId);
    try {
      await apiClient.delete(API_ENDPOINTS.comments.delete(projectId, taskId, commentId));
      // No adaptation needed for delete, just filter state
      setComments((prevComments) => prevComments.filter((comment) => comment.id !== commentId));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error('Error deleting comment:', errorMessage);
      setError('Failed to delete comment');
    } finally {
      setLoading(false);
    }
  };

  // Value provided by the context
  const value: CommentContextType = {
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
