import { a as resetAll, c as useStore, i as log, o as setState } from "./store-rMlowXs6.mjs";
import { x as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { i as Panel, r as PageHeader } from "./kit-DgXifPdr.mjs";
import { t as Button } from "./button-CQ5MMju4.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as BusinessForm } from "./BusinessForm-B6uft2Ko.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/profile-BRgxdge0.js
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "C:/Users/HP/Downloads/mizan-ui/mizan/src/routes/_app/profile.tsx?tsr-split=component";
function Profile() {
	const { business, user, docs } = useStore((s) => s);
	const nav = useNavigate();
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PageHeader, {
			title: "Business Profile",
			sub: `${user?.name} · ${user?.email} · ${docs.length} document(s)`
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 15,
			columnNumber: 7
		}, this),
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Panel, {
			title: "Business details",
			children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(BusinessForm, {
				initial: business,
				cta: "Save changes",
				onSave: (b) => {
					setState((s) => ({
						business: b,
						deadlines: [...s.deadlines.filter((d) => d.title !== "Trade licence renewal"), {
							id: "licence",
							title: "Trade licence renewal",
							type: "Trade Licence",
							date: b.licenceExpiry
						}]
					}));
					log("User", "Updated business profile");
					toast.success("Profile saved");
				}
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 17,
				columnNumber: 9
			}, this)
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 16,
			columnNumber: 7
		}, this),
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Panel, {
			title: "Danger zone",
			className: "mt-6",
			children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
				variant: "destructive",
				onClick: () => {
					if (confirm("Delete all data in this browser?")) {
						resetAll();
						nav({ to: "/" });
					}
				},
				children: "Delete account & data"
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 32,
				columnNumber: 9
			}, this)
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 31,
			columnNumber: 7
		}, this)
	] }, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 14,
		columnNumber: 10
	}, this);
}
//#endregion
export { Profile as component };
