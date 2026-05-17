"use client";
import { useState } from "react";
import { QUIZ } from "@/data/quiz";

interface AnalysisResult {
  totalEstimate: string;
  items: { icon: string; title: string; desc: string; amount: string }[];
  tips: string[];
  urgent: string;
}

export default function RefundAnalyzer() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string | string[]>>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const cur = QUIZ[step];
  const isLast = step === QUIZ.length - 1;

  function select(val: string) {
    if (cur.multi) {
      const prev = (answers[step] as string[]) || [];
      const next = prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val];
      setAnswers({ ...answers, [step]: next });
    } else {
      setAnswers({ ...answers, [step]: val });
    }
  }

  function isSelected(val: string) {
    if (cur.multi) return ((answers[step] as string[]) || []).includes(val);
    return answers[step] === val;
  }

  function hasAnswer() {
    const a = answers[step];
    if (!a) return false;
    if (Array.isArray(a)) return a.length > 0;
    return true;
  }

  async function analyze() {
    setLoading(true);
    const summary = Object.entries(answers).map(([i, v]) => {
      const q = QUIZ[Number(i)];
      const vals = Array.isArray(v) ? v : [v];
      const labels = vals.map(val => q.options.find(o => o.value === val)?.label || val);
      return `${q.q}: ${labels.join(", ")}`;
    }).join("\n");

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ summary }),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({
        totalEstimate: "200~500만원 추정",
        items: [
          { icon: "🏠", title: "월세 세액공제 경정청구", desc: "최대 5년치 소급 신청 가능. 홈택스에서 직접 신청하면 무료.", amount: "최대 637만원" },
          { icon: "💎", title: "연금저축·IRP 세액공제", desc: "연 900만원 납입 시 최대 148만원 환급.", amount: "연 최대 148만원" },
          { icon: "👨‍👩‍👧", title: "부양가족 공제 재검토", desc: "부모님 공제 누락 여부 확인. 따로 살아도 가능.", amount: "1인당 연 24만원" },
        ],
        tips: ["홈택스에서 5년치 지급명세서 확인", "월세 이체내역 지금 바로 준비", "12월 전 연금저축 추가 납입"],
        urgent: "홈택스 로그인 후 '원클릭 환급신고' 확인",
      });
    }
    setLoading(false);
  }

  function reset() { setResult(null); setStep(0); setAnswers({}); }

  if (loading) return (
    <div style={{ textAlign: "center", padding: "60px 0" }}>
      <div className="spinner" />
      <p style={{ color: "var(--text2)", fontSize: 15 }}>AI가 당신의 상황을 분석하고 있어요...</p>
      <p style={{ color: "var(--text3)", fontSize: 13, marginTop: 6 }}>놓친 환급금을 찾는 중</p>
    </div>
  );

  if (result) return (
    <div className="fade-in">
      <div style={{
        background: "linear-gradient(135deg, #1a2235, #141b2d)",
        border: "1px solid var(--gold-border)", borderRadius: 20,
        padding: 32, marginBottom: 20, textAlign: "center",
      }}>
        <div style={{ fontSize: 14, color: "var(--text2)" }}>예상 환급 가능 금액</div>
        <div style={{ fontFamily: "'Noto Serif KR', serif", fontSize: 42, fontWeight: 700, color: "var(--gold2)", margin: "8px 0" }}>
          {result.totalEstimate}
        </div>
        <div style={{ fontSize: 13, color: "var(--text3)" }}>참고용 예상 금액 · 실제와 다를 수 있음</div>
        {result.urgent && (
          <div style={{ marginTop: 16, padding: "10px 16px", background: "rgba(201,168,76,0.1)", borderRadius: 8, fontSize: 13, color: "var(--gold2)" }}>
            ⚡ 지금 당장: {result.urgent}
          </div>
        )}
      </div>

      {result.items?.map((item, i) => (
        <div className="result-item" key={i}>
          <div className="result-item-icon">{item.icon}</div>
          <div className="result-item-content">
            <div className="result-item-title">{item.title}</div>
            <div className="result-item-desc">{item.desc}</div>
          </div>
          <div className="result-item-amount">{item.amount}</div>
        </div>
      ))}

      {result.tips?.length > 0 && (
        <div className="card" style={{ marginTop: 16, marginBottom: 16 }}>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>✅ 지금 바로 할 수 있는 것</div>
          {result.tips.map((tip, i) => (
            <div key={i} style={{ display: "flex", gap: 10, padding: "9px 0", borderBottom: i < result.tips.length - 1 ? "1px solid var(--border)" : "none" }}>
              <span style={{ color: "var(--gold)", fontWeight: 700 }}>{i + 1}</span>
              <span style={{ fontSize: 14, color: "var(--text2)" }}>{tip}</span>
            </div>
          ))}
        </div>
      )}
      <button className="btn-gold" style={{ width: "100%", padding: 16, fontSize: 16 }} onClick={reset}>
        다시 분석하기
      </button>
    </div>
  );

  return (
    <div className="fade-in">
      <div className="quiz-progress">
        {QUIZ.map((_, i) => (
          <div key={i} className={`quiz-progress-dot ${i <= step ? "done" : ""}`} />
        ))}
      </div>
      <div className="quiz-q">{cur.q}</div>
      <div className="quiz-hint">{cur.hint}</div>
      <div>
        {cur.options.map(opt => (
          <button key={opt.value} className={`quiz-option ${isSelected(opt.value) ? "selected" : ""}`} onClick={() => select(opt.value)}>
            <span style={{ fontSize: 20, width: 28, textAlign: "center" }}>{opt.icon}</span>
            <span>{opt.label}</span>
          </button>
        ))}
      </div>
      <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
        {step > 0 && (
          <button className="btn-ghost" onClick={() => setStep(s => s - 1)}>← 이전</button>
        )}
        <button className="btn-gold" style={{ flex: 1, opacity: hasAnswer() ? 1 : 0.3, cursor: hasAnswer() ? "pointer" : "not-allowed" }}
          disabled={!hasAnswer()}
          onClick={() => isLast ? analyze() : setStep(s => s + 1)}>
          {isLast ? "AI 분석 시작 →" : "다음 →"}
        </button>
      </div>
    </div>
  );
}
