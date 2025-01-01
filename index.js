import express from "express";
import "dotenv/config";
import colors from "colors";
import userRouter from "./routes/user.route.js";
import postRouter from "./routes/post.route.js";
import commentRouter from "./routes/comment.route.js";
import webhookRouter from "./routes/webhook.route.js";
import morgan from "morgan";
import connectDB from "./libraries/connectDB.js";
import { clerkMiddleware } from "@clerk/express";

const app = express();

app.use(clerkMiddleware());

// moving webhooks to resolve body-parser and express conflicts
app.use("/webhooks", webhookRouter);

// middlewars
app.use(express.json());

// PORT
const port = process.env.PORT || 3001;

// logger
app.use(morgan("dev"));

// routes
app.use("/users", userRouter);
app.use("/posts", postRouter);
app.use("/comments", commentRouter);

// app.get("/protect", (req, res) => {
//   const { userId } = req.auth;
//   if (!userId) {
//     return res.status(401).json({ success: false, message: "Not authorized" });
//   }
//   return res.status(200).json({ success: true, message: "Valid user" });
// });

// error handler
app.use((error, req, res, next) => {
  res.status(error.status || 500);

  res.json({
    success: false,
    message: error.message || "Something went wrong!",
    stack: error.stack,
  });
});

// server call
app.listen(port, () => {
  connectDB();
  console.log(`Server is running on ${port}`.bgWhite.italic.underline.bold);
});
