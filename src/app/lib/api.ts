export type User = {
  id: number;
  username: string;
  email?: string;
};

export type Report = {
  id: number;
  category: "harassment" | "suspicious_person" | "dangerous_area" | "other";
  description: string | null;
  location: string;
  photo_url: string | null;
  created_at: string;
};

export type Contact = {
  id: number;
  name: string;
  surname: string;
  email: string;
  telegram_chat_id: number | null;
  invite_status: "pending" | "accepted";
  created_at?: string;
};

export class ApiError extends Error {
  status: number;
  details?: string[];

  constructor(status: number, message: string, details?: string[]) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
export const CLIENT_URL = import.meta.env.VITE_CLIENT_URL || window.location.origin;
export const BOT_USERNAME = import.meta.env.VITE_TELEGRAM_BOT_USERNAME || "YourBotName";
const LOCAL_AUTH_KEY = "nurai_local_auth_user";

export function wsUrl() {
  const base = new URL(API_BASE_URL);
  base.protocol = base.protocol === "https:" ? "wss:" : "ws:";
  base.pathname = "/ws";
  base.search = "";
  base.hash = "";
  return base.toString();
}

export async function api<T = unknown>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  const isFormData = options.body instanceof FormData;

  if (!isFormData && options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    credentials: "include",
    headers,
  });

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json") ? await response.json() : null;

  if (!response.ok) {
    throw new ApiError(
      response.status,
      data?.error || "Произошла ошибка. Попробуйте ещё раз.",
      data?.details,
    );
  }

  return data as T;
}

export function getLocalAuthUser(): User | null {
  try {
    const rawUser = localStorage.getItem(LOCAL_AUTH_KEY);
    return rawUser ? (JSON.parse(rawUser) as User) : null;
  } catch {
    return null;
  }
}

export function setLocalAuthUser(user: User) {
  localStorage.setItem(LOCAL_AUTH_KEY, JSON.stringify(user));
}

export function clearLocalAuthUser() {
  localStorage.removeItem(LOCAL_AUTH_KEY);
}

export function canUseLocalAuthFallback(error: unknown) {
  return !(error instanceof ApiError) || error.status === 404;
}

export function requestGeolocation() {
  if (!("geolocation" in navigator)) return;
  navigator.geolocation.getCurrentPosition(
    () => undefined,
    () => undefined,
    { enableHighAccuracy: true, timeout: 10000 },
  );
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}
