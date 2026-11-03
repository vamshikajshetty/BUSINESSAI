import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { c as useStore, i as log, o as setState, s as uid } from "./store-rMlowXs6.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { a as Trash2, c as Plus, p as ListChecks } from "../_libs/lucide-react.mjs";
import { i as Panel, r as PageHeader, t as Empty } from "./kit-DgXifPdr.mjs";
import { t as Button } from "./button-CQ5MMju4.mjs";
import { t as Input } from "./input-yeZ7xuTF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tasks-Dhi8YTTK.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "C:/Users/HP/Downloads/mizan-ui/mizan/src/routes/_app/tasks.tsx?tsr-split=component";
var STATUSES = [
	"To do",
	"In progress",
	"Done"
];
var PRI = [
	"Low",
	"Medium",
	"High"
];
var priTone = {
	High: "bg-destructive/10 text-destructive",
	Medium: "bg-warning/15 text-warning",
	Low: "bg-muted text-muted-foreground"
};
var sel = "h-9 rounded-md border bg-card px-2 text-sm";
function Tasks() {
	const { tasks, user } = useStore((s) => s);
	const [f, setF] = (0, import_react.useState)({
		title: "",
		assignee: "",
		priority: "Medium",
		due: ""
	});
	const upd = (id, p) => setState((s) => ({ tasks: s.tasks.map((t) => t.id === id ? {
		...t,
		...p
	} : t) }));
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PageHeader, { title: "Tasks" }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 33,
			columnNumber: 7
		}, this),
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Panel, {
			className: "mb-6",
			children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("form", {
				className: "flex flex-wrap gap-2",
				onSubmit: (e) => {
					e.preventDefault();
					setState((s) => ({ tasks: [{
						id: uid(),
						title: f.title,
						assignee: f.assignee || user.name,
						priority: f.priority,
						status: "To do",
						...f.due ? { due: f.due } : {}
					}, ...s.tasks] }));
					log("User", `Created task "${f.title}"`);
					setF({
						...f,
						title: "",
						due: ""
					});
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
						required: true,
						placeholder: "Task title",
						className: "min-w-56 flex-1",
						value: f.title,
						onChange: (e) => setF({
							...f,
							title: e.target.value
						})
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 56,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
						placeholder: "Assignee",
						className: "w-40",
						value: f.assignee,
						onChange: (e) => setF({
							...f,
							assignee: e.target.value
						})
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 60,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("select", {
						className: sel,
						value: f.priority,
						onChange: (e) => setF({
							...f,
							priority: e.target.value
						}),
						children: PRI.map((p) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", { children: p }, p, false, {
							fileName: _jsxFileName,
							lineNumber: 67,
							columnNumber: 27
						}, this))
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 64,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
						type: "date",
						className: "w-40",
						value: f.due,
						onChange: (e) => setF({
							...f,
							due: e.target.value
						})
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 68,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
						type: "submit",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Plus, { className: "h-4 w-4" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 72,
							columnNumber: 33
						}, this), " Add"]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 72,
						columnNumber: 11
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 35,
				columnNumber: 9
			}, this)
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 34,
			columnNumber: 7
		}, this),
		tasks.length === 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Empty, {
			icon: ListChecks,
			title: "No tasks yet",
			text: "Create a task above or let the agent generate them."
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 75,
			columnNumber: 29
		}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "grid gap-4 md:grid-cols-3",
			children: STATUSES.map((st) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "rounded-xl bg-muted/60 p-3",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "mb-3 px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground",
					children: [
						st,
						" · ",
						tasks.filter((t) => t.status === st).length
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 77,
					columnNumber: 15
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "space-y-2",
					children: tasks.filter((t) => t.status === st).map((t) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "rounded-lg border bg-card p-3 shadow-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex items-start justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
									className: `text-sm font-medium ${t.status === "Done" ? "text-muted-foreground line-through" : ""}`,
									children: t.title
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 81,
									columnNumber: 23
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
									onClick: () => setState((s) => ({ tasks: s.tasks.filter((x) => x.id !== t.id) })),
									"aria-label": "Delete",
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Trash2, { className: "h-3.5 w-3.5 text-muted-foreground" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 84,
										columnNumber: 40
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 82,
									columnNumber: 23
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 80,
								columnNumber: 21
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: [t.assignee, t.due && ` · due ${t.due}`]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 86,
								columnNumber: 21
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "mt-2 flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: `rounded px-2 py-0.5 text-[11px] font-medium ${priTone[t.priority]}`,
									children: t.priority
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 88,
									columnNumber: 23
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("select", {
									className: "ml-auto rounded border bg-card px-1 py-0.5 text-xs",
									value: t.status,
									onChange: (e) => {
										upd(t.id, { status: e.target.value });
										log("User", `Moved "${t.title}" to ${e.target.value}`);
									},
									children: STATUSES.map((x) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", { children: x }, x, false, {
										fileName: _jsxFileName,
										lineNumber: 95,
										columnNumber: 44
									}, this))
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 89,
									columnNumber: 23
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 87,
								columnNumber: 21
							}, this)
						]
					}, t.id, true, {
						fileName: _jsxFileName,
						lineNumber: 79,
						columnNumber: 62
					}, this))
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 78,
					columnNumber: 15
				}, this)]
			}, st, true, {
				fileName: _jsxFileName,
				lineNumber: 76,
				columnNumber: 31
			}, this))
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 75,
			columnNumber: 139
		}, this)
	] }, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 32,
		columnNumber: 10
	}, this);
}
//#endregion
export { Tasks as component };
