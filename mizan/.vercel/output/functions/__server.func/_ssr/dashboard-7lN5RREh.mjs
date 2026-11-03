import { c as useStore, r as daysUntil, t as REQUIRED_DOCS } from "./store-rMlowXs6.mjs";
import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { T as CalendarClock, _ as History, b as FileExclamationPoint, g as Hourglass, o as ShieldCheck, p as ListChecks } from "../_libs/lucide-react.mjs";
import { a as Stat, i as Panel, r as PageHeader, t as Empty } from "./kit-DgXifPdr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard-7lN5RREh.js
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "C:/Users/HP/Downloads/mizan-ui/mizan/src/routes/_app/dashboard.tsx?tsr-split=component";
function Dashboard() {
	const { user, docs, tasks, deadlines, approvals, activity } = useStore((s) => s);
	const have = new Set(docs.map((d) => d.category));
	const missing = REQUIRED_DOCS.filter((r) => !have.has(r));
	const upcoming = deadlines.filter((d) => daysUntil(d.date) >= 0 && daysUntil(d.date) <= 90).sort((a, b) => a.date.localeCompare(b.date));
	const overdue = deadlines.filter((d) => daysUntil(d.date) < 0).length;
	const active = tasks.filter((t) => t.status !== "Done");
	const pending = approvals.filter((a) => a.status === "Pending");
	const score = Math.max(0, Math.round((REQUIRED_DOCS.length - missing.length) / REQUIRED_DOCS.length * 100 - overdue * 15));
	const done = tasks.filter((t) => t.status === "Done").length;
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PageHeader, {
			title: `Good day, ${user?.name.split(" ")[0]}`,
			sub: "Everything below is calculated from your own data."
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 23,
			columnNumber: 7
		}, this),
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Stat, {
					icon: ShieldCheck,
					label: "Compliance score",
					value: `${score}%`
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 25,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Stat, {
					icon: CalendarClock,
					label: "Renewals in 90 days",
					value: upcoming.length,
					tone: "warning"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 26,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Stat, {
					icon: FileExclamationPoint,
					label: "Missing documents",
					value: missing.length,
					tone: "destructive"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 27,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Stat, {
					icon: ListChecks,
					label: "Active tasks",
					value: active.length,
					tone: "primary"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 28,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Stat, {
					icon: Hourglass,
					label: "Pending approvals",
					value: pending.length,
					tone: "warning"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 29,
					columnNumber: 9
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 24,
			columnNumber: 7
		}, this),
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "mt-6 grid gap-6 lg:grid-cols-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Panel, {
					title: "Upcoming renewals",
					className: "lg:col-span-2",
					children: upcoming.length === 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Empty, {
						icon: CalendarClock,
						title: "Nothing due in the next 90 days",
						text: "Add deadlines in the calendar or upload documents with expiry dates."
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 33,
						columnNumber: 36
					}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("ul", {
						className: "divide-y",
						children: upcoming.map((d) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", {
							className: "flex items-center justify-between py-3 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "font-medium",
								children: d.title
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 35,
								columnNumber: 24
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "text-xs text-muted-foreground",
								children: d.type
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 35,
								columnNumber: 64
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 35,
								columnNumber: 19
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: `rounded-full px-2.5 py-1 text-xs font-medium ${daysUntil(d.date) <= 30 ? "bg-destructive/10 text-destructive" : "bg-warning/15 text-warning"}`,
								children: [daysUntil(d.date), " days"]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 36,
								columnNumber: 19
							}, this)]
						}, d.id, true, {
							fileName: _jsxFileName,
							lineNumber: 34,
							columnNumber: 34
						}, this))
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 33,
						columnNumber: 185
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 32,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Panel, {
					title: "Missing documents",
					children: missing.length === 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "text-sm text-success",
						children: "All core documents uploaded."
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 43,
						columnNumber: 35
					}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("ul", {
						className: "space-y-2 text-sm",
						children: [missing.map((m) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(FileExclamationPoint, { className: "h-4 w-4 text-destructive" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 44,
								columnNumber: 81
							}, this), m]
						}, m, true, {
							fileName: _jsxFileName,
							lineNumber: 44,
							columnNumber: 33
						}, this)), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
							to: "/documents",
							className: "text-xs font-medium text-accent hover:underline",
							children: "Upload documents →"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 45,
							columnNumber: 19
						}, this) }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 45,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 43,
						columnNumber: 106
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 42,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Panel, {
					title: "Task progress",
					children: tasks.length === 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "text-sm text-muted-foreground",
						children: "No tasks yet."
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 49,
						columnNumber: 33
					}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "h-2 overflow-hidden rounded-full bg-muted",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "h-full bg-accent",
							style: { width: `${done / tasks.length * 100}%` }
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 50,
							columnNumber: 74
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 50,
						columnNumber: 15
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "mt-2 text-xs text-muted-foreground",
						children: [
							done,
							" of ",
							tasks.length,
							" completed"
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 53,
						columnNumber: 15
					}, this)] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 49,
						columnNumber: 98
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 48,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Panel, {
					title: "Recent activity",
					className: "lg:col-span-2",
					children: activity.length === 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Empty, {
						icon: History,
						title: "No activity yet",
						text: "Actions you and the agent take appear here."
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 57,
						columnNumber: 36
					}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("ul", {
						className: "space-y-2 text-sm",
						children: activity.slice(0, 6).map((a) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", {
							className: "flex justify-between gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("b", {
									className: "font-medium",
									children: [a.actor, ":"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 58,
									columnNumber: 106
								}, this),
								" ",
								a.text
							] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 58,
								columnNumber: 100
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "shrink-0 text-xs text-muted-foreground",
								children: new Date(a.at).toLocaleString()
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 58,
								columnNumber: 163
							}, this)]
						}, a.id, true, {
							fileName: _jsxFileName,
							lineNumber: 58,
							columnNumber: 46
						}, this))
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 57,
						columnNumber: 138
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 56,
					columnNumber: 9
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 31,
			columnNumber: 7
		}, this)
	] }, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 22,
		columnNumber: 10
	}, this);
}
//#endregion
export { Dashboard as component };
