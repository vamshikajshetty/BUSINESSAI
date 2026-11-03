import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { c as useStore, o as setState, r as daysUntil, t as REQUIRED_DOCS } from "./store-rMlowXs6.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { a as Trash2, h as Landmark, l as MessageSquare, s as Send } from "../_libs/lucide-react.mjs";
import { r as PageHeader, t as Empty } from "./kit-DgXifPdr.mjs";
import { t as Button } from "./button-CQ5MMju4.mjs";
import { t as Textarea } from "./textarea-B6b4om4K.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/chat-OvGzgiRD.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var SOURCES = "Official sources to verify: Dubai DET (det.gov.ae), Dubai Land Department / Ejari (dubailand.gov.ae), Dubai Development Authority (dda.gov.ae), UAE Federal Tax Authority (tax.gov.ae).";
function mockReply(history, c) {
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
var _jsxFileName = "C:/Users/HP/Downloads/mizan-ui/mizan/src/routes/_app/chat.tsx?tsr-split=component";
var SUGGEST = [
	"When does my trade licence expire?",
	"Which documents am I missing?",
	"What deadlines are coming up?"
];
function Chat() {
	const s = useStore((x) => x);
	const [input, setInput] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const end = (0, import_react.useRef)(null);
	const box = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		end.current?.scrollIntoView({ behavior: "smooth" });
	}, [s.chat.length, busy]);
	(0, import_react.useEffect)(() => {
		box.current?.focus();
	}, [busy]);
	const send = (text) => {
		if (!text.trim() || busy) return;
		const history = [...s.chat, {
			role: "user",
			content: text.trim()
		}];
		setState(() => ({ chat: history }));
		setInput("");
		setBusy(true);
		setTimeout(() => {
			setState((st) => ({ chat: [...history, {
				role: "assistant",
				content: mockReply(history, st)
			}] }));
			setBusy(false);
		}, 600);
	};
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "flex h-[calc(100vh-4rem)] flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PageHeader, {
				title: "AI Assistant",
				sub: "Mock mode: connect the backend with a Groq key for real AI answers.",
				action: s.chat.length > 0 && /* @__PURE__ */ (void 0)(Button, {
					variant: "outline",
					size: "sm",
					onClick: () => setState(() => ({ chat: [] })),
					children: [/* @__PURE__ */ (void 0)(Trash2, { className: "h-4 w-4" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 47,
						columnNumber: 10
					}, this), " Clear"]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 45,
					columnNumber: 143
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 45,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "flex-1 space-y-4 overflow-y-auto rounded-xl border bg-card p-5",
				children: [
					s.chat.length === 0 && /* @__PURE__ */ (void 0)(Empty, {
						icon: MessageSquare,
						title: "Start a conversation",
						text: "Ask about your licence, documents, tasks or Dubai compliance.",
						action: /* @__PURE__ */ (void 0)("div", {
							className: "flex flex-wrap justify-center gap-2",
							children: SUGGEST.map((q) => /* @__PURE__ */ (void 0)(Button, {
								size: "sm",
								variant: "secondary",
								onClick: () => send(q),
								children: q
							}, q, false, {
								fileName: _jsxFileName,
								lineNumber: 49,
								columnNumber: 238
							}, this))
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 49,
							columnNumber: 167
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 49,
						columnNumber: 33
					}, this),
					s.chat.map((m, i) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: `flex gap-3 ${m.role === "user" ? "justify-end" : ""}`,
						children: [m.role === "assistant" && /* @__PURE__ */ (void 0)("div", {
							className: "h-8 w-8 shrink-0 rounded-full bg-accent/10 p-1.5 text-accent",
							children: /* @__PURE__ */ (void 0)(Landmark, { className: "h-5 w-5" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 51,
								columnNumber: 118
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 51,
							columnNumber: 40
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: `max-w-[75%] whitespace-pre-wrap text-sm leading-relaxed ${m.role === "user" ? "rounded-2xl rounded-br-sm bg-primary px-4 py-2.5 text-primary-foreground" : ""}`,
							children: m.content.replace(/\*\*/g, "")
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 52,
							columnNumber: 13
						}, this)]
					}, i, true, {
						fileName: _jsxFileName,
						lineNumber: 50,
						columnNumber: 31
					}, this)),
					busy && /* @__PURE__ */ (void 0)("p", {
						className: "animate-pulse text-xs text-muted-foreground",
						children: "Thinking…"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 56,
						columnNumber: 18
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { ref: end }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 57,
						columnNumber: 9
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 48,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("form", {
				onSubmit: (e) => {
					e.preventDefault();
					send(input);
				},
				className: "mt-3 flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Textarea, {
					ref: box,
					rows: 1,
					value: input,
					onChange: (e) => setInput(e.target.value),
					placeholder: "Ask a question…",
					className: "min-h-11 resize-none bg-card",
					onKeyDown: (e) => {
						if (e.key === "Enter" && !e.shiftKey) {
							e.preventDefault();
							send(input);
						}
					}
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 63,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
					type: "submit",
					size: "icon",
					className: "h-11 w-11 shrink-0 bg-accent text-accent-foreground hover:bg-accent/90",
					disabled: busy,
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Send, { className: "h-4 w-4" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 69,
						columnNumber: 142
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 69,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 59,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 44,
		columnNumber: 10
	}, this);
}
//#endregion
export { Chat as component };
