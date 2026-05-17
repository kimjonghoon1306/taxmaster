import { NextRequest, NextResponse } from "next/server";
import { callAI } from "@/lib/ai";

const SYSTEM = `당신은 한국 세무 전문가입니다. 사용자의 상황을 분석해서 놓친 세금 환급 항목과 절세 방법을 알려주세요.
응답은 반드시 JSON 형식으로만 해주세요 (마크다운 코드블록 없이 순수 JSON):
{
  "totalEstimate": "예상 환급 가능 금액 (예: 200~400만원)",
  "items": [
    { "icon": "이모지", "title": "항목명", "desc": "2~3줄 설명", "amount": "예상 금액" }
  ],
  "tips": ["즉시 할 수 있는 절세 팁 3가지"],
  "urgent": "가장 시급한 것 1줄"
}`;

export async function POST(req: NextRequest) {
  try {
    const { summary } = await req.json();
    const text = await callAI(
      SYSTEM,
      `사용자 상황:\n${summary}\n\n이 사람이 놓쳤을 세금 환급 항목과 절세 방법을 분석해주세요.`
    );
    const clean = text.replace(/```json|```/g, "").trim();
    return NextResponse.json(JSON.parse(clean));
  } catch (err) {
    console.error("[analyze error]", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
