import { createFileRoute } from "@tanstack/react-router";
import { clearAuthCookie } from "@/lib/server/auth";

export const Route = createFileRoute("/api/auth/logout")({
  server: {
    handlers: {
      POST: async () => {
        return Response.json(
          { success: true, message: "Signed out successfully." },
          {
            headers: {
              "Set-Cookie": clearAuthCookie(),
            },
          },
        );
      },
    },
  },
});