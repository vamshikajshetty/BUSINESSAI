
import { createFileRoute } from "@tanstack/react-router";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/server/db";
import { getUserIdFromRequest } from "@/lib/server/auth";

export const Route = createFileRoute("/api/deadlines/$id")({
  server: {
    handlers: {
      DELETE: async ({ request, params }) => {
        try {
          const userId = getUserIdFromRequest(request);
          const { id } = params;

          if (!userId || !ObjectId.isValid(userId)) {
            return Response.json(
              { success: false, message: "Unauthorized." },
              { status: 401 },
            );
          }

          if (!ObjectId.isValid(id)) {
            return Response.json(
              { success: false, message: "Invalid deadline ID." },
              { status: 400 },
            );
          }

          const db = await getDb();

          const result = await db.collection("deadlines").deleteOne({
            _id: new ObjectId(id),
            userId,
          });

          if (result.deletedCount === 0) {
            return Response.json(
              { success: false, message: "Deadline not found." },
              { status: 404 },
            );
          }

          return Response.json({
            success: true,
            message: "Deadline deleted successfully.",
          });
        } catch (error) {
          console.error("Delete deadline error:", error);

          return Response.json(
            { success: false, message: "Unable to delete deadline." },
            { status: 500 },
          );
        }
      },
    },
  },
});
