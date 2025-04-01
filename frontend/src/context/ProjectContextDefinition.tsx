import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Project, Milestone, Task } from "../types/project";
import { API_ENDPOINTS, createHeaders } from "../config/api";

export interface ProjectContextType {
  projects: Project[];
  loading: boolean;
  error: string | null;
  addProject: (
    project: Omit<
      Project,
      "id" | "createdAt" | "updatedAt" | "milestones" | "tasks"
    >
  ) => Promise<Project>;
  updateProject: (project: Project) => Promise<void>;
  deleteProject: (projectId: string) => Promise<void>;
  addMilestone: (
    projectId: string,
    milestone: Omit<Milestone, "id" | "createdAt" | "updatedAt" | "tasks">
  ) => Promise<Milestone>;
  updateMilestone: (milestone: Milestone) => Promise<void>;
  deleteMilestone: (projectId: string, milestoneId: string) => Promise<void>;
  addTask: (
    projectId: string,
    task: Omit<Task, "id" | "projectId" | "createdAt" | "updatedAt">
  ) => Promise<Task>;
  updateTask: (task: Task) => Promise<void>;
  deleteTask: (projectId: string, taskId: string) => Promise<void>;
}

export const ProjectContext = createContext<ProjectContextType | undefined>(
  undefined
);

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error("useProject must be used within a ProjectProvider");
  }
  return context;
};

interface ProjectProviderProps {
  children: ReactNode;
}

