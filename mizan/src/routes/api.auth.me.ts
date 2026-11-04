import { createFileRoute } from "@tanstack/react-router";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/server/db";
import { getUserIdFromRequest } from "@/lib/server/auth";

export const Route = createFileRoute("/api/auth/me")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const userId = getUserIdFromRequest(request);

          if (!userId || !ObjectId.isValid(userId)) {
            return Response.json(
              { success: false, message: "Not authenticated." },
              { status: 401 },
            );
          }

          const db = await getDb();

          const user = await db.collection("users").findOne({
            _id: new ObjectId(userId),
          });

          if (!user) {
            return Response.json(
              { success: false, message: "User not found." },
              { status: 401 },
            );
          }

          const business = await db.collection("businesses").findOne({
            userId,
          });

          return Response.json({
            success: true,
            user: {
              id: user._id.toString(),
              name: user.name,
              email: user.email,
            },
            business: business
              ? {
                  name: business.name,
                  activity: business.activity,
                  location: business.location,
                  authority: business.authority,
                  licenceNo: business.licenceNo,
                  licenceExpiry: business.licenceExpiry,
                  employees: business.employees,
                }
              : null,
          });
        } catch (error) {
          console.error("Session verification error:", error);

          return Response.json(
            { success: false, message: "Unable to verify session." },
            { status: 500 },
          );
        }
      },
    },
  },
});