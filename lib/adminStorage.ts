/**
 * 관리자 로컬스토리지 유틸
 * 나중에 DB 연결 시 이 파일만 교체하면 됨
 */

const KEYS = {
  LOGGED_IN: "tm_admin_auth",
  PASSWORD: "tm_admin_pw",
  AI_PROVIDER: "tm_ai_provider",
  GROQ_KEY: "tm_groq_key",
  GEMINI_KEY: "tm_gemini_key",
  OPENAI_KEY: "tm_openai_key",
};

const DEFAULT_PASSWORD = "456789";

// ── 인증 ──────────────────────────────────────────────────────
export function getAdminPassword(): string {
  if (typeof window === "undefined") return DEFAULT_PASSWORD;
  return localStorage.getItem(KEYS.PASSWORD) || DEFAULT_PASSWORD;
}

export function setAdminPassword(pw: string) {
  localStorage.setItem(KEYS.PASSWORD, pw);
}

export function isLoggedIn(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(KEYS.LOGGED_IN) === "1";
}

export function login(pw: string): boolean {
  if (pw === getAdminPassword()) {
    localStorage.setItem(KEYS.LOGGED_IN, "1");
    return true;
  }
  return false;
}

export function logout() {
  localStorage.removeItem(KEYS.LOGGED_IN);
}

// ── AI 설정 ───────────────────────────────────────────────────
export type AIProvider = "groq" | "gemini" | "openai";

export interface AIConfig {
  provider: AIProvider;
  groqKey: string;
  geminiKey: string;
  openaiKey: string;
}

export function getAIConfig(): AIConfig {
  if (typeof window === "undefined") {
    return { provider: "groq", groqKey: "", geminiKey: "", openaiKey: "" };
  }
  return {
    provider: (localStorage.getItem(KEYS.AI_PROVIDER) as AIProvider) || "groq",
    groqKey: localStorage.getItem(KEYS.GROQ_KEY) || "",
    geminiKey: localStorage.getItem(KEYS.GEMINI_KEY) || "",
    openaiKey: localStorage.getItem(KEYS.OPENAI_KEY) || "",
  };
}

export function saveAIConfig(config: AIConfig) {
  localStorage.setItem(KEYS.AI_PROVIDER, config.provider);
  localStorage.setItem(KEYS.GROQ_KEY, config.groqKey);
  localStorage.setItem(KEYS.GEMINI_KEY, config.geminiKey);
  localStorage.setItem(KEYS.OPENAI_KEY, config.openaiKey);
}

export function getActiveAPIKey(): { provider: AIProvider; key: string } | null {
  const c = getAIConfig();
  const key = c.provider === "groq" ? c.groqKey
    : c.provider === "gemini" ? c.geminiKey
    : c.openaiKey;
  if (!key) return null;
  return { provider: c.provider, key };
}
