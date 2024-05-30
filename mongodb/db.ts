import mongoose from "mongoose";

const connectionString = `mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@linkedin-clone-nextjs.mongocluster.cosmos.azure.com/?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000`;

if (!connectionString) {
  throw new Error("Provide a valid connection string");
}

// connect to database
const connectDB = async () => {
  // check if already connected
  if (mongoose.connection?.readyState >= 1) {
    return;
  }

  try {
    console.log("======= Connecting to MongoDB =========");
    await mongoose.connect(connectionString);
  } catch (error) {
    console.log("Error connecting to MongoDB: ", error);
  }
};

export default connectDB;
