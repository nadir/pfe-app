import { API_URL } from "../config/constants";

export const fetchStudents = async (token: string) => {
  try {
    const response = await fetch(`${API_URL}/students`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (response.ok) {
      return data.data;
    }
    throw new Error(data.message);
  } catch (error) {
    throw new Error((error as Error).message);
  }
};
