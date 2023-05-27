import { useQuery } from "react-query";

export const useStudentNotes = (token: string, studentId: string) => {
  return useQuery(
    ["studentNotes", studentId],
    async () => {
      try {
        let response = await fetch(
          `http://192.168.100.103:6969/student/${studentId}/notes`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

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
