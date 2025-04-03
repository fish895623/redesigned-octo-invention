// TypeScript interfaces for the data models used in tests

export interface User {
  authenticated: boolean;
  id?: number;
  name?: string;
  email?: string;
  accessToken?: string;
  refreshToken?: string;
}

export interface Task {
  id: number;
  name: string;
  description: string;
  status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  dueDate: string;
  projectId: number;
  milestoneId?: number;
}

export interface Milestone {
  id: number;
  name: string;
  description: string;
  dueDate: string;
  status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED';
  projectId: number;
}

export interface Project {
  id: number;
  name: string;
  description: string;
  status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED';
  milestones: Milestone[];
  tasks: Task[];
  createdAt?: Date;
  updatedAt?: Date;
}
