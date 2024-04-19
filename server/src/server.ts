require("express-async-errors");
import express from "express";
import videoRoutes from "./routes/index";
import cors from "cors";
import { NotFound } from "./middlewares/notFound";
import { Server } from "socket.io";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", videoRoutes);
app.use(NotFound);

const expressServer = app.listen(8000, () => {
    console.log("server started on port 8000...");
});

// TODO - Try to send videoStream over UDP
const io = new Server(expressServer, {
    cors: {
        origin: "http://localhost:5173",
    },
});

io.on("connection", (socket) => {
    console.log("Client connected: " + socket.id);

    const udpServer = require("dgram").createSocket("udp4");

    udpServer.on("message", (msg: any) => {
        io.emit("stream", msg);
    });

    udpServer.bind(1234);
});
