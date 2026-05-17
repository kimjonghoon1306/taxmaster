"use client";
import { useState } from "react";
import { QUIZ } from "@/data/quiz";
import { analyzeRefund, AnalysisResult } from "@/lib/aiClient";

export default function RefundAnalyzer() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string | string[]>>({});
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState("");

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
    setError("");
    setLoadingMsg("AI가 상황을 분석하고 있어요...");

    const summary = Object.entries(answers).map(([i, v]) => {
      const q = QUIZ[Number(i)];
      const vals = Array.isArray(v) ? v : [v];
      const labels = vals.map(val => q.options.find(o => o.value === val)?.label || val);
      return `${q.q}: ${labels.join(", ")}`;
    }).join("\n");

    try {
      // Gemini면 모델 전환 중 메시지 업데이트
      const timer = setInterval(() => {
        setLoadingMsg(m =>
          m.includes("다음 모델") ? "놓친 환급금을 찾는 중..." :
          m.includes("찾는") ? "AI가 세무 규정을 검토 중..." :
          "AI가 상황을 분석하고 있어요..."
        );
      }, 3000);

      const data = await analyzeRefund(summary);
      clearInterval(timer);
      setResult(data);
    } catch (e: any) {
      setError(e.message || "분석 중 오류가 발생했습니다.");
    }
    setLoading(false);
  }

  function reset() { setResult(null); setStep(0); setAnswers({}); setError(""); }

  if (loading) return (
    <div style={{ textAlign: "center", padding: "60px 0" }}>
      <div className="spinner" />
      <p style={{ color: "var(--text2)", fontSize: 16, marginBottom: 8 }}>{loadingMsg}</p>
      <p style={{ color: "var(--text3)", fontSize: 13 }}>Gemini는 모델 한도 초과 시 자동으로 다음 모델로 전환됩니다</p>
    </div>
  );

  if (error) return (
    <div style={{ padding: "32px 0" }}>
      <div style={{ background: "rgba(224,92,92,0.1)", border: "1px solid rgba(224,92,92,0.3)", borderRadius: 14, padding: "24px", marginBottom: 20, textAlign: "center" }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>⚠️</div>
        <div style={{ fontSize: 15, color: "#e05c5c", fontWeight: 600, marginBottom: 8 }}>분석 오류</div>
        <div style={{ fontSize: 14, color: "var(--text2)", lineHeight: 1.7 }}>{error}</div>
      </div>
      <button className="btn-gold" style={{ width: "100%", padding: 15 }} onClick={reset}>다시 시도</button>
    </div>
  );

  if (result) return (
    <div className="fade-in">
      <div style={{ background: "linear-gradient(135deg,#1a2235,#141b2d)", border: "1px solid var(--gold-border)", borderRadius: 20, padding: 32, marginBottom: 20, textAlign: "center" }}>
        <div style={{ fontSize: 14, color: "var(--text2)" }}>예상 환급 가능 금액</div>
        <div style={{ fontFamily: "'Noto Serif KR',serif", fontSize: 42, fontWeight: 700, color: "var(--gold2)", margin: "8px 0" }}>{result.totalEstimate}</div>
        <div style={{ fontSize: 12, color: "var(--text3)" }}>참고용 예상 금액 · 실제와 다를 수 있음</div>
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
      <button className="btn-gold" style={{ width: "100%", padding: 16, fontSize: 16 }} onClick={reset}>다시 분석하기</button>
    </div>
  );

  return (
    <div className="fade-in">
      <div className="quiz-progress">
        {QUIZ.map((_, i) => <div key={i} className={`quiz-progress-dot ${i <= step ? "done" : ""}`} />)}
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
        {step > 0 && <button className="btn-ghost" onClick={() => setStep(s => s - 1)}>← 이전</button>}
        <button className="btn-gold" style={{ flex: 1, opacity: hasAnswer() ? 1 : 0.3, cursor: hasAnswer() ? "pointer" : "not-allowed" }}
          disabled={!hasAnswer()}
          onClick={() => isLast ? analyze() : setStep(s => s + 1)}>
          {isLast ? "AI 분석 시작 →" : "다음 →"}
        </button>
      </div>
    </div>
  );
}
