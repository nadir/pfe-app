import { useQuery } from "react-query";

export const useNotes = (
  token: string,
  classId?: number,
  moduleId?: number
) => {
  return useQuery(
    ["notes", classId, moduleId],
    async () => {
      try {
        let response = await fetch(
          `http://192.168.100.103:6969/notes/${moduleId}/${classId}`,
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
      enabled: !!classId && !!moduleId,
    }
  );
};
