import { API_URL } from "../config/constants";

export const refreshFCMToken = async (token: string, fcmToken: string) => {
  try {
    const data = await fetch(`${API_URL}/user/firebase/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        token: fcmToken,
      }),
    });
    if (!data.ok) throw new Error(data.statusText);
  } catch (error) {
    throw new Error((error as Error).message);
  }
};
