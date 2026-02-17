import express from "express";
import { getAIAdvice, testAIConnection } from "../controllers/aiController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public test route (remove in production)
router.get("/test", testAIConnection);

// Protected AI chat route (requires login)
router.post("/chat", protect, getAIAdvice);

export default router;
