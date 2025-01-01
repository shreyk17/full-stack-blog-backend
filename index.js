import express from "express";
import "dotenv/config";
import colors from "colors";
import userRouter from "./routes/user.route.js";
import postRouter from "./routes/post.route.js";
import commentRouter from "./routes/comment.route.js";
import webhookRouter from "./routes/webhook.route.js";
import morgan from "morgan";
import connectDB from "./libraries/connectDB.js";

const app = express();

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
app.use("/webhooks", webhookRouter);

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
