import { useContext } from 'react';
import { CommentContext, CommentContextType } from '../context/CommentContext';

// Custom hook to use the CommentContext
export const useComments = (): CommentContextType => {
  const context = useContext(CommentContext);
  if (context === undefined) {
    throw new Error('useComments must be used within a CommentProvider');
  }
  return context;
};
