import { API_URL } from "../config/constants";

export const fetchUser = async (token: string) => {
  try {
    const response = await fetch(`${API_URL}/user/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (response.ok) {
      return data;
    }
    throw new Error(data.message);
  } catch (error) {
    throw new Error((error as Error).message);
  }
};
