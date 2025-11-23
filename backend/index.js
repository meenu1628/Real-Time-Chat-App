import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { connectToMongoDB } from "./src/config/db.js";
import authRoutes from "./src/routes/authRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import rooms from "./src/routes/rooms.js";
import messages from "./src/routes/messages.js";
import cookieParser from "cookie-parser";
import setupSocket from "./src/socket/index.js";
import authorizer from "./src/middlewares/authorizer.js";
dotenv.config();

const app = express();
const server = http.createServer(app);
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173", 
  credentials: true,              
}));
app.use(express.json());
app.use(cookieParser());


app.use("/api/auth", authRoutes);
app.use("/api/users",authorizer, userRoutes);
app.use("/api/rooms",authorizer, rooms);
app.use("/api/messages",authorizer,messages);
// app.use("/api/groups", authorizer,groups);

setupSocket(server);
server.listen(process.env.PORT||3000, () => {
  connectToMongoDB();
  console.log("Server running at http://localhost:3000");
});
