import mongoose from "mongoose";

declare global {
  var mongooseCache: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

globalThis.mongooseCache = globalThis.mongooseCache || {
  conn: null,
  promise: null,
};

async function connectDB(): Promise<typeof mongoose> {
  if (globalThis.mongooseCache.conn) {
    return globalThis.mongooseCache.conn;
  }

  if (!globalThis.mongooseCache.promise) {
    const options = {
      bufferCommands: false,
    };
    const MONGODB_URI = process.env.MONGODB_URI;

    if (!MONGODB_URI) {
      throw new Error(" Please define the MONGODB_URI environment variable");
    }
    globalThis.mongooseCache.promise = mongoose.connect(
      MONGODB_URI as string,
      options
    );
  }

  try {
    globalThis.mongooseCache.conn = await globalThis.mongooseCache.promise;
    if (process.env.NODE_ENV !== "production") {
      console.log("MongoDB connected successfully");
    }
  } catch (error) {
    globalThis.mongooseCache.promise = null;
    console.error("MongoDB connection failed:", error);
    throw error;
  }

  return globalThis.mongooseCache.conn;
}

export const isConnected = (): boolean => {
  return mongoose.connection.readyState === 1;
};

export const disconnectDB = async (): Promise<void> => {
  if (globalThis.mongooseCache.conn) {
    await mongoose.disconnect();
    globalThis.mongooseCache.conn = null;
    globalThis.mongooseCache.promise = null;
    console.log("Disconnected from MongoDB");
  }
};

export default connectDB;
