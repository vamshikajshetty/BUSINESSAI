
import { MongoClient } from "mongodb";
import dns from "node:dns";

const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME || "business_ai";

// Use reliable public DNS resolvers for MongoDB SRV lookups.
dns.setServers(["8.8.8.8", "1.1.1.1"]);

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
