export interface Task {
  id: string;
  title: string;
  completed: boolean;
  projectId: string;
  milestoneId?: string;
  description?: string;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Milestone {
  id: string;
  title: string;
  description?: string;
  projectId: string;
  startDate?: Date;
  dueDate?: Date;
  completed: boolean;
  tasks: Task[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: string;
  title: string;
  description?: string;
  milestones: Milestone[];
  tasks: Task[];
  createdAt: Date;
  updatedAt: Date;
}
