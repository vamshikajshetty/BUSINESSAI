import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { n as Field } from "./kit-DgXifPdr.mjs";
import { t as Button } from "./button-CQ5MMju4.mjs";
import { t as Input } from "./input-yeZ7xuTF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/BusinessForm-B6uft2Ko.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "C:/Users/HP/Downloads/mizan-ui/mizan/src/components/BusinessForm.tsx";
var AUTHORITIES = [
	"Dubai Department of Economy and Tourism (DET)",
	"Dubai Development Authority (DDA)",
	"DMCC",
	"Dubai South",
	"Other free zone"
];
var sel = "h-9 w-full rounded-md border border-input bg-card px-3 text-sm";
function BusinessForm({ initial, onSave, cta }) {
	const [b, setB] = (0, import_react.useState)(initial ?? {
		name: "",
		activity: "",
		location: "",
		authority: AUTHORITIES[0],
		licenceNo: "",
		licenceExpiry: "",
		employees: 1
	});
	const up = (k, v) => setB({
		...b,
		[k]: v
	});
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("form", {
		onSubmit: (e) => {
			e.preventDefault();
			onSave(b);
		},
		className: "grid gap-4 sm:grid-cols-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Field, {
				label: "Business name",
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
					required: true,
					value: b.name,
					onChange: (e) => up("name", e.target.value)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 17,
					columnNumber: 36
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 17,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Field, {
				label: "Business activity",
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
					required: true,
					value: b.activity,
					onChange: (e) => up("activity", e.target.value),
					placeholder: "e.g. IT consultancy"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 18,
					columnNumber: 40
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 18,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Field, {
				label: "Dubai location",
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
					required: true,
					value: b.location,
					onChange: (e) => up("location", e.target.value),
					placeholder: "e.g. Business Bay"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 19,
					columnNumber: 37
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 19,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Field, {
				label: "Licensing authority",
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("select", {
					className: sel,
					value: b.authority,
					onChange: (e) => up("authority", e.target.value),
					children: AUTHORITIES.map((a) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", { children: a }, a, false, {
						fileName: _jsxFileName,
						lineNumber: 22,
						columnNumber: 35
					}, this))
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 21,
					columnNumber: 9
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 20,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Field, {
				label: "Trade licence number",
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
					required: true,
					value: b.licenceNo,
					onChange: (e) => up("licenceNo", e.target.value)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 25,
					columnNumber: 43
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 25,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Field, {
				label: "Licence expiry date",
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
					type: "date",
					required: true,
					value: b.licenceExpiry,
					onChange: (e) => up("licenceExpiry", e.target.value)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 26,
					columnNumber: 42
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 26,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Field, {
				label: "Employee count",
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
					type: "number",
					min: 0,
					required: true,
					value: b.employees,
					onChange: (e) => up("employees", Number(e.target.value))
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 27,
					columnNumber: 37
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 27,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "flex items-end sm:col-span-2",
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
					type: "submit",
					children: cta
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 28,
					columnNumber: 53
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 28,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 16,
		columnNumber: 5
	}, this);
}
//#endregion
export { BusinessForm as t };
