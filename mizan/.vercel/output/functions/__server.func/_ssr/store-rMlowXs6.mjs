import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/store-rMlowXs6.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var KEY = "dubai-ops-state";
var empty = {
	user: null,
	business: null,
	docs: [],
	tasks: [],
	deadlines: [],
	chat: [],
	activity: [],
	approvals: []
};
var state = empty;
var loaded = false;
var listeners = /* @__PURE__ */ new Set();
function load() {
	if (loaded || typeof window === "undefined") return;
	loaded = true;
	try {
		const raw = localStorage.getItem(KEY);
		if (raw) state = {
			...empty,
			...JSON.parse(raw)
		};
	} catch {}
}
function setState(fn) {
	load();
	state = {
		...state,
		...fn(state)
	};
	localStorage.setItem(KEY, JSON.stringify(state));
	listeners.forEach((l) => l());
}
function useStore(sel) {
	return (0, import_react.useSyncExternalStore)((l) => {
		listeners.add(l);
		return () => listeners.delete(l);
	}, () => {
		load();
		return sel(state);
	}, () => sel(empty));
}
var uid = () => Math.random().toString(36).slice(2, 10);
function log(actor, text) {
	setState((s) => ({ activity: [{
		id: uid(),
		at: (/* @__PURE__ */ new Date()).toISOString(),
		actor,
		text
	}, ...s.activity] }));
}
function resetAll() {
	state = empty;
	localStorage.removeItem(KEY);
	listeners.forEach((l) => l());
}
function daysUntil(date) {
	return Math.ceil((new Date(date).getTime() - Date.now()) / 864e5);
}
function classify(name) {
	const n = name.toLowerCase();
	if (n.includes("licen")) return "Trade Licence";
	if (n.includes("ejari") || n.includes("tenancy")) return "Ejari";
	if (n.includes("visa")) return "Visa";
	if (n.includes("permit")) return "Employee Permit";
	if (n.includes("vat") || n.includes("tax") || n.includes("trn")) return "Tax";
	if (n.includes("moa") || n.includes("memorandum")) return "MOA";
	return "Other";
}
var REQUIRED_DOCS = [
	"Trade Licence",
	"Ejari",
	"MOA",
	"Tax"
];
//#endregion
export { resetAll as a, useStore as c, log as i, classify as n, setState as o, daysUntil as r, uid as s, REQUIRED_DOCS as t };
