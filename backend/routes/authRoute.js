import express from "express";
import { login, logout, signup } from "../controllers/authController.js";

const router = express.Router();

console.log("Auth routes loaded");

router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logout);

router.get("/test", (req, res) => {
  res.send("working");
});

export default router;