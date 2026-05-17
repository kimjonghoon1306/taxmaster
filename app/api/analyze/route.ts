import { NextRequest, NextResponse } from "next/server";

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

function extractJSON(raw: string): string {
  let s = raw.replace(/```json\s*/gi, "").replace(/```\s*/gi, "").trim();
  const a = s.indexOf("{"); const b = s.lastIndexOf("}");
  if (a !== -1 && b !== -1) s = s.slice(a, b + 1);
  return s;
}

async function callGroq(apiKey: string, summary: string): Promise<string> {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile", temperature: 0.3, max_tokens: 1200,
      messages: [
        { role: "system", content: SYSTEM },
        { role: "user", content: `사용자 상황:\n${summary}\n\nJSON으로 응답해주세요.` },
      ],
    }),
  });
  const d = await res.json();
  if (!res.ok) throw new Error(d.error?.message ?? `Groq 오류 (${res.status})`);
  return d.choices?.[0]?.message?.content ?? "";
}

async function callOpenAI(apiKey: string, summary: string): Promise<string> {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: "gpt-4o-mini", temperature: 0.3, max_tokens: 1200,
      messages: [
        { role: "system", content: SYSTEM },
        { role: "user", content: `사용자 상황:\n${summary}\n\nJSON으로 응답해주세요.` },
      ],
    }),
  });
  const d = await res.json();
  if (!res.ok) throw new Error(d.error?.message ?? `OpenAI 오류 (${res.status})`);
  return d.choices?.[0]?.message?.content ?? "";
}

export async function POST(req: NextRequest) {
  try {
    const { summary, provider, apiKey } = await req.json();
    const activeKey = apiKey || (
      provider === "groq" ? process.env.GROQ_API_KEY :
      provider === "openai" ? process.env.OPENAI_API_KEY : ""
    ) || "";

    if (!activeKey) return NextResponse.json({ error: "API 키가 없습니다. 관리자 페이지(⚙)에서 설정해주세요." }, { status: 400 });

    let text = "";
    if (provider === "groq") text = await callGroq(activeKey, summary);
    else if (provider === "openai") text = await callOpenAI(activeKey, summary);
    else return NextResponse.json({ error: `groq/openai만 처리합니다. Gemini는 클라이언트에서 직접 호출.` }, { status: 400 });

    return NextResponse.json(JSON.parse(extractJSON(text)));
  } catch (err) {
    console.error("[analyze error]", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
