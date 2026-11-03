import { createFileRoute } from "@tanstack/react-router";
import { getDb } from "@/lib/server/db";

export const Route = createFileRoute("/api/health")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const db = await getDb();
          await db.command({ ping: 1 });

          return Response.json({
            success: true,
            message: "MongoDB connected successfully",
            database: db.databaseName,
          });
        } catch (error) {
          console.error("MongoDB connection error:", error);

          return Response.json(
            {
              success: false,
              message: "MongoDB connection failed",
            },
            { status: 500 },
          );
        }
      },
    },
  },
});