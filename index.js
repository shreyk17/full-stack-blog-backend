import express from "express";
import "dotenv/config";
import colors from "colors";
import userRouter from "./routes/user.route.js";
import morgan from "morgan";

const app = express();

const port = process.env.PORT || 3001;

// logger
app.use(morgan("dev"));

// routes

app.use("/users", userRouter);

app.listen(port, () => {
  console.log(`Server is running on ${port}`.yellow.inverse.italic.bold);
});
