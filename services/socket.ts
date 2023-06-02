import { io } from "socket.io-client";
import { API_URL } from "../config/constants";

function socket(token: string) {
  return io(API_URL, {
    path: "/ws/",
    auth: {
      token: token,
    },
  });
}

export default socket;
