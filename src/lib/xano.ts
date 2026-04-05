/** Xano API — token key must match backend `authToken` response field name in storage */
export const AUTH_TOKEN_KEY = "authToken";

const DEFAULT_BASE =
  "https://x8ki-letl-twmt.n7.xano.io/api:jlZLbY7m";

export function getBaseUrl(): string {
  const fromEnv = import.meta.env.VITE_XANO_URL;
  return (typeof fromEnv === "string" && fromEnv.length > 0 ? fromEnv : DEFAULT_BASE).replace(
    /\/$/,
    ""
  );
}

let onUnauthorized: (() => void) | null = null;

export function setUnauthorizedCallback(fn: (() => void) | null) {
  onUnauthorized = fn;
}

export class ApiError extends Error {
  status: number;
  payload: unknown;

  constructor(message: string, status: number, payload?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

function migrateLegacyToken() {
  const legacy = localStorage.getItem("token");
  if (legacy && !localStorage.getItem(AUTH_TOKEN_KEY)) {
    localStorage.setItem(AUTH_TOKEN_KEY, legacy);
    localStorage.removeItem("token");
  }
}

migrateLegacyToken();

export function clearAuth() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem("token");
}

export function getAuthToken(): string | null {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

/** Xano paths: auth group uses `_0`; data endpoints do not. */
export const XANO_ENDPOINTS = {
  authLogin: "/auth/login_0",
  authSignup: "/auth/signup_0",
  authMe: "/auth/me_0",
  student: "/student",
  attendance: "/attendance",
  announcement: "/announcement",
  healthLog: "/health_log",
} as const;

async function parseBody(res: Response): Promise<unknown> {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function messageFromPayload(data: unknown, fallback: string): string {
  if (data && typeof data === "object") {
    const o = data as Record<string, unknown>;
    const m = o.message ?? o.error ?? o.msg;
    if (typeof m === "string") return m;
  }
  return fallback;
}

/**
 * Authenticated JSON request. Clears token and fires callback on 401/403.
 */
export async function xanoFetch(path: string, init: RequestInit = {}): Promise<unknown> {
  const base = getBaseUrl();
  const url = `${base}${path.startsWith("/") ? path : `/${path}`}`;
  const headers = new Headers(init.headers);
  const token = getAuthToken();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  if (
    init.body !== undefined &&
    !(init.body instanceof FormData) &&
    !headers.has("Content-Type")
  ) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(url, { ...init, headers });
  const data = await parseBody(res);

  if (res.status === 401 || res.status === 403) {
    clearAuth();
    onUnauthorized?.();
    throw new ApiError(messageFromPayload(data, "Unauthorized"), res.status, data);
  }

  if (!res.ok) {
    throw new ApiError(
      messageFromPayload(data, res.statusText || `HTTP ${res.status}`),
      res.status,
      data
    );
  }

  return data;
}

export async function xanoGet(path: string): Promise<unknown> {
  return xanoFetch(path, { method: "GET" });
}

export async function xanoPost(path: string, body: Record<string, unknown>): Promise<unknown> {
  return xanoFetch(path, { method: "POST", body: JSON.stringify(body) });
}

// —— Auth (no Bearer on login/signup) ——

export async function signupStudent(
  name: string,
  email: string,
  password: string
): Promise<unknown> {
  const base = getBaseUrl();
  const res = await fetch(`${base}${XANO_ENDPOINTS.authSignup}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  const data = await parseBody(res);
  if (!res.ok) {
    throw new ApiError(messageFromPayload(data, "Signup failed"), res.status, data);
  }
  return data;
}

export async function loginStudent(email: string, password: string): Promise<unknown> {
  const base = getBaseUrl();
  const res = await fetch(`${base}${XANO_ENDPOINTS.authLogin}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await parseBody(res) as Record<string, unknown> | null;
  if (!res.ok) {
    throw new ApiError(messageFromPayload(data, "Login failed"), res.status, data);
  }
  const token =
    (data && (data.authToken as string)) ||
    (data && (data.token as string)) ||
    (data && (data.access_token as string));
  if (typeof token === "string" && token.length > 0) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  }
  return data;
}

export async function getMe(): Promise<unknown> {
  return xanoGet(XANO_ENDPOINTS.authMe);
}

export async function getStudents(): Promise<unknown> {
  return xanoGet(XANO_ENDPOINTS.student);
}

export async function getAttendance(): Promise<unknown> {
  return xanoGet(XANO_ENDPOINTS.attendance);
}

/** Public: no auth required by API */
export async function getAnnouncements(): Promise<unknown> {
  const base = getBaseUrl();
  const res = await fetch(`${base}${XANO_ENDPOINTS.announcement}`);
  const data = await parseBody(res);
  if (!res.ok) {
    throw new ApiError(messageFromPayload(data, "Failed to load announcements"), res.status, data);
  }
  return data;
}

export async function getHealthLogs(): Promise<unknown> {
  return xanoGet(XANO_ENDPOINTS.healthLog);
}

/** Normalize list responses from Xano (array or wrapped). */
export function asRecordArray(data: unknown): Record<string, unknown>[] {
  if (Array.isArray(data)) {
    return data.filter((x) => x && typeof x === "object") as Record<string, unknown>[];
  }
  if (data && typeof data === "object") {
    const o = data as Record<string, unknown>;
    for (const key of ["items", "records", "data", "students", "student", "result"]) {
      const v = o[key];
      if (Array.isArray(v)) {
        return v.filter((x) => x && typeof x === "object") as Record<string, unknown>[];
      }
    }
  }
  return [];
}

export function pickStr(obj: Record<string, unknown>, keys: string[], fallback = ""): string {
  for (const k of keys) {
    const v = obj[k];
    if (typeof v === "string" && v.length > 0) return v;
    if (typeof v === "number") return String(v);
  }
  return fallback;
}

export function pickNum(obj: Record<string, unknown>, keys: string[]): number | undefined {
  for (const k of keys) {
    const v = obj[k];
    if (typeof v === "number" && !Number.isNaN(v)) return v;
    if (typeof v === "string") {
      const n = parseFloat(v);
      if (!Number.isNaN(n)) return n;
    }
  }
  return undefined;
}

/** Flatten common Xano `/auth/me_0` response shapes to a single record for the UI. */
export function unwrapMe(raw: unknown): Record<string, unknown> | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  for (const key of ["student", "user", "me", "profile", "data"]) {
    const v = o[key];
    if (v && typeof v === "object" && !Array.isArray(v)) {
      return { ...o, ...(v as Record<string, unknown>) };
    }
  }
  return o;
}
