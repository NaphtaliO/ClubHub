import { URL } from "@env";
import { io } from "socket.io-client";

export const socket = io(`${URL}`);