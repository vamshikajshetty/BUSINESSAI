import { daysUntil, REQUIRED_DOCS, type ChatMsg } from "./store";

// MOCK MODE: replies are built only from the user's own stored data.
// When the backend runs, replace `mockReply` with a fetch to POST /api/chat
// (Express → Groq). The Groq key stays on the server.
type Ctx = {
  business: { name: string; licenceExpiry: string; authority: string } | null;
  docs: { name: string; category: string; expiry?: string }[];
  deadlines: { title: string; date: string }[];
  tasks: { title: string; status: string }[];
};

const SOURCES =
  "Official sources to verify: Dubai DET (det.gov.ae), Dubai Land Department / Ejari (dubailand.gov.ae), Dubai Development Authority (dda.gov.ae), UAE Federal Tax Authority (tax.gov.ae).";

export function mockReply(history: ChatMsg[], c: Ctx): string {
  const q = (history[history.length - 1]?.content ?? "").toLowerCase();
  const tag = "**[Mock mode — not AI-generated]**\n\n";
  if (/(licen|renew|expir)/.test(q) && c.business) {
    const d = daysUntil(c.business.licenceExpiry);
    return `${tag}**From your data:** ${c.business.name}'s trade licence (${c.business.authority}) expires on ${c.business.licenceExpiry} — ${d >= 0 ? `${d} days from today` : `${-d} days ago`}.\n\n**Not verified:** renewal fees and required documents vary by authority and activity. ${SOURCES}`;
  }
  if (/(document|missing|upload)/.test(q)) {
    const have = new Set(c.docs.map((x) => x.category));
    const missing = REQUIRED_DOCS.filter((r) => !have.has(r));
    return `${tag}**From your data:** you have ${c.docs.length} document(s) uploaded. ${missing.length ? `Missing core categories: ${missing.join(", ")}.` : "All core categories are present."}`;
  }
  if (/(task|todo)/.test(q)) {
    const open = c.tasks.filter((t) => t.status !== "Done");
    return `${tag}**From your data:** ${open.length} open task(s)${open.length ? ": " + open.map((t) => t.title).join(", ") : ""}.`;
  }
  if (/(deadline|calendar|due)/.test(q)) {
    const up = [...c.deadlines].sort((a, b) => a.date.localeCompare(b.date)).slice(0, 5);
    return `${tag}**From your data:** ${up.length ? up.map((d) => `${d.title} — ${d.date}`).join("; ") : "no deadlines recorded yet"}.`;
  }
  return `${tag}I can answer from your stored licence, documents, tasks and deadlines in mock mode. General and regulatory answers need the Groq-powered backend.\n\n${SOURCES}`;
}
