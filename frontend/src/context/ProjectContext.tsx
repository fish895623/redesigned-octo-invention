import {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
} from "react";
import { Project, Milestone, Task } from "../types/project";

export interface ProjectContextType {
  projects: Project[];
  loading: boolean;
  error: string | null;
  addProject: (
    project: Omit<
      Project,
      "id" | "createdAt" | "updatedAt" | "milestones" | "tasks"
    >,
  ) => void;
  updateProject: (project: Project) => void;
  deleteProject: (projectId: string) => void;
  addMilestone: (
    projectId: string,
    milestone: Omit<
      Milestone,
      "id" | "projectId" | "createdAt" | "updatedAt" | "tasks"
    >,
  ) => void;
  updateMilestone: (milestone: Milestone) => void;
  deleteMilestone: (projectId: string, milestoneId: string) => void;
  addTask: (
    projectId: string,
    task: Omit<Task, "id" | "projectId" | "createdAt" | "updatedAt">,
  ) => void;
  updateTask: (task: Task) => void;
  deleteTask: (projectId: string, taskId: string) => void;
}

export const ProjectContext = createContext<ProjectContextType | undefined>(
  undefined,
);

interface ProjectProviderProps {
  children: ReactNode;
}

// Use function declaration for component exports (better for Fast Refresh)
export function ProjectProvider({ children }: ProjectProviderProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch real projects from the API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/projects", {
          credentials: "include",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setProjects(
            data.map((project: any) => ({
              ...project,
              id: project.id.toString(),
              createdAt: new Date(project.createdAt),
              updatedAt: new Date(project.updatedAt),
              milestones: project.milestones
                ? project.milestones.map((m: any) => ({
                    ...m,
                    id: m.id.toString(),
                    projectId: project.id.toString(),
                    createdAt: new Date(m.createdAt),
                    updatedAt: new Date(m.updatedAt),
                  }))
                : [],
              tasks: project.tasks
                ? project.tasks.map((t: any) => ({
                    ...t,
                    id: t.id.toString(),
                    projectId: project.id.toString(),
                    milestoneId: t.milestoneId
                      ? t.milestoneId.toString()
                      : undefined,
                    createdAt: new Date(t.createdAt),
                    updatedAt: new Date(t.updatedAt),
                  }))
                : [],
            })),
          );
        } else {
          setError("Failed to fetch projects");
        }
      } catch (err) {
        console.error("Error fetching projects:", err);
        setError("Error connecting to server");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const addProject = async (
    project: Omit<
      Project,
      "id" | "createdAt" | "updatedAt" | "milestones" | "tasks"
    >,
  ) => {
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(project),
      });

      if (response.ok) {
        const data = await response.json();
        const newProject: Project = {
          ...data,
          id: data.id.toString(),
          createdAt: new Date(data.createdAt),
          updatedAt: new Date(data.updatedAt),
          milestones: data.milestones
            ? data.milestones.map((m: any) => ({
                ...m,
                id: m.id.toString(),
                projectId: data.id.toString(),
                createdAt: new Date(m.createdAt),
                updatedAt: new Date(m.updatedAt),
              }))
            : [],
          tasks: data.tasks
            ? data.tasks.map((t: any) => ({
                ...t,
                id: t.id.toString(),
                projectId: data.id.toString(),
                milestoneId: t.milestoneId
                  ? t.milestoneId.toString()
                  : undefined,
                createdAt: new Date(t.createdAt),
                updatedAt: new Date(t.updatedAt),
              }))
            : [],
        };
        setProjects([...projects, newProject]);
      } else {
        setError("Failed to create project");
      }
    } catch (err) {
      console.error("Error creating project:", err);
      setError("Error connecting to server");
    }
  };

  const updateProject = (updatedProject: Project) => {
    setProjects(
      projects.map((project) =>
        project.id === updatedProject.id ? updatedProject : project,
      ),
    );
  };

  const deleteProject = (projectId: string) => {
    setProjects(projects.filter((project) => project.id !== projectId));
  };

  const addMilestone = (
    projectId: string,
    milestone: Omit<
      Milestone,
      "id" | "projectId" | "createdAt" | "updatedAt" | "tasks"
    >,
  ) => {
    const newMilestone: Milestone = {
      ...milestone,
      id: crypto.randomUUID(),
      projectId,
      tasks: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setProjects(
      projects.map((project) => {
        if (project.id === projectId) {
          return {
            ...project,
            milestones: [...project.milestones, newMilestone],
          };
        }
        return project;
      }),
    );
  };

  const updateMilestone = (updatedMilestone: Milestone) => {
    setProjects(
      projects.map((project) => {
        if (project.id === updatedMilestone.projectId) {
          return {
            ...project,
            milestones: project.milestones.map((milestone) =>
              milestone.id === updatedMilestone.id
                ? updatedMilestone
                : milestone,
            ),
          };
        }
        return project;
      }),
    );
  };

  const deleteMilestone = (projectId: string, milestoneId: string) => {
    setProjects(
      projects.map((project) => {
        if (project.id === projectId) {
          return {
            ...project,
            milestones: project.milestones.filter(
              (milestone) => milestone.id !== milestoneId,
            ),
            tasks: project.tasks.map((task) => {
              if (task.milestoneId === milestoneId) {
                return { ...task, milestoneId: undefined };
              }
              return task;
            }),
          };
        }
        return project;
      }),
    );
  };

  const addTask = (
    projectId: string,
    task: Omit<Task, "id" | "projectId" | "createdAt" | "updatedAt">,
  ) => {
    const newTask: Task = {
      ...task,
      id: crypto.randomUUID(),
      projectId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setProjects(
      projects.map((project) => {
        if (project.id === projectId) {
          const updatedProject = {
            ...project,
            tasks: [...project.tasks, newTask],
          };

          // If task has a milestoneId, add it to the milestone's tasks as well
          if (newTask.milestoneId) {
            updatedProject.milestones = project.milestones.map((milestone) => {
              if (milestone.id === newTask.milestoneId) {
                return {
                  ...milestone,
                  tasks: [...milestone.tasks, newTask],
                };
              }
              return milestone;
            });
          }

          return updatedProject;
        }
        return project;
      }),
    );
  };

  const updateTask = (updatedTask: Task) => {
    setProjects(
      projects.map((project) => {
        if (project.id === updatedTask.projectId) {
          const updatedProject = {
            ...project,
            tasks: project.tasks.map((task) =>
              task.id === updatedTask.id ? updatedTask : task,
            ),
          };

          // Update task in milestone if needed
          updatedProject.milestones = project.milestones.map((milestone) => {
            // Check if task was previously in this milestone
            const taskInMilestone = milestone.tasks.some(
              (task) => task.id === updatedTask.id,
            );

            if (milestone.id === updatedTask.milestoneId) {
              // Task should be in this milestone
              if (taskInMilestone) {
                // Update existing task
                return {
                  ...milestone,
                  tasks: milestone.tasks.map((task) =>
                    task.id === updatedTask.id ? updatedTask : task,
                  ),
                };
              } else {
                // Add task to milestone
                return {
                  ...milestone,
                  tasks: [...milestone.tasks, updatedTask],
                };
              }
            } else if (taskInMilestone) {
              // Remove task from this milestone
              return {
                ...milestone,
                tasks: milestone.tasks.filter(
                  (task) => task.id !== updatedTask.id,
                ),
              };
            }

            return milestone;
          });

          return updatedProject;
        }
        return project;
      }),
    );
  };

  const deleteTask = (projectId: string, taskId: string) => {
    setProjects(
      projects.map((project) => {
        if (project.id === projectId) {
          // Remove task from project
          const updatedProject = {
            ...project,
            tasks: project.tasks.filter((task) => task.id !== taskId),
          };

          // Remove task from any milestone that contains it
          updatedProject.milestones = project.milestones.map((milestone) => {
            if (milestone.tasks.some((task) => task.id === taskId)) {
              return {
                ...milestone,
                tasks: milestone.tasks.filter((task) => task.id !== taskId),
              };
            }
            return milestone;
          });

          return updatedProject;
        }
        return project;
      }),
    );
  };

  const value = {
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
  };

  return (
    <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
  );
}

// Custom hook to use the ProjectContext
export const useProject = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error("useProject must be used within a ProjectProvider");
  }
  return context;
};
