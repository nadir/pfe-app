export const fetchStudents = async (token: string) => {
  try {
    const response = await fetch(`http://192.168.100.103:6969/students`, {
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
