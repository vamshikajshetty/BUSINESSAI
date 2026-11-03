import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { c as useStore, i as log, o as setState, r as daysUntil, s as uid, t as REQUIRED_DOCS } from "./store-rMlowXs6.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { C as Check, D as Bot, S as CircleCheck, f as LoaderCircle, n as Wrench, t as X } from "../_libs/lucide-react.mjs";
import { i as Panel, r as PageHeader, t as Empty } from "./kit-DgXifPdr.mjs";
import { t as Button } from "./button-CQ5MMju4.mjs";
import { t as Textarea } from "./textarea-B6b4om4K.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/agent-BtI249Ew.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "C:/Users/HP/Downloads/mizan-ui/mizan/src/routes/_app/agent.tsx?tsr-split=component";
var STAGES = [
	"Understand",
	"Analyse",
	"Plan",
	"Use tools",
	"Take action",
	"Verify"
];
function Agent() {
	const s = useStore((x) => x);
	const [req, setReq] = (0, import_react.useState)("");
	const [stage, setStage] = (0, import_react.useState)(-1);
	const [steps, setSteps] = (0, import_react.useState)([]);
	const run = async () => {
		if (!req.trim()) return;
		const out = [];
		const push = async (i, st) => {
			setStage(i);
			if (st) {
				out.push(st);
				setSteps([...out]);
			}
			await new Promise((r) => setTimeout(r, 500));
		};
		setSteps([]);
		await push(0, {
			tool: "parse_request",
			detail: `"${req.trim()}"`
		});
		const have = new Set(s.docs.map((d) => d.category));
		const missing = REQUIRED_DOCS.filter((r) => !have.has(r));
		await push(1, {
			tool: "detect_missing_documents",
			detail: missing.length ? `Missing: ${missing.join(", ")}` : "None missing"
		});
		const soon = s.deadlines.filter((d) => daysUntil(d.date) <= 60);
		await push(1, {
			tool: "detect_expiry",
			detail: `${soon.length} deadline(s) within 60 days`
		});
		await push(2, {
			tool: "plan",
			detail: `Create ${missing.length + soon.length} task(s); draft a reminder email; request approval to send`
		});
		const newTasks = [...missing.map((m) => ({
			id: uid(),
			title: `Upload ${m}`,
			assignee: s.user?.name ?? "Me",
			priority: "High",
			status: "To do"
		})), ...soon.map((d) => ({
			id: uid(),
			title: `Prepare: ${d.title}`,
			assignee: s.user?.name ?? "Me",
			priority: "Medium",
			status: "To do",
			due: d.date
		}))];
		await push(3, {
			tool: "create_tasks",
			detail: `${newTasks.length} task(s) created`
		});
		await push(3, {
			tool: "draft_email",
			detail: "Drafted reminder to business owner (simulated)"
		});
		const approval = {
			id: uid(),
			action: "Send drafted compliance reminder email (SIMULATED)",
			status: "Pending"
		};
		setState((st) => ({
			tasks: [...newTasks, ...st.tasks],
			approvals: [approval, ...st.approvals]
		}));
		log("Agent", `Ran request "${req.trim()}" — created ${newTasks.length} task(s), requested 1 approval`);
		await push(4, {
			tool: "request_approval",
			detail: "Waiting for your approval below"
		});
		await push(5, {
			tool: "verify",
			detail: "Tasks and approval saved to your workspace"
		});
		setStage(6);
	};
	const decide = (id, status) => {
		setState((st) => ({ approvals: st.approvals.map((a) => a.id === id ? {
			...a,
			status
		} : a) }));
		const a = s.approvals.find((x) => x.id === id);
		log("User", `${status} "${a?.action}"`);
		if (status === "Approved") log("Agent", `Executed simulated action: ${a?.action}`);
	};
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PageHeader, {
		title: "Agent Workspace",
		sub: "Simulated actions only. Government submissions and payments always require your approval."
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 102,
		columnNumber: 7
	}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "grid gap-6 lg:grid-cols-3",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Panel, {
			title: "New request",
			className: "lg:col-span-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Textarea, {
					value: req,
					onChange: (e) => setReq(e.target.value),
					rows: 3,
					placeholder: "e.g. Check what I need for my licence renewal and create tasks"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 105,
					columnNumber: 11
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
					className: "mt-3",
					onClick: run,
					disabled: stage >= 0 && stage < 6,
					children: [stage >= 0 && stage < 6 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(LoaderCircle, { className: "h-4 w-4 animate-spin" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 107,
						columnNumber: 40
					}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Bot, { className: "h-4 w-4" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 107,
						columnNumber: 87
					}, this), " Run agent"]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 106,
					columnNumber: 11
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "mt-6 flex flex-wrap gap-2",
					children: STAGES.map((n, i) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
						className: `flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${stage > i ? "bg-success/15 text-success" : stage === i ? "bg-accent/15 text-accent" : "bg-muted text-muted-foreground"}`,
						children: [stage > i && /* @__PURE__ */ (void 0)(CircleCheck, { className: "h-3 w-3" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 111,
							columnNumber: 31
						}, this), n]
					}, n, true, {
						fileName: _jsxFileName,
						lineNumber: 110,
						columnNumber: 35
					}, this))
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 109,
					columnNumber: 11
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "mt-5 space-y-2",
					children: steps.map((st, i) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex gap-3 rounded-lg border bg-muted/40 px-3 py-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Wrench, { className: "mt-0.5 h-4 w-4 shrink-0 text-accent" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 116,
							columnNumber: 17
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("code", {
							className: "text-xs font-semibold",
							children: st.tool
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 117,
							columnNumber: 22
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "text-muted-foreground",
							children: st.detail
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 117,
							columnNumber: 78
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 117,
							columnNumber: 17
						}, this)]
					}, i, true, {
						fileName: _jsxFileName,
						lineNumber: 115,
						columnNumber: 35
					}, this))
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 114,
					columnNumber: 11
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 104,
			columnNumber: 9
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Panel, {
			title: "Approvals",
			children: s.approvals.length === 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Empty, {
				icon: Check,
				title: "No approvals",
				text: "Actions needing your sign-off appear here."
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 122,
				columnNumber: 39
			}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("ul", {
				className: "space-y-3",
				children: s.approvals.map((a) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", {
					className: "rounded-lg border p-3 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { children: a.action }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 124,
						columnNumber: 19
					}, this), a.status === "Pending" ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "mt-2 flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							size: "sm",
							onClick: () => decide(a.id, "Approved"),
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Check, { className: "h-3.5 w-3.5" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 126,
								columnNumber: 82
							}, this), " Approve"]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 126,
							columnNumber: 23
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							size: "sm",
							variant: "outline",
							onClick: () => decide(a.id, "Rejected"),
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(X, { className: "h-3.5 w-3.5" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 127,
								columnNumber: 100
							}, this), " Reject"]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 127,
							columnNumber: 23
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 125,
						columnNumber: 45
					}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: `mt-1 text-xs font-medium ${a.status === "Approved" ? "text-success" : "text-destructive"}`,
						children: a.status
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 128,
						columnNumber: 30
					}, this)]
				}, a.id, true, {
					fileName: _jsxFileName,
					lineNumber: 123,
					columnNumber: 37
				}, this))
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 122,
				columnNumber: 135
			}, this)
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 121,
			columnNumber: 9
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 103,
		columnNumber: 7
	}, this)] }, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 101,
		columnNumber: 10
	}, this);
}
//#endregion
export { Agent as component };
