import { useContext } from "react";
import {
  ProjectContext,
  ProjectContextType,
} from "../context/ProjectContextDefinition";

export const useProjects = (): ProjectContextType => {
  const context = useContext(ProjectContext);

  if (context === undefined) {
    throw new Error("useProjects must be used within a ProjectProvider");
  }

  return context;
};
