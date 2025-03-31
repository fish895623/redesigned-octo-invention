import { useContext } from "react";
import { AuthContext } from "../context/AuthContextDefinition";

export function useAuth() {
  const authContext = useContext(AuthContext);
  return authContext;
}
