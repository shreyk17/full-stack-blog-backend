import express from "express";
import { clerkWebhook } from "../controllers/webhook.contoller.js";
import bodyParser from "body-parser";

const router = express.Router();

router.post(
  "/clerk",
  bodyParser.raw({ type: "application/json" }),
  clerkWebhook
);

export default router;
