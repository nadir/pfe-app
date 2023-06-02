import { API_URL } from "../config/constants";

interface Post {
  type: string;
  title: string;
  content?: string;

  options?: string[];
  image?: string;
  classId?: string;
}

export const publishPost = (post: Post, token: string) => {
  const form = new FormData();

  if (post.type === "poll") {
    form.append("type", post.type);
    form.append("question", post.title);
    form.append("options", JSON.stringify(post.options));
    if (post.classId) form.append("classId", post.classId);
  } else if (post.type === "post") {
    form.append("type", "publication");
    form.append("title", post.title);
    form.append("content", post.content!);
    if (post.classId) form.append("classId", post.classId);

    if (post.image) {
      let uriArray = post.image.split(".");
      let fileType = uriArray[uriArray.length - 1];

      form.append("image", {
        uri: post.image,
        name: `photo.${fileType}`,
        type: `image/${fileType}`,
      } as unknown as Blob);
    }
  }

  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  };

  return fetch(`${API_URL}/posts`, { ...options, body: form });
};
