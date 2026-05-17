/**
 * AI Provider 통합 모듈
 * 환경변수 AI_PROVIDER 로 선택: "groq" | "gemini" | "openai"
 * 미설정 시 자동 감지 (설정된 키 순서대로 시도)
 */

export type Provider = "groq" | "gemini" | "openai";

// ── Groq (llama3, 무료, 가장 빠름) ────────────────────────────
async function callGroq(system: string, prompt: string): Promise<string> {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      temperature: 0.3,
      max_tokens: 1200,
      messages: [
        { role: "system", content: system },
        { role: "user", content: prompt },
      ],
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message ?? "Groq error");
  return data.choices?.[0]?.message?.content ?? "";
}

// ── Gemini ─────────────────────────────────────────────────────
async function callGemini(system: string, prompt: string): Promise<string> {
  const key = process.env.GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: system }] },
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.3, maxOutputTokens: 1200 },
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message ?? "Gemini error");
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
}

// ── OpenAI ─────────────────────────────────────────────────────
async function callOpenAI(system: string, prompt: string): Promise<string> {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      temperature: 0.3,
      max_tokens: 1200,
      messages: [
        { role: "system", content: system },
        { role: "user", content: prompt },
      ],
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message ?? "OpenAI error");
  return data.choices?.[0]?.message?.content ?? "";
}

// ── 자동 감지: 설정된 키 순서로 시도 ─────────────────────────
function detectProvider(): Provider {
  const forced = process.env.AI_PROVIDER as Provider | undefined;
  if (forced) return forced;
  if (process.env.GROQ_API_KEY) return "groq";
  if (process.env.GEMINI_API_KEY) return "gemini";
  if (process.env.OPENAI_API_KEY) return "openai";
  throw new Error("AI API 키가 설정되지 않았습니다. .env.local 확인");
}

// ── 공개 함수 ──────────────────────────────────────────────────
export async function callAI(system: string, prompt: string): Promise<string> {
  const provider = detectProvider();
  switch (provider) {
    case "groq":    return callGroq(system, prompt);
    case "gemini":  return callGemini(system, prompt);
    case "openai":  return callOpenAI(system, prompt);
    default:        throw new Error(`Unknown provider: ${provider}`);
  }
}
