import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { c as useStore, i as log, o as setState, r as daysUntil, s as uid } from "./store-rMlowXs6.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { a as Trash2, c as Plus, w as CalendarDays } from "../_libs/lucide-react.mjs";
import { i as Panel, n as Field, r as PageHeader, t as Empty } from "./kit-DgXifPdr.mjs";
import { t as Button } from "./button-CQ5MMju4.mjs";
import { t as Input } from "./input-yeZ7xuTF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/calendar-Dwk7iSoo.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "C:/Users/HP/Downloads/mizan-ui/mizan/src/routes/_app/calendar.tsx?tsr-split=component";
var TYPES = [
	"Trade Licence",
	"Ejari",
	"Visa",
	"Employee Permit",
	"Tax",
	"Other"
];
function Calendar() {
	const deadlines = useStore((s) => s.deadlines);
	const [f, setF] = (0, import_react.useState)({
		title: "",
		type: TYPES[0],
		date: ""
	});
	const sorted = [...deadlines].sort((a, b) => a.date.localeCompare(b.date));
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PageHeader, {
		title: "Compliance Calendar",
		sub: "Dates come from your onboarding, uploaded documents and entries you add."
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 17,
		columnNumber: 7
	}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "grid gap-6 lg:grid-cols-3",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Panel, {
			title: "Add deadline",
			children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("form", {
				className: "space-y-3",
				onSubmit: (e) => {
					e.preventDefault();
					setState((s) => ({ deadlines: [...s.deadlines, {
						id: uid(),
						...f
					}] }));
					log("User", `Added deadline "${f.title}" on ${f.date}`);
					setF({
						title: "",
						type: TYPES[0],
						date: ""
					});
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Field, {
						label: "Title",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
							required: true,
							value: f.title,
							onChange: (e) => setF({
								...f,
								title: e.target.value
							})
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 35,
							columnNumber: 34
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 35,
						columnNumber: 13
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Field, {
						label: "Type",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("select", {
							className: "h-9 w-full rounded-md border bg-card px-3 text-sm",
							value: f.type,
							onChange: (e) => setF({
								...f,
								type: e.target.value
							}),
							children: TYPES.map((t) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", { children: t }, t, false, {
								fileName: _jsxFileName,
								lineNumber: 43,
								columnNumber: 33
							}, this))
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 40,
							columnNumber: 15
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 39,
						columnNumber: 13
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Field, {
						label: "Date",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
							type: "date",
							required: true,
							value: f.date,
							onChange: (e) => setF({
								...f,
								date: e.target.value
							})
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 45,
							columnNumber: 33
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 45,
						columnNumber: 13
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
						type: "submit",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Plus, { className: "h-4 w-4" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 49,
							columnNumber: 35
						}, this), " Add"]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 49,
						columnNumber: 13
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 20,
				columnNumber: 11
			}, this)
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 19,
			columnNumber: 9
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Panel, {
			title: "Timeline",
			className: "lg:col-span-2",
			children: sorted.length === 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Empty, {
				icon: CalendarDays,
				title: "No deadlines",
				text: "Add your first compliance deadline."
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 53,
				columnNumber: 34
			}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("ol", {
				className: "relative space-y-4 border-l pl-6",
				children: sorted.map((d) => {
					const n = daysUntil(d.date);
					return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", {
						className: "relative",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: `absolute -left-[29px] top-1.5 h-3 w-3 rounded-full ${n < 0 ? "bg-destructive" : n <= 30 ? "bg-warning" : "bg-accent"}` }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 57,
							columnNumber: 21
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex items-start justify-between gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "text-sm font-medium",
								children: d.title
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 60,
								columnNumber: 25
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "text-xs text-muted-foreground",
								children: [
									d.type,
									" · ",
									new Date(d.date).toLocaleDateString(void 0, { dateStyle: "medium" }),
									" · ",
									n < 0 ? `${-n} days overdue` : `in ${n} days`
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 61,
								columnNumber: 25
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 59,
								columnNumber: 23
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
								size: "icon",
								variant: "ghost",
								onClick: () => setState((s) => ({ deadlines: s.deadlines.filter((x) => x.id !== d.id) })),
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Trash2, { className: "h-4 w-4" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 67,
									columnNumber: 22
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 65,
								columnNumber: 23
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 58,
							columnNumber: 21
						}, this)]
					}, d.id, true, {
						fileName: _jsxFileName,
						lineNumber: 56,
						columnNumber: 20
					}, this);
				})
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 53,
				columnNumber: 130
			}, this)
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 52,
			columnNumber: 9
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 18,
		columnNumber: 7
	}, this)] }, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 16,
		columnNumber: 10
	}, this);
}
//#endregion
export { Calendar as component };
