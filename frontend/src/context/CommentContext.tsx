import React, { createContext, useContext } from 'react';
import { Comment } from '../types/project';

// Define the shape of the context data
export interface CommentContextType {
  comments: Comment[];
  loading: boolean;
  error: string | null;
  fetchComments: (projectId: number, taskId: number) => Promise<void>;
  addComment: (
    projectId: number,
    taskId: number,
    commentData: Omit<Comment, 'id' | 'createdAt' | 'updatedAt' | 'taskId' | 'userId' | 'userFullName'>,
  ) => Promise<Comment | null>;
  deleteComment: (projectId: number, taskId: number, commentId: number) => Promise<void>;
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
