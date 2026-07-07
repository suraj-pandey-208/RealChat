import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/connectDb.js";
import authRouter from "./routes/authRoute.js";
import userRouter from "./routes/user.route.js";
import messageRouter from "./routes/message.route.js";

import cookieParser from "cookie-parser";
import cors from "cors";
import { app, server } from "./socket/socket.js";

dotenv.config();


app.use(
  cors({
    origin: "https://realchat-frontend-dtgn.onrender.com",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
connectDb();

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/message", messageRouter);

const port = process.env.PORT || 8000;

server.listen(port, () => {
  console.log(`Server running on ${port}`);
});
