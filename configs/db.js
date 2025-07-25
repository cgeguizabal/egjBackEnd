import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

let cached = global.mongoose; // mongoose is the object that I create in cache

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) {
    console.log("Returning cached connection:", cached.conn);
    return cached.conn; // if the connection object exists in cache I return it back
  }

  if (!cached.promise) {
    // if it doesn't exist a prior connection object in cache, meaning if there's not connection object in cached(global.mongoose)
    mongoose.set("strictQuery", true);
    cached.promise = mongoose.connect(MONGODB_URI);
    /*
     {
      bufferCommands: false, //If the DB disconnects, Mongoose won't queue commands until reconnected.
      useNewUrlParser: true, // Use the modern MongoDB connection string parser.
      useUnifiedTopology: true, //Use MongoDB’s new connection management engine (better monitoring
   } */
  }

  cached.conn = await cached.promise; // I set conn value until the promise is resolved

  console.log(
    "Connected successfully to MongoDB database:",
    mongoose.connection.db.databaseName
  );
  //   console.log("Cached object:", cached);

  return cached.conn;
}
