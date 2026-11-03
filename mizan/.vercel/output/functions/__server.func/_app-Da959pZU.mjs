import { o as __toESM } from "./_runtime.mjs";
import { n as require_react } from "./_libs/@radix-ui/react-compose-refs+[...].mjs";
import { c as useStore, i as log } from "./_ssr/store-rMlowXs6.mjs";
import { b as Link, g as Outlet, x as useNavigate } from "./_libs/@tanstack/react-router+[...].mjs";
import { t as require_jsx_dev_runtime } from "./_libs/react.mjs";
import { D as Bot, E as Building2, _ as History, d as LogOut, l as MessageSquare, m as LayoutDashboard, o as ShieldCheck, p as ListChecks, u as Menu, v as FolderLock, w as CalendarDays } from "./_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_app-Da959pZU.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "C:/Users/HP/Downloads/mizan-ui/mizan/src/routes/_app.tsx?tsr-split=component";
var NAV = [
	{
		to: "/dashboard",
		label: "Dashboard",
		icon: LayoutDashboard
	},
	{
		to: "/chat",
		label: "AI Assistant",
		icon: MessageSquare
	},
	{
		to: "/agent",
		label: "Agent Workspace",
		icon: Bot
	},
	{
		to: "/documents",
		label: "Document Vault",
		icon: FolderLock
	},
	{
		to: "/calendar",
		label: "Compliance Calendar",
		icon: CalendarDays
	},
	{
		to: "/tasks",
		label: "Tasks",
		icon: ListChecks
	},
	{
		to: "/profile",
		label: "Business Profile",
		icon: Building2
	},
	{
		to: "/activity",
		label: "Activity Centre",
		icon: History
	}
];
function AppLayout() {
	const user = useStore((s) => s.user);
	const business = useStore((s) => s.business);
	const nav = useNavigate();
	const [ready, setReady] = (0, import_react.useState)(false);
	const [open, setOpen] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setReady(true);
	}, []);
	(0, import_react.useEffect)(() => {
		if (!ready) return;
		if (!user) nav({ to: "/" });
		else if (!business) nav({ to: "/onboarding" });
	}, [
		ready,
		user,
		business,
		nav
	]);
	if (!ready || !user || !business) return null;
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "flex min-h-screen",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("aside", {
			className: `fixed inset-y-0 left-0 z-40 w-64 flex-col bg-sidebar text-sidebar-foreground transition-transform lg:static lg:flex lg:translate-x-0 ${open ? "flex translate-x-0" : "hidden -translate-x-full"}`,
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex items-center gap-2 px-6 py-5 text-lg font-semibold text-sidebar-accent-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ShieldCheck, { className: "h-6 w-6 text-sidebar-primary" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 59,
						columnNumber: 11
					}, this), " Mizan"]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 58,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("nav", {
					className: "flex-1 space-y-0.5 px-3",
					children: NAV.map((n) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
						to: n.to,
						onClick: () => setOpen(false),
						className: "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
						activeProps: { className: "bg-sidebar-accent text-sidebar-accent-foreground" },
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(n.icon, { className: "h-4 w-4" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 65,
								columnNumber: 15
							}, this),
							" ",
							n.label
						]
					}, n.to, true, {
						fileName: _jsxFileName,
						lineNumber: 62,
						columnNumber: 25
					}, this))
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 61,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "border-t border-sidebar-border p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "truncate text-sm font-medium text-sidebar-accent-foreground",
							children: user.name
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 69,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "truncate text-xs",
							children: business.name
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 70,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
							onClick: () => {
								log("User", "Signed out");
								nav({ to: "/" });
							},
							className: "mt-3 flex items-center gap-2 text-xs hover:text-sidebar-accent-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(LogOut, { className: "h-3.5 w-3.5" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 77,
								columnNumber: 13
							}, this), " Sign out"]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 71,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 68,
					columnNumber: 9
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 57,
			columnNumber: 7
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "flex min-w-0 flex-1 flex-col",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("header", {
				className: "flex items-center gap-3 border-b bg-card px-4 py-3 lg:hidden",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
					onClick: () => setOpen(!open),
					"aria-label": "Menu",
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Menu, { className: "h-5 w-5" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 83,
						columnNumber: 68
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 83,
					columnNumber: 11
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
					className: "font-semibold",
					children: "Mizan"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 84,
					columnNumber: 11
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 82,
				columnNumber: 9
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("main", {
				className: "mx-auto w-full max-w-6xl flex-1 p-6 lg:p-8",
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Outlet, {}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 86,
					columnNumber: 70
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 86,
				columnNumber: 9
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 81,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 56,
		columnNumber: 10
	}, this);
}
//#endregion
export { AppLayout as component };
