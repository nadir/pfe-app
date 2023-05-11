import { useQuery } from "react-query";
import { API_URL } from "../../config/constants";

interface Contact {
  user_id: string;
  first_name: string;
  last_name: string;
  profile_pic?: string;
}

export const useContacts = (token: string, search?: string) => {
  return useQuery<Contact[], Error>(
    "contacts",
    async () => {
      try {
        const response = await fetch(`${API_URL}/messages/contacts`, {
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
    },
    {
      select: (data) => {
        if (!search) return data;
        return data.filter((contact) => {
          const fullName = `${contact.first_name} ${contact.last_name}`;
          return fullName.toLowerCase().includes(search.toLowerCase());
        });
      },
    }
  );
};
