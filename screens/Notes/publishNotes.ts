import { API_URL } from "../../config/constants";

export interface Note {
  id: number;
  name: string;
  evaluation: string;
  test: string;
  exam: string;
  updated_at: string;
}

export const publishNotes = async (
  token: string,
  notes: Note[],
  class_id: number,
  module_id: number
) => {
  try {
    let resposne = await fetch(`${API_URL}/notes/${module_id}/${class_id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        notes: notes,
      }),
    });

    if (!resposne.ok) {
      throw new Error("Error publishing notes");
    }
    return true;
  } catch (error) {
    throw new Error("Error publishing notes");
  }
};
