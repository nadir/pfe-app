import { API_URL } from "../config/constants";

export const sendMessage = async (
  token: string,
  id: string,
  message: string
) => {
  const response = await fetch(`${API_URL}/messages/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ receiver_id: id, content: message }),
  });
  const data = await response.json();
  return data;
};

export const fetchMessages = async (token: string, id: string, page = 0) => {
  const response = await fetch(`${API_URL}/messages/user/${id}?page=${page}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  return data;
};

export const deleteMessage = async (token: string, id: string | number) => {
  const response = await fetch(`${API_URL}/messages/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (response.status === 200) {
    return true;
  }
  return false;
};
