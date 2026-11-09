import express from "express";
import authController from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const response = await authController.register(req.body);
    res.status(response.status).json({ data: response.data, message: response.message });
  } catch (error) {
    res.status(500).json({ data: null, message: error.message });
  }
});

export default router;
