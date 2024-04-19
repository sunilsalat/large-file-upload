import { io } from "socket.io-client";

const SERVER = "http://localhost:8000";
let socket = null;

export const connectWithSocketServer = () => {
    // socket = io(SERVER);

    socket.on("connect", () => {
        console.log(socket.id);
    });
};
