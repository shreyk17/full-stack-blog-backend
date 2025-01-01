import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Mongo db is connected!".bgYellow.bold);
  } catch (error) {
    console.error(`${error}`.bgRed.bold);
  }
};

export default connectDB;
