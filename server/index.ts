import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import router from "./routes/index";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import path from "path";

/* ========== MIDDLEWARE ========== */
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(morgan("dev"));
app.use(cookieParser());

/* ========== SOCKET.IO ============ */
const http = createServer(app);
export const io = new Server(http);
import { SocketServer } from "./config/socket";
io.on("connection", (socket: Socket) => SocketServer(socket));

/* ========== ROUTES ========== */
app.use("/api", router);

/* ========== DATABASE ========== */
import "./config/database";

/* ========== PRODUCTION ========== */
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client", "build", "index.html"));
  });
}

/* ========== LISTENNING ========== */
const PORT = process.env.PORT || 5000;
http.listen(`${PORT}`, () => {
  console.log("Server is running on PORT", PORT);
});
