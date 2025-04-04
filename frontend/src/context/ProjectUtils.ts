import { Project } from '../types/project';

// Helper function to adapt projects for test compatibility
export const adaptProject = (project: Project): Project & { name?: string } => {
  return {
    ...project,
    name: project.title, // Add name property that mirrors title for test compatibility
  };
};
