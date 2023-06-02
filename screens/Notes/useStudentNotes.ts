import { useQuery } from "react-query";
import { API_URL } from "../../config/constants";

export const useStudentNotes = (token: string, studentId: string) => {
  return useQuery(
    ["studentNotes", studentId],
    async () => {
      try {
        let response = await fetch(`${API_URL}/student/${studentId}/notes`, {
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
      enabled: studentId !== null,
    }
  );
};
