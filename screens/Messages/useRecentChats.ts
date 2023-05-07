import { useQuery } from "react-query";
import { API_URL } from "../../config/constants";

interface RecentChat {
  contact_id: string;
  first_name: string;
  last_name: string;
  profile_pic?: string;
  content: string;
  created_at: string;
}

export const useRecentChats = (token: string) => {
  return useQuery<RecentChat[], Error>("recentChats", async () => {
    try {
      const response = await fetch(`${API_URL}/messages/conversations`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      return data;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  });
};
