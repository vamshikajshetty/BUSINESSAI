import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { S as useRouter, _ as lazyRouteComponent, b as Link, f as Scripts, g as Outlet, h as createRouter, p as HeadContent, v as createFileRoute, y as createRootRouteWithContext } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as QueryClientProvider } from "../_libs/react+tanstack__react-query.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { t as require_lib } from "../_libs/mongodb.mjs";
import { t as bcryptjs_default } from "../_libs/bcryptjs.mjs";
import { t as require_jsonwebtoken } from "../_libs/jsonwebtoken+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-BTOVT2CM.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var import_lib = require_lib();
var import_jsonwebtoken = /* @__PURE__ */ __toESM(require_jsonwebtoken());
var _jsxFileName$1 = "C:/Users/HP/Downloads/mizan-ui/mizan/src/components/ui/sonner.tsx";
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	}, void 0, false, {
		fileName: _jsxFileName$1,
		lineNumber: 7,
		columnNumber: 5
	}, void 0);
};
var styles_default = "/assets/styles-0vfT6xNM.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
	const stack = error instanceof Error ? error.stack : void 0;
	window.__lovableReportRuntimeError?.({
		message: describeThrown(error),
		...stack !== void 0 && { stack },
		filename: window.location.pathname
	});
}
var MAX_SERIALIZED_LENGTH = 2e3;
function describeThrown(error) {
	if (error instanceof Response) return `Response ${error.status}${error.url ? ` at ${error.url}` : ""}`;
	if (error instanceof Error) return error.message;
	if (typeof error === "string") return error;
	const { message } = error ?? {};
	if (typeof message === "string" && message.length > 0) return message;
	try {
		return JSON.stringify(error)?.slice(0, MAX_SERIALIZED_LENGTH) ?? String(error);
	} catch {
		return String(error);
	}
}
var _jsxFileName = "C:/Users/HP/Downloads/mizan-ui/mizan/src/routes/__root.tsx";
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 21,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 22,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 23,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 27,
						columnNumber: 11
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 26,
					columnNumber: 9
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 20,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 19,
		columnNumber: 5
	}, this);
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 49,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 52,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 56,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 65,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 55,
					columnNumber: 9
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 48,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 47,
		columnNumber: 5
	}, this);
}
var Route$15 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Mizan — Compliance OS for Dubai SMEs" },
			{
				name: "description",
				content: "Manage licences, documents, deadlines and tasks for your Dubai business."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			},
			{
				name: "twitter:site",
				content: "@Lovable"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
			},
			{
				rel: "icon",
				href: "/favicon.ico",
				type: "image/x-icon"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("head", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(HeadContent, {}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 108,
			columnNumber: 9
		}, this) }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 107,
			columnNumber: 7
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Scripts, {}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 112,
			columnNumber: 9
		}, this)] }, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 110,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 106,
		columnNumber: 5
	}, this);
}
function RootComponent() {
	const { queryClient } = Route$15.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(QueryClientProvider, {
		client: queryClient,
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Outlet, {}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 124,
			columnNumber: 7
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Toaster$1, {}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 125,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 122,
		columnNumber: 5
	}, this);
}
var $$splitComponentImporter$11 = () => import("./routes-tF6-uciO.mjs");
var Route$14 = createFileRoute("/")({
	head: () => ({ meta: [
		{ title: "Sign in — Mizan" },
		{
			name: "description",
			content: "Sign in to manage your Dubai business compliance."
		},
		{
			property: "og:title",
			content: "Sign in — Mizan"
		},
		{
			property: "og:description",
			content: "Compliance and operations for Dubai SMEs."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$11, "component")
});
var $$splitComponentImporter$10 = () => import("../_app-Da959pZU.mjs");
var Route$13 = createFileRoute("/_app")({ component: lazyRouteComponent($$splitComponentImporter$10, "component") });
var $$splitComponentImporter$9 = () => import("./onboarding-BiEK1aLJ.mjs");
var Route$12 = createFileRoute("/onboarding")({
	head: () => ({ meta: [
		{ title: "Set up your business — Mizan" },
		{
			name: "description",
			content: "Tell us about your Dubai business to personalise compliance tracking."
		},
		{
			property: "og:title",
			content: "Business onboarding — Mizan"
		},
		{
			property: "og:description",
			content: "Add your trade licence and business details."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var $$splitComponentImporter$8 = () => import("./register-CT1dBcFN.mjs");
var Route$11 = createFileRoute("/register")({
	head: () => ({ meta: [
		{ title: "Create account — Mizan" },
		{
			name: "description",
			content: "Create your Mizan workspace for your Dubai business."
		},
		{
			property: "og:title",
			content: "Create account — Mizan"
		},
		{
			property: "og:description",
			content: "Start tracking licences, documents and deadlines."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./activity-oyT8WKtn.mjs");
var Route$10 = createFileRoute("/_app/activity")({
	head: () => ({ meta: [
		{ title: "Activity Centre — Mizan" },
		{
			name: "description",
			content: "Audit trail of agent actions and user approvals."
		},
		{
			property: "og:title",
			content: "Activity Centre — Mizan"
		},
		{
			property: "og:description",
			content: "Every action, logged."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./agent-BtI249Ew.mjs");
var Route$9 = createFileRoute("/_app/agent")({
	head: () => ({ meta: [
		{ title: "Agent Workspace — Mizan" },
		{
			name: "description",
			content: "An agent that plans compliance work, creates tasks and asks for approval."
		},
		{
			property: "og:title",
			content: "Agent Workspace — Mizan"
		},
		{
			property: "og:description",
			content: "Plan, act and verify — with human approval."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./calendar-Dwk7iSoo.mjs");
var Route$8 = createFileRoute("/_app/calendar")({
	head: () => ({ meta: [
		{ title: "Compliance Calendar — Mizan" },
		{
			name: "description",
			content: "Track trade licence, Ejari, visa, permit and tax deadlines."
		},
		{
			property: "og:title",
			content: "Compliance Calendar — Mizan"
		},
		{
			property: "og:description",
			content: "Never miss a Dubai compliance deadline."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./chat-OvGzgiRD.mjs");
var Route$7 = createFileRoute("/_app/chat")({
	head: () => ({ meta: [
		{ title: "AI Assistant — Mizan" },
		{
			name: "description",
			content: "Ask about Dubai compliance and your business documents."
		},
		{
			property: "og:title",
			content: "AI Assistant — Mizan"
		},
		{
			property: "og:description",
			content: "Business and compliance answers grounded in your data."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./dashboard-7lN5RREh.mjs");
var Route$6 = createFileRoute("/_app/dashboard")({
	head: () => ({ meta: [
		{ title: "Dashboard — Mizan" },
		{
			name: "description",
			content: "Your compliance score, renewals, tasks and approvals at a glance."
		},
		{
			property: "og:title",
			content: "Dashboard — Mizan"
		},
		{
			property: "og:description",
			content: "Compliance overview for your Dubai business."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./documents-DxyWHW9p.mjs");
var Route$5 = createFileRoute("/_app/documents")({
	head: () => ({ meta: [
		{ title: "Document Vault — Mizan" },
		{
			name: "description",
			content: "Upload, classify and track expiry of your business documents."
		},
		{
			property: "og:title",
			content: "Document Vault — Mizan"
		},
		{
			property: "og:description",
			content: "Secure storage for licences, Ejari, visas and tax documents."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./profile-BRgxdge0.mjs");
var Route$4 = createFileRoute("/_app/profile")({
	head: () => ({ meta: [
		{ title: "Business Profile — Mizan" },
		{
			name: "description",
			content: "Manage your business and trade licence details."
		},
		{
			property: "og:title",
			content: "Business Profile — Mizan"
		},
		{
			property: "og:description",
			content: "Your Dubai business details in one place."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./tasks-Dhi8YTTK.mjs");
var Route$3 = createFileRoute("/_app/tasks")({
	head: () => ({ meta: [
		{ title: "Tasks — Mizan" },
		{
			name: "description",
			content: "Create, assign, prioritise and track business tasks."
		},
		{
			property: "og:title",
			content: "Tasks — Mizan"
		},
		{
			property: "og:description",
			content: "A task board for compliance and operations."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var uri = process.env.MONGODB_URI;
var dbName = process.env.DB_NAME || "business_ai";
if (!uri) throw new Error("MONGODB_URI is missing");
var globalForMongo = globalThis;
var clientPromise = globalForMongo.mongoClientPromise ?? (globalForMongo.mongoClientPromise = new import_lib.MongoClient(uri).connect());
async function getDb() {
	return (await clientPromise).db(dbName);
}
var Route$2 = createFileRoute("/api/health")({ server: { handlers: { GET: async () => {
	try {
		const db = await getDb();
		await db.command({ ping: 1 });
		return Response.json({
			success: true,
			message: "MongoDB connected successfully",
			database: db.databaseName
		});
	} catch (error) {
		console.error("MongoDB connection error:", error);
		return Response.json({
			success: false,
			message: "MongoDB connection failed"
		}, { status: 500 });
	}
} } } });
var JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error("JWT_SECRET is missing from environment variables");
function createAuthToken(userId) {
	return import_jsonwebtoken.default.sign({ sub: userId }, JWT_SECRET, { expiresIn: "7d" });
}
function createAuthCookie(token) {
	return [
		`mizan_token=${token}`,
		"HttpOnly",
		"SameSite=Lax",
		"Path=/",
		"Max-Age=604800"
	].join("; ") + "; Secure";
}
var Route$1 = createFileRoute("/api/auth/login")({ server: { handlers: { POST: async ({ request }) => {
	try {
		const body = await request.json();
		const email = String(body.email ?? "").trim().toLowerCase();
		const password = String(body.password ?? "");
		if (!email || !password) return Response.json({
			success: false,
			message: "Email and password are required."
		}, { status: 400 });
		const user = await (await getDb()).collection("users").findOne({ email });
		if (!user || typeof user.passwordHash !== "string") return Response.json({
			success: false,
			message: "Invalid email or password."
		}, { status: 401 });
		if (!await bcryptjs_default.compare(password, user.passwordHash)) return Response.json({
			success: false,
			message: "Invalid email or password."
		}, { status: 401 });
		const token = createAuthToken(user._id.toString());
		return Response.json({
			success: true,
			message: "Signed in successfully.",
			user: {
				id: user._id.toString(),
				name: user.name,
				email: user.email
			}
		}, { headers: { "Set-Cookie": createAuthCookie(token) } });
	} catch (error) {
		console.error("Login error:", error);
		return Response.json({
			success: false,
			message: "Unable to sign in."
		}, { status: 500 });
	}
} } } });
var Route = createFileRoute("/api/auth/register")({ server: { handlers: { POST: async ({ request }) => {
	try {
		const body = await request.json();
		const name = String(body.name ?? "").trim();
		const email = String(body.email ?? "").trim().toLowerCase();
		const password = String(body.password ?? "");
		if (!name || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return Response.json({
			success: false,
			message: "Enter a valid name and email."
		}, { status: 400 });
		if (password.length < 8) return Response.json({
			success: false,
			message: "Password must be at least 8 characters."
		}, { status: 400 });
		const users = (await getDb()).collection("users");
		await users.createIndex({ email: 1 }, { unique: true });
		if (await users.findOne({ email })) return Response.json({
			success: false,
			message: "An account with this email already exists."
		}, { status: 409 });
		const passwordHash = await bcryptjs_default.hash(password, 12);
		const result = await users.insertOne({
			name,
			email,
			passwordHash,
			createdAt: /* @__PURE__ */ new Date()
		});
		const token = createAuthToken(result.insertedId.toString());
		return Response.json({
			success: true,
			message: "Account created successfully.",
			user: {
				id: result.insertedId.toString(),
				name,
				email
			}
		}, {
			status: 201,
			headers: { "Set-Cookie": createAuthCookie(token) }
		});
	} catch (error) {
		console.error("Registration error:", error);
		return Response.json({
			success: false,
			message: "Unable to create account."
		}, { status: 500 });
	}
} } } });
var IndexRoute = Route$14.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$15
});
var AppRoute = Route$13.update({
	id: "/_app",
	getParentRoute: () => Route$15
});
var OnboardingRoute = Route$12.update({
	id: "/onboarding",
	path: "/onboarding",
	getParentRoute: () => Route$15
});
var RegisterRoute = Route$11.update({
	id: "/register",
	path: "/register",
	getParentRoute: () => Route$15
});
var AppActivityRoute = Route$10.update({
	id: "/activity",
	path: "/activity",
	getParentRoute: () => AppRoute
});
var AppAgentRoute = Route$9.update({
	id: "/agent",
	path: "/agent",
	getParentRoute: () => AppRoute
});
var AppCalendarRoute = Route$8.update({
	id: "/calendar",
	path: "/calendar",
	getParentRoute: () => AppRoute
});
var AppChatRoute = Route$7.update({
	id: "/chat",
	path: "/chat",
	getParentRoute: () => AppRoute
});
var AppDashboardRoute = Route$6.update({
	id: "/dashboard",
	path: "/dashboard",
	getParentRoute: () => AppRoute
});
var AppDocumentsRoute = Route$5.update({
	id: "/documents",
	path: "/documents",
	getParentRoute: () => AppRoute
});
var AppProfileRoute = Route$4.update({
	id: "/profile",
	path: "/profile",
	getParentRoute: () => AppRoute
});
var AppTasksRoute = Route$3.update({
	id: "/tasks",
	path: "/tasks",
	getParentRoute: () => AppRoute
});
var ApiHealthRoute = Route$2.update({
	id: "/api/health",
	path: "/api/health",
	getParentRoute: () => Route$15
});
var ApiAuthLoginRoute = Route$1.update({
	id: "/api/auth/login",
	path: "/api/auth/login",
	getParentRoute: () => Route$15
});
var ApiAuthRegisterRoute = Route.update({
	id: "/api/auth/register",
	path: "/api/auth/register",
	getParentRoute: () => Route$15
});
var AppRouteChildren = {
	AppActivityRoute,
	AppAgentRoute,
	AppCalendarRoute,
	AppChatRoute,
	AppDashboardRoute,
	AppDocumentsRoute,
	AppProfileRoute,
	AppTasksRoute
};
var rootRouteChildren = {
	IndexRoute,
	AppRoute: AppRoute._addFileChildren(AppRouteChildren),
	OnboardingRoute,
	RegisterRoute,
	ApiHealthRoute,
	ApiAuthLoginRoute,
	ApiAuthRegisterRoute
};
var routeTree = Route$15._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
