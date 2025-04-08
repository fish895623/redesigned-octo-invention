import { createContext } from 'react';
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
