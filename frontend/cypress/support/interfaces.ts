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
  title: string;
  description: string;
  status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  dueDate: string;
  projectId: number;
  milestoneId?: number;
}

export interface Milestone {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED';
  projectId: number;
  task?: Task[];
  tasks?: Task[];
  startDate?: string | null;
  completed?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED';
  milestones: Milestone[];
  tasks: Task[];
  createdAt?: Date;
  updatedAt?: Date;
}
