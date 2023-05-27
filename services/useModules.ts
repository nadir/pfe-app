import { useQuery } from "react-query";

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

export const useModules = (token: string) => {
  return useQuery<Module[]>("modules", async () => {
    try {
      const response = await fetch("http://192.168.100.103:6969/modules", {
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
      throw new Error("Request error");
    }
  });
};
