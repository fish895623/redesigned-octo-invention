export interface Task {
  id: number;
  title: string;
  completed: boolean;
  projectId: number;
  milestoneId?: number;
  description?: string;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Milestone {
  id: number;
  title: string;
  description?: string;
  projectId: number;
  startDate?: Date;
  dueDate?: Date;
  completed: boolean;
  tasks: Task[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: number;
  title: string;
  name?: string;
  description?: string;
  milestones: Milestone[];
  tasks: Task[];
  createdAt: Date;
  updatedAt: Date;
}
