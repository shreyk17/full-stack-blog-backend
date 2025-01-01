import express from "express";
import { clerkWebhook } from "../controllers/webhook.contoller.js";

const router = express.Router();

router.post("/clerk", clerkWebhook);

export default router;
