import { useQuery } from "react-query";
import { API_URL } from "../../config/constants";

export const useNotes = (
  token: string,
  classId?: number,
  moduleId?: number
) => {
  return useQuery(
    ["notes", classId, moduleId],
    async () => {
      try {
        let response = await fetch(`${API_URL}/notes/${moduleId}/${classId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Error fetching notes");
        }

        let data = await response.json();

        return data;
      } catch (error) {
        throw new Error("Error fetching notes");
      }
    },
    {
      enabled: !!classId && !!moduleId,
    }
  );
};
