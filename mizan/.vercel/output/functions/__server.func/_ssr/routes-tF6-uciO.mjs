import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { c as useStore, i as log, o as setState } from "./store-rMlowXs6.mjs";
import { b as Link, x as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { n as Field } from "./kit-DgXifPdr.mjs";
import { t as Button } from "./button-CQ5MMju4.mjs";
import { t as Input } from "./input-yeZ7xuTF.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as AuthShell } from "./AuthShell-CWZouRc9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-tF6-uciO.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "C:/Users/HP/Downloads/mizan-ui/mizan/src/routes/index.tsx?tsr-split=component";
function Login() {
	const nav = useNavigate();
	const user = useStore((s) => s.user);
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const submit = (e) => {
		e.preventDefault();
		if (!user || user.email !== email.trim().toLowerCase()) {
			toast.error("No account found for that email. Create one first.");
			return;
		}
		if (password.length < 8) {
			toast.error("Incorrect password.");
			return;
		}
		log("User", "Signed in");
		setState(() => ({}));
		nav({ to: "/dashboard" });
	};
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(AuthShell, {
		title: "Welcome back",
		sub: "Sign in to your workspace",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("form", {
			onSubmit: submit,
			className: "space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Field, {
					label: "Email",
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
						type: "email",
						required: true,
						value: email,
						onChange: (e) => setEmail(e.target.value)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 32,
						columnNumber: 30
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 32,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Field, {
					label: "Password",
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
						type: "password",
						required: true,
						value: password,
						onChange: (e) => setPassword(e.target.value)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 33,
						columnNumber: 33
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 33,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
					type: "button",
					onClick: () => toast.info("Password reset email is sent by the backend when running the full stack."),
					className: "text-xs text-accent hover:underline",
					children: "Forgot password?"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 34,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
					className: "w-full",
					type: "submit",
					children: "Sign in"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 37,
					columnNumber: 9
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 31,
			columnNumber: 7
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
			className: "mt-6 text-center text-sm text-muted-foreground",
			children: ["New here? ", /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
				to: "/register",
				className: "font-medium text-accent hover:underline",
				children: "Create an account"
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 40,
				columnNumber: 19
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 39,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 30,
		columnNumber: 10
	}, this);
}
//#endregion
export { Login as component };
