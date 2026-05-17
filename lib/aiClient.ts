/**
 * AI 클라이언트 (클라이언트 사이드)
 * Gemini  → 브라우저 직접 호출 (Vercel 서버 IP 차단 우회)
 * Groq    → Vercel 서버 경유 (브라우저 CORS 불안정)
 * OpenAI  → Vercel 서버 경유
 */

import { getActiveAPIKey } from "./adminStorage";

// tarry 프로젝트와 동일한 모델 순서
const GEMINI_MODELS = [
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite",
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite",
];

export interface AnalysisResult {
  totalEstimate: string;
  items: { icon: string; title: string; desc: string; amount: string }[];
  tips: string[];
  urgent: string;
}

function extractJSON(raw: string): string {
  let s = raw.replace(/```json\s*/gi, "").replace(/```\s*/gi, "").trim();
  const a = s.indexOf("{");
  const b = s.lastIndexOf("}");
  if (a !== -1 && b !== -1) s = s.slice(a, b + 1);
  return s;
}

const SYSTEM = `당신은 한국 세무 전문가입니다. 사용자 상황을 분석해서 놓친 세금 환급 항목과 절세 방법을 알려주세요.
반드시 아래 JSON 형식으로만 응답하세요. 다른 텍스트나 마크다운 없이 JSON만 출력하세요.
{
  "totalEstimate": "예상 환급 가능 금액 (예: 200~400만원)",
  "items": [
    { "icon": "이모지", "title": "항목명", "desc": "2~3줄 설명", "amount": "예상 금액" },
    { "icon": "이모지", "title": "항목명", "desc": "2~3줄 설명", "amount": "예상 금액" },
    { "icon": "이모지", "title": "항목명", "desc": "2~3줄 설명", "amount": "예상 금액" }
  ],
  "tips": ["절세 팁 1", "절세 팁 2", "절세 팁 3"],
  "urgent": "가장 시급한 것 1줄"
}`;

// ── Gemini: 브라우저 직접 호출 + 모델 순서 자동 전환 ─────────
async function callGemini(apiKey: string, summary: string): Promise<AnalysisResult> {
  // system + user 하나로 합침 (systemInstruction 미사용 → 호환성 최대)
  const fullPrompt = `${SYSTEM}\n\n사용자 상황:\n${summary}\n\n위 상황을 분석해서 JSON으로 응답해주세요.`;
  let lastErr = "";

  for (const model of GEMINI_MODELS) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: fullPrompt }] }],
            generationConfig: { maxOutputTokens: 1200, temperature: 0.3 },
          }),
        }
      );

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        const msg = (err.error?.message || "").toLowerCase();

        // API 키 오류 → 즉시 중단
        if (
          res.status === 401 || res.status === 403 ||
          msg.includes("api key") || msg.includes("api_key") ||
          msg.includes("invalid") || msg.includes("authentication")
        ) {
          throw new Error("Gemini API 키가 잘못되었습니다. 관리자 페이지(⚙)에서 확인해주세요.");
        }

        // 한도 초과 → 다음 모델 시도
        if (
          res.status === 429 ||
          msg.includes("quota") || msg.includes("exhausted") ||
          msg.includes("resource_exhausted") || msg.includes("rate") || msg.includes("limit")
        ) {
          lastErr = `${model}: 한도 초과, 다음 모델 시도 중...`;
          continue;
        }

        lastErr = `${model}: 오류 (${res.status}) ${msg}`;
        continue;
      }

      const data = await res.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
      if (!text) { lastErr = `${model}: 빈 응답`; continue; }

      const parsed = JSON.parse(extractJSON(text));
      return parsed as AnalysisResult;

    } catch (e: any) {
      // API 키 오류는 바로 던짐
      if (e.message?.includes("API 키") || e.message?.includes("관리자")) throw e;
      // JSON 파싱 실패도 다음 모델 시도
      lastErr = `${model}: ${e.message}`;
      continue;
    }
  }

  throw new Error(`Gemini 모든 모델 실패. 마지막 오류: ${lastErr}`);
}

// ── Groq / OpenAI: Vercel 서버 경유 ──────────────────────────
async function callViaServer(
  provider: string,
  apiKey: string,
  summary: string
): Promise<AnalysisResult> {
  const res = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ summary, provider, apiKey }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `서버 오류 (${res.status})`);
  return data as AnalysisResult;
}

// ── 공개 함수 ─────────────────────────────────────────────────
export async function analyzeRefund(summary: string): Promise<AnalysisResult> {
  const cfg = getActiveAPIKey();

  if (!cfg || !cfg.key) {
    throw new Error("API 키가 없습니다. 관리자 페이지(⚙)에서 API 키를 설정해주세요.");
  }

  if (cfg.provider === "gemini") {
    return callGemini(cfg.key, summary);
  }

  // groq, openai → 서버 경유
  return callViaServer(cfg.provider, cfg.key, summary);
}
