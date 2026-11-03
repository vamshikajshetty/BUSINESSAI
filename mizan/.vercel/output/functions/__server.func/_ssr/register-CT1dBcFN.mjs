import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { i as log, o as setState } from "./store-rMlowXs6.mjs";
import { b as Link, x as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { n as Field } from "./kit-DgXifPdr.mjs";
import { t as Button } from "./button-CQ5MMju4.mjs";
import { t as Input } from "./input-yeZ7xuTF.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as AuthShell } from "./AuthShell-CWZouRc9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/register-CT1dBcFN.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "C:/Users/HP/Downloads/mizan-ui/mizan/src/routes/register.tsx?tsr-split=component";
function Register() {
	const nav = useNavigate();
	const [f, setF] = (0, import_react.useState)({
		name: "",
		email: "",
		password: ""
	});
	const submit = (e) => {
		e.preventDefault();
		if (f.password.length < 8) {
			toast.error("Password must be at least 8 characters.");
			return;
		}
		setState(() => ({ user: {
			name: f.name.trim(),
			email: f.email.trim().toLowerCase()
		} }));
		log("User", "Created account");
		nav({ to: "/onboarding" });
	};
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(AuthShell, {
		title: "Create your account",
		sub: "Takes under a minute",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("form", {
			onSubmit: submit,
			className: "space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Field, {
					label: "Full name",
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
						required: true,
						value: f.name,
						onChange: (e) => setF({
							...f,
							name: e.target.value
						})
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 35,
						columnNumber: 34
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 35,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Field, {
					label: "Work email",
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
						type: "email",
						required: true,
						value: f.email,
						onChange: (e) => setF({
							...f,
							email: e.target.value
						})
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 39,
						columnNumber: 35
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 39,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Field, {
					label: "Password (min 8 characters)",
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
						type: "password",
						required: true,
						value: f.password,
						onChange: (e) => setF({
							...f,
							password: e.target.value
						})
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 43,
						columnNumber: 52
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 43,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
					className: "w-full",
					type: "submit",
					children: "Create account"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 47,
					columnNumber: 9
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 34,
			columnNumber: 7
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
			className: "mt-6 text-center text-sm text-muted-foreground",
			children: ["Have an account? ", /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
				to: "/",
				className: "font-medium text-accent hover:underline",
				children: "Sign in"
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 50,
				columnNumber: 26
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 49,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 33,
		columnNumber: 10
	}, this);
}
//#endregion
export { Register as component };
