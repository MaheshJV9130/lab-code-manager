import mongoose from "mongoose";

const connectDatabase = async () => {
  const mongoUri = process.env.DB_URL || process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("Missing DB_URL environment variable for MongoDB connection.");
  }

  if (mongoose.connection.readyState >= 1) {
    return;
  }

  await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 10000,
  });
};

export default connectDatabase;