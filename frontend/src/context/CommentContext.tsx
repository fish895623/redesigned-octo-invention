import React, { createContext, useContext } from 'react';
import { Comment } from '../types/project';
// import { apiClient } from '../api/apiClient'; // TODO: Uncomment when API endpoints are ready
// import { API_ENDPOINTS } from '../config/api'; // TODO: Uncomment when API endpoints are ready

// Define the shape of the context data
export interface CommentContextType {
  comments: Comment[];
  loading: boolean;
  error: string | null;
  fetchComments: (taskId: number) => Promise<void>;
  addComment: (
    taskId: number,
    commentData: Omit<Comment, 'id' | 'createdAt' | 'updatedAt' | 'taskId' | 'userId' | 'userFullName'>,
  ) => Promise<Comment | null>; // Adjusted Omit based on previous type changes
  deleteComment: (commentId: number) => Promise<void>;
}

// Create the context with a default value
// The actual value will be provided by CommentProvider in CommentContextDefinition.tsx
export const CommentContext = createContext<CommentContextType | undefined>(undefined);

// Custom hook to use the CommentContext
export const useComments = (): CommentContextType => {
  const context = useContext(CommentContext);
  if (context === undefined) {
    throw new Error('useComments must be used within a CommentProvider');
  }
  return context;
};

// Export the context itself if needed elsewhere, though using the hook is preferred
export default CommentContext;
