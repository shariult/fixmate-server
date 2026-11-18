import { MongoClient } from "mongodb";
import dotEnv from "dotenv";

if (process.env.NODE_ENV === "dev") {
  dotEnv.config();
}

const client = new MongoClient(process.env.MONGODB_URI);
async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("You successfully connected to MongoDB!");
    return client;
  } catch (err) {
    console.dir(err);
  }
}
const mongoClient = await connectToMongoDB();
const db = mongoClient.db();
const user = db.collection("user");

export default { user };
