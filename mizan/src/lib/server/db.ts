import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME || "business_ai";

if (!uri) {
  throw new Error("MONGODB_URI is missing");
}

const globalForMongo = globalThis as typeof globalThis & {
  mongoClientPromise?: Promise<MongoClient>;
};

const clientPromise =
  globalForMongo.mongoClientPromise ??
  (globalForMongo.mongoClientPromise = new MongoClient(uri).connect());

export async function getDb() {
  const client = await clientPromise;
  return client.db(dbName);
}