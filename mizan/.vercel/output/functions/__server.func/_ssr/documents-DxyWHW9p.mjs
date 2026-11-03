import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { c as useStore, i as log, n as classify, o as setState, r as daysUntil, s as uid } from "./store-rMlowXs6.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { a as Trash2, i as Upload, v as FolderLock, x as Eye, y as FileText } from "../_libs/lucide-react.mjs";
import { i as Panel, r as PageHeader, t as Empty } from "./kit-DgXifPdr.mjs";
import { t as Button } from "./button-CQ5MMju4.mjs";
import { t as Input } from "./input-yeZ7xuTF.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/documents-DxyWHW9p.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "C:/Users/HP/Downloads/mizan-ui/mizan/src/routes/_app/documents.tsx?tsr-split=component";
var CATS = [
	"All",
	"Trade Licence",
	"Ejari",
	"Visa",
	"Employee Permit",
	"Tax",
	"MOA",
	"Other"
];
function Documents() {
	const docs = useStore((s) => s.docs);
	const ref = (0, import_react.useRef)(null);
	const [filter, setFilter] = (0, import_react.useState)("All");
	const [preview, setPreview] = (0, import_react.useState)(null);
	const [urls, setUrls] = (0, import_react.useState)({});
	const onFiles = (files) => {
		if (!files) return;
		for (const f of Array.from(files)) {
			if (f.type !== "application/pdf") {
				toast.error(`${f.name} is not a PDF`);
				continue;
			}
			const id = uid();
			setUrls((u) => ({
				...u,
				[id]: URL.createObjectURL(f)
			}));
			const category = classify(f.name);
			setState((s) => ({ docs: [{
				id,
				name: f.name,
				size: f.size,
				category,
				uploadedAt: (/* @__PURE__ */ new Date()).toISOString()
			}, ...s.docs] }));
			log("User", `Uploaded ${f.name} (classified as ${category})`);
		}
	};
	const setExpiry = (id, expiry) => {
		setState((s) => {
			const d = s.docs.find((x) => x.id === id);
			const deadlines = s.deadlines.filter((x) => x.id !== `doc-${id}`);
			if (expiry) deadlines.push({
				id: `doc-${id}`,
				title: `${d.category} expiry (${d.name})`,
				type: d.category,
				date: expiry
			});
			return {
				docs: s.docs.map((x) => x.id === id ? {
					...x,
					expiry
				} : x),
				deadlines
			};
		});
	};
	const shown = docs.filter((d) => filter === "All" || d.category === filter);
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PageHeader, {
			title: "Document Vault",
			sub: "PDFs are classified by filename here; the backend adds AI text extraction.",
			action: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
				ref,
				type: "file",
				accept: "application/pdf",
				multiple: true,
				hidden: true,
				onChange: (e) => onFiles(e.target.files)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 62,
				columnNumber: 133
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
				onClick: () => ref.current?.click(),
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Upload, { className: "h-4 w-4" }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 62,
					columnNumber: 290
				}, this), " Upload PDF"]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 62,
				columnNumber: 245
			}, this)] }, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 62,
				columnNumber: 131
			}, this)
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 62,
			columnNumber: 7
		}, this),
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "mb-4 flex flex-wrap gap-2",
			children: CATS.map((c) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
				onClick: () => setFilter(c),
				className: `rounded-full px-3 py-1 text-xs font-medium ${filter === c ? "bg-primary text-primary-foreground" : "bg-card border text-muted-foreground"}`,
				children: c
			}, c, false, {
				fileName: _jsxFileName,
				lineNumber: 64,
				columnNumber: 24
			}, this))
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 63,
			columnNumber: 7
		}, this),
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Panel, { children: shown.length === 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Empty, {
			icon: FolderLock,
			title: "No documents",
			text: "Upload your trade licence, Ejari, MOA and VAT certificate to improve your score."
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 67,
			columnNumber: 31
		}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "overflow-x-auto",
			children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("table", {
				className: "w-full text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("thead", {
					className: "text-left text-xs text-muted-foreground",
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", {
							className: "pb-2",
							children: "Document"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 69,
							columnNumber: 78
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", { children: "Category" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 69,
							columnNumber: 112
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", { children: "Expiry" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 69,
							columnNumber: 129
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", { children: "Status" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 69,
							columnNumber: 144
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", {}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 69,
							columnNumber: 159
						}, this)
					] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 69,
						columnNumber: 74
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 69,
					columnNumber: 15
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("tbody", {
					className: "divide-y",
					children: shown.map((d) => {
						const days = d.expiry ? daysUntil(d.expiry) : null;
						return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", {
								className: "py-3",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(FileText, { className: "h-4 w-4 text-accent" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 74,
										columnNumber: 85
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "max-w-56 truncate",
										children: d.name
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 74,
										columnNumber: 129
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 74,
									columnNumber: 44
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
									className: "text-xs text-muted-foreground",
									children: [(d.size / 1024).toFixed(0), " KB"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 74,
									columnNumber: 186
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 74,
								columnNumber: 23
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("select", {
								className: "rounded-md border bg-card px-2 py-1 text-xs",
								value: d.category,
								onChange: (e) => setState((s) => ({ docs: s.docs.map((x) => x.id === d.id ? {
									...x,
									category: e.target.value
								} : x) })),
								children: CATS.slice(1).map((c) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", { children: c }, c, false, {
									fileName: _jsxFileName,
									lineNumber: 82,
									columnNumber: 51
								}, this))
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 76,
								columnNumber: 25
							}, this) }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 75,
								columnNumber: 23
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
								type: "date",
								className: "h-8 w-36 text-xs",
								value: d.expiry ?? "",
								onChange: (e) => setExpiry(d.id, e.target.value)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 85,
								columnNumber: 27
							}, this) }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 85,
								columnNumber: 23
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", {
								className: "text-xs",
								children: days === null ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "text-muted-foreground",
									children: "No expiry"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 86,
									columnNumber: 64
								}, this) : days < 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "text-destructive",
									children: "Expired"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 86,
									columnNumber: 134
								}, this) : days <= 30 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "text-warning",
									children: [days, "d left"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 86,
									columnNumber: 199
								}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "text-success",
									children: "Valid"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 86,
									columnNumber: 252
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 86,
								columnNumber: 23
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", {
								className: "text-right",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
									size: "icon",
									variant: "ghost",
									disabled: !urls[d.id],
									onClick: () => setPreview(urls[d.id] ?? null),
									title: "Preview",
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Eye, { className: "h-4 w-4" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 88,
										columnNumber: 147
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 88,
									columnNumber: 25
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
									size: "icon",
									variant: "ghost",
									onClick: () => {
										setState((s) => ({
											docs: s.docs.filter((x) => x.id !== d.id),
											deadlines: s.deadlines.filter((x) => x.id !== `doc-${d.id}`)
										}));
										log("User", `Deleted ${d.name}`);
									},
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Trash2, { className: "h-4 w-4" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 95,
										columnNumber: 22
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 89,
									columnNumber: 25
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 87,
								columnNumber: 23
							}, this)
						] }, d.id, true, {
							fileName: _jsxFileName,
							lineNumber: 73,
							columnNumber: 22
						}, this);
					})
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 70,
					columnNumber: 15
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 68,
				columnNumber: 13
			}, this)
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 67,
			columnNumber: 170
		}, this) }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 66,
			columnNumber: 7
		}, this),
		preview && /* @__PURE__ */ (void 0)("div", {
			className: "fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 p-6",
			onClick: () => setPreview(null),
			children: /* @__PURE__ */ (void 0)("iframe", {
				src: preview,
				className: "h-[85vh] w-full max-w-4xl rounded-lg bg-card",
				title: "Preview"
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 104,
				columnNumber: 11
			}, this)
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 103,
			columnNumber: 19
		}, this)
	] }, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 61,
		columnNumber: 10
	}, this);
}
//#endregion
export { Documents as component };