export const ProjectProvider = ({ children }: ProjectProviderProps) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all projects on component mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await fetch(API_ENDPOINTS.projects.list, {
          headers: createHeaders(),
        });

        if (!response.ok) {
          throw new Error(`Error fetching projects: ${response.statusText}`);
        }

        const data = await response.json();
        setProjects(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Add a new project
  const addProject = async (
    newProject: Omit<
      Project,
      "id" | "createdAt" | "updatedAt" | "milestones" | "tasks"
    >
  ): Promise<Project> => {
    try {
      setLoading(true);
      const response = await fetch(API_ENDPOINTS.projects.create, {
        method: "POST",
        headers: createHeaders(),
        body: JSON.stringify(newProject),
      });

      if (!response.ok) {
        throw new Error(`Error creating project: ${response.statusText}`);
      }

      const createdProject = await response.json();
      setProjects((prevProjects) => [...prevProjects, createdProject]);
      setError(null);
      return createdProject;
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update an existing project
  const updateProject = async (project: Project): Promise<void> => {
    try {
      setLoading(true);
      const response = await fetch(
        API_ENDPOINTS.projects.update(Number(project.id)),
        {
          method: "PUT",
          headers: createHeaders(),
          body: JSON.stringify(project),
        }
      );

      if (!response.ok) {
        throw new Error(`Error updating project: ${response.statusText}`);
      }

      const updatedProject = await response.json();
      setProjects((prevProjects) =>
        prevProjects.map((p) => (p.id === project.id ? updatedProject : p))
      );
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete a project
  const deleteProject = async (projectId: string): Promise<void> => {
    try {
      setLoading(true);
      const response = await fetch(
        API_ENDPOINTS.projects.delete(Number(projectId)),
        {
          method: "DELETE",
          headers: createHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(`Error deleting project: ${response.statusText}`);
      }

      setProjects((prevProjects) =>
        prevProjects.filter((p) => p.id !== projectId)
      );
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Add a milestone to a project
  const addMilestone = async (
    projectId: string,
    milestone: Omit<Milestone, "id" | "createdAt" | "updatedAt" | "tasks">
  ): Promise<Milestone> => {
    try {
      setLoading(true);
      const response = await fetch(
        API_ENDPOINTS.milestones.create(Number(projectId)),
        {
          method: "POST",
          headers: createHeaders(),
          body: JSON.stringify(milestone),
        }
      );

      if (!response.ok) {
        throw new Error(`Error creating milestone: ${response.statusText}`);
      }

      const createdMilestone = await response.json();

      // Update the projects state with the new milestone
      setProjects((prevProjects) =>
        prevProjects.map((project) => {
          if (project.id === projectId) {
            return {
              ...project,
              milestones: [...project.milestones, createdMilestone],
            };
          }
          return project;
        })
      );

      setError(null);
      return createdMilestone;
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update an existing milestone
  const updateMilestone = async (milestone: Milestone): Promise<void> => {
    try {
      setLoading(true);
      const response = await fetch(
        API_ENDPOINTS.milestones.update(
          Number(milestone.projectId),
          Number(milestone.id)
        ),
        {
          method: "PUT",
          headers: createHeaders(),
          body: JSON.stringify(milestone),
        }
      );

      if (!response.ok) {
        throw new Error(`Error updating milestone: ${response.statusText}`);
      }

      const updatedMilestone = await response.json();

      // Update the projects state with the updated milestone
      setProjects((prevProjects) =>
        prevProjects.map((project) => {
          if (project.id === milestone.projectId) {
            return {
              ...project,
              milestones: project.milestones.map((m) =>
                m.id === milestone.id ? updatedMilestone : m
              ),
            };
          }
          return project;
        })
      );

      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete a milestone
  const deleteMilestone = async (
    projectId: string,
    milestoneId: string
  ): Promise<void> => {
    try {
      setLoading(true);
      const response = await fetch(
        API_ENDPOINTS.milestones.delete(Number(projectId), Number(milestoneId)),
        {
          method: "DELETE",
          headers: createHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(`Error deleting milestone: ${response.statusText}`);
      }

      // Update the projects state by removing the deleted milestone
      setProjects((prevProjects) =>
        prevProjects.map((project) => {
          if (project.id === projectId) {
            return {
              ...project,
              milestones: project.milestones.filter(
                (m) => m.id !== milestoneId
              ),
            };
          }
          return project;
        })
      );

      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Add a task to a project
  const addTask = async (
    projectId: string,
    task: Omit<Task, "id" | "projectId" | "createdAt" | "updatedAt">
  ): Promise<Task> => {
    try {
      setLoading(true);
      const taskWithProjectId = {
        ...task,
        projectId,
      };

      const response = await fetch(
        API_ENDPOINTS.tasks.create(Number(projectId)),
        {
          method: "POST",
          headers: createHeaders(),
          body: JSON.stringify(taskWithProjectId),
        }
      );

      if (!response.ok) {
        throw new Error(`Error creating task: ${response.statusText}`);
      }

      const createdTask = await response.json();

      // Update the projects state with the new task
      setProjects((prevProjects) =>
        prevProjects.map((project) => {
          if (project.id === projectId) {
            // Add to project tasks
            const updatedProject = {
              ...project,
              tasks: [...project.tasks, createdTask],
            };

            // If the task belongs to a milestone, add it to that milestone's tasks as well
            if (task.milestoneId) {
              updatedProject.milestones = project.milestones.map(
                (milestone) => {
                  if (milestone.id === task.milestoneId) {
                    return {
                      ...milestone,
                      tasks: [...milestone.tasks, createdTask],
                    };
                  }
                  return milestone;
                }
              );
            }

            return updatedProject;
          }
          return project;
        })
      );

      setError(null);
      return createdTask;
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update an existing task
  const updateTask = async (task: Task): Promise<void> => {
    try {
      setLoading(true);
      const response = await fetch(
        API_ENDPOINTS.tasks.update(Number(task.projectId), Number(task.id)),
        {
          method: "PUT",
          headers: createHeaders(),
          body: JSON.stringify(task),
        }
      );

      if (!response.ok) {
        throw new Error(`Error updating task: ${response.statusText}`);
      }

      const updatedTask = await response.json();

      // Update the projects state with the updated task
      setProjects((prevProjects) =>
        prevProjects.map((project) => {
          if (project.id === task.projectId) {
            // Update in project tasks
            const updatedProject = {
              ...project,
              tasks: project.tasks.map((t) =>
                t.id === task.id ? updatedTask : t
              ),
            };

            // Update in milestone tasks if applicable
            updatedProject.milestones = project.milestones.map((milestone) => {
              // Check if task is in this milestone (either before or after update)
              if (
                milestone.id === task.milestoneId ||
                milestone.tasks.some((t) => t.id === task.id)
              ) {
                // If milestone ID has changed, we need to remove or add the task
                if (milestone.id === task.milestoneId) {
                  // Task belongs to this milestone, add or update it
                  return {
                    ...milestone,
                    tasks: milestone.tasks.some((t) => t.id === task.id)
                      ? milestone.tasks.map((t) =>
                          t.id === task.id ? updatedTask : t
                        )
                      : [...milestone.tasks, updatedTask],
                  };
                } else {
                  // Task has been moved out of this milestone, remove it
                  return {
                    ...milestone,
                    tasks: milestone.tasks.filter((t) => t.id !== task.id),
                  };
                }
              }
              return milestone;
            });

            return updatedProject;
          }
          return project;
        })
      );

      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete a task
  const deleteTask = async (
    projectId: string,
    taskId: string
  ): Promise<void> => {
    try {
      setLoading(true);
      const response = await fetch(
        API_ENDPOINTS.tasks.delete(Number(projectId), Number(taskId)),
        {
          method: "DELETE",
          headers: createHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(`Error deleting task: ${response.statusText}`);
      }

      // Update the projects state by removing the deleted task
      setProjects((prevProjects) =>
        prevProjects.map((project) => {
          if (project.id === projectId) {
            // Remove from project tasks
            const updatedProject = {
              ...project,
              tasks: project.tasks.filter((t) => t.id !== taskId),
            };

            // Remove from milestone tasks if applicable
            updatedProject.milestones = project.milestones.map((milestone) => {
              return {
                ...milestone,
                tasks: milestone.tasks.filter((t) => t.id !== taskId),
              };
            });

            return updatedProject;
          }
          return project;
        })
      );

      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        loading,
        error,
        addProject,
        updateProject,
        deleteProject,
        addMilestone,
        updateMilestone,
        deleteMilestone,
        addTask,
        updateTask,
        deleteTask,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};
