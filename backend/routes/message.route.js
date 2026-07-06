import express from "express";
import isAuth from "../middlewares/isAuth.js";
import upload from "../middlewares/multer.js";
import {
  sendMessage,
  getMessage,
} from "../controllers/message.controller.js";

const messageRouter = express.Router();

messageRouter.post(
  "/send/:receiver",
  isAuth,
  upload.single("image"),
  sendMessage
);

messageRouter.get("/:receiver", isAuth, getMessage);

export default messageRouter;