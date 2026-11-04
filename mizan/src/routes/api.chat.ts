
import { createFileRoute } from "@tanstack/react-router";
import { ObjectId } from "mongodb";
import Groq from "groq-sdk";
import { getDb } from "@/lib/server/db";
import { getUserIdFromRequest } from "@/lib/server/auth";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const globalForGroq = globalThis as typeof globalThis & {
  groqClient?: Groq;
};

function getGroq() {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    throw new Error("GROQ_API_KEY is missing from environment variables.");
  }

  if (!globalForGroq.groqClient) {
    globalForGroq.groqClient = new Groq({ apiKey });
  }

  return globalForGroq.groqClient;
}

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          // Authenticate the user
          const userId = getUserIdFromRequest(request);

          if (!userId || !ObjectId.isValid(userId)) {
            return Response.json(
              { success: false, message: "Unauthorized." },
              { status: 401 },
            );
          }

          // Validate conversation
          const body = await request.json();

          const messages = body.messages;

          if (!Array.isArray(messages) || messages.length === 0) {
            return Response.json(
              { success: false, message: "A conversation is required." },
              { status: 400 },
            );
          }

          const validMessages: ChatMessage[] = messages
            .slice(-20)
            .filter(
              (message: any) =>
                ["user", "assistant"].includes(message?.role) &&
                typeof message?.content === "string" &&
                message.content.trim().length > 0,
            )
            .map((message: any) => ({
              role: message.role,
              content: message.content.trim().slice(0, 4000),
            }));

          if (
            validMessages.length === 0 ||
            validMessages[validMessages.length - 1]?.role !== "user"
          ) {
            return Response.json(
              { success: false, message: "Invalid user message." },
              { status: 400 },
            );
          }

          // Retrieve authenticated user's business context
          const db = await getDb();

          const [business, documents, deadlines, tasks] =
            await Promise.all([
              db.collection("businesses").findOne({ userId }),

              db.collection("documents")
                .find({ userId })
                .sort({ uploadedAt: -1 })
                .limit(50)
                .toArray(),

              db.collection("deadlines")
                .find({ userId })
                .sort({ date: 1 })
                .limit(50)
                .toArray(),

              db.collection("tasks")
                .find({ userId })
                .sort({ createdAt: -1 })
                .limit(50)
                .toArray(),
            ]);

          const businessContext = {
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

            documents: documents.map((doc) => ({
              name: doc.name,
              category: doc.category,
              issueDate: doc.issueDate,
              expiry: doc.expiry ?? doc.expiryDate,
              uploadedAt: doc.uploadedAt,
            })),

            deadlines: deadlines.map((deadline) => ({
              title: deadline.title,
              type: deadline.type,
              date: deadline.date,
            })),

            tasks: tasks.map((task) => ({
              title: task.title,
              assignee: task.assignee,
              priority: task.priority,
              status: task.status,
              due: task.due,
            })),
          };

          const systemPrompt = `
You are Mizan, an intelligent Dubai SME business and compliance assistant.

You help business owners understand their business records, compliance obligations,
documents, deadlines, licences, VAT, UAE Corporate Tax, employee permits and
business operations.

CURRENT DATE:
${new Date().toLocaleDateString("en-CA", {
  timeZone: "Asia/Dubai",
})}

AUTHENTICATED BUSINESS CONTEXT:
${JSON.stringify(businessContext, null, 2)}



You are Mizan, a professional and friendly AI business assistant
for Dubai SMEs.

PERSONALITY:
- Sound like a knowledgeable human business advisor.
- Be natural, clear, professional and conversational.
- Answer the actual question directly.
- Avoid robotic, repetitive or unnecessarily formal language.

RESPONSE LENGTH:
- Simple questions: 2–4 sentences.
- Specific record questions: concise answer with relevant dates and details.
- Complex questions: structured explanation with practical next steps.
- Do not repeat the same information in multiple sections.
- Never generate unnecessarily long responses.

FORMATTING:
- Use short paragraphs.
- Use bullet points for multiple items.
- Use headings only when they improve readability.
- Use bold sparingly for important dates, figures and decisions.
- Avoid Markdown tables unless a comparison genuinely requires one.
- Never use decorative stars, excessive symbols or emoji.
- Do not output raw Markdown syntax unnecessarily.
- Keep lists concise and properly spaced.

ACCURACY:
- Use authenticated business context as the source of business-specific facts.
- Never invent business records, expiry dates or deadlines.
- Distinguish database information from general regulatory guidance.
- Never assume two records represent separate licences without evidence.
- Clearly explain uncertainty or conflicting records.
- Never invent government fees, penalties or legal requirements.
- Do not claim to have completed external actions.
- Recommend official verification for regulatory matters.

ACTIONABLE ANSWERS:
- Give the direct answer first.
- Explain what it means.
- Provide practical next steps only when useful.
- Never overwhelm the user with unnecessary information.

Your objective is to make every response easy for a business owner
to understand and act upon.

`;
          // Generate a real Groq response
          const groq = getGroq();

          const completion = await groq.chat.completions.create({
            model: process.env.GROQ_MODEL || "openai/gpt-oss-120b",

            messages: [
              {
                role: "system",
                content: systemPrompt,
              },
              ...validMessages,
            ],

            temperature: 0.3,
            max_completion_tokens: 1500,
          });

          const reply =
            completion.choices[0]?.message?.content;

          if (!reply || typeof reply !== "string") {
            throw new Error("Groq returned an empty response.");
          }

          return Response.json({
            success: true,
            reply,
            model: completion.model,
          });
        } catch (error) {
          console.error("AI chat error:", error);

          return Response.json(
            {
              success: false,
              message:
                "The AI assistant is temporarily unavailable. Please try again.",
            },
            { status: 500 },
          );
        }
      },
    },
  },
});
