import { useQuery } from "react-query";
import { API_URL } from "../config/constants";

export type Module = {
  id: number;
  name: string;
  description: string;
  icon: string;
  color: string;
  level: number;
  class_id: number;
  class_name: string;
};

export const useModules = (token: string, class_id?: string) => {
  return useQuery<Module[]>(["modules", class_id], async () => {
    try {
      const response = await fetch(`${API_URL}/modules/${class_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error fetching modules");
      }

      let data = await response.json();

      return data.results;
    } catch (error) {
      throw new Error("Error getting teacher modules");
    }
  });
};
