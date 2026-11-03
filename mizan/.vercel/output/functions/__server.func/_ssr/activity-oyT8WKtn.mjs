import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { c as useStore } from "./store-rMlowXs6.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { D as Bot, _ as History, r as User } from "../_libs/lucide-react.mjs";
import { i as Panel, r as PageHeader, t as Empty } from "./kit-DgXifPdr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/activity-oyT8WKtn.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "C:/Users/HP/Downloads/mizan-ui/mizan/src/routes/_app/activity.tsx?tsr-split=component";
function Activity() {
	const activity = useStore((s) => s.activity);
	const [who, setWho] = (0, import_react.useState)("All");
	const list = activity.filter((a) => who === "All" || a.actor === who);
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PageHeader, {
			title: "Activity Centre",
			sub: "Audit trail of everything you and the agent did."
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 10,
			columnNumber: 7
		}, this),
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "mb-4 flex gap-2",
			children: [
				"All",
				"User",
				"Agent"
			].map((w) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
				onClick: () => setWho(w),
				className: `rounded-full px-3 py-1 text-xs font-medium ${who === w ? "bg-primary text-primary-foreground" : "border bg-card text-muted-foreground"}`,
				children: w
			}, w, false, {
				fileName: _jsxFileName,
				lineNumber: 12,
				columnNumber: 55
			}, this))
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 11,
			columnNumber: 7
		}, this),
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Panel, { children: list.length === 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Empty, {
			icon: History,
			title: "No activity",
			text: "Nothing logged yet."
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 15,
			columnNumber: 30
		}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("ul", {
			className: "divide-y",
			children: list.map((a) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", {
				className: "flex items-center gap-3 py-3 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: `rounded-full p-1.5 ${a.actor === "Agent" ? "bg-accent/10 text-accent" : "bg-primary/10 text-primary"}`,
						children: a.actor === "Agent" ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Bot, { className: "h-4 w-4" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 17,
							columnNumber: 161
						}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(User, { className: "h-4 w-4" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 17,
							columnNumber: 191
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 17,
						columnNumber: 17
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
						className: "flex-1",
						children: a.text
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 18,
						columnNumber: 17
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
						className: "text-xs text-muted-foreground",
						children: new Date(a.at).toLocaleString()
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 19,
						columnNumber: 17
					}, this)
				]
			}, a.id, true, {
				fileName: _jsxFileName,
				lineNumber: 16,
				columnNumber: 28
			}, this))
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 15,
			columnNumber: 104
		}, this) }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 14,
			columnNumber: 7
		}, this)
	] }, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 9,
		columnNumber: 10
	}, this);
}
//#endregion
export { Activity as component };
