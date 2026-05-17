"use client";
import { useState, useEffect, useRef } from "react";
import { QUIZ } from "@/data/quiz";
import { analyzeRefund, AnalysisResult } from "@/lib/aiClient";
import { downloadPDF } from "@/lib/generatePDF";

// 숫자 카운트업 훅
function useCountUp(target: string, active: boolean) {
  const [display, setDisplay] = useState("0");
  useEffect(() => {
    if (!active) return;
    const match = target.match(/[\d,]+/g);
    if (!match) { setDisplay(target); return; }
    const num = parseInt(match[0].replace(/,/g, ""));
    if (isNaN(num)) { setDisplay(target); return; }
    let start = 0;
    const duration = 1200;
    const step = 16;
    const inc = num / (duration / step);
    const timer = setInterval(() => {
      start += inc;
      if (start >= num) { setDisplay(target); clearInterval(timer); }
      else setDisplay(target.replace(/[\d,]+/, Math.floor(start).toLocaleString()));
    }, step);
    return () => clearInterval(timer);
  }, [active, target]);
  return display;
}

export default function RefundAnalyzer() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string | string[]>>({});
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState("");
  const [answerSummary, setAnswerSummary] = useState("");
  const [showResult, setShowResult] = useState(false);
  const countDisplay = useCountUp(result?.totalEstimate ?? "", showResult);

  const cur = QUIZ[step];
  const isLast = step === QUIZ.length - 1;

  const LOADING_MSGS = [
    "AI가 세무 규정을 검토하고 있어요...",
    "놓친 공제 항목을 찾는 중...",
    "환급 가능 금액을 계산하는 중...",
    "절세 전략을 수립하는 중...",
  ];

  useEffect(() => {
    if (!loading) return;
    const t = setInterval(() => setLoadingStep(s => (s + 1) % LOADING_MSGS.length), 2200);
    return () => clearInterval(t);
  }, [loading]);

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
    setLoading(true); setError(""); setLoadingStep(0);
    const summary = Object.entries(answers).map(([i, v]) => {
      const q = QUIZ[Number(i)];
      const vals = Array.isArray(v) ? v : [v];
      const labels = vals.map(val => q.options.find(o => o.value === val)?.label || val);
      return `${q.q}: ${labels.join(", ")}`;
    }).join("\n");
    setAnswerSummary(summary);
    try {
      const data = await analyzeRefund(summary);
      setResult(data);
      setTimeout(() => setShowResult(true), 100);
    } catch (e: any) {
      setError(e.message || "분석 중 오류가 발생했습니다.");
    }
    setLoading(false);
  }

  function reset() { setResult(null); setStep(0); setAnswers({}); setError(""); setShowResult(false); }

  // ── 로딩 ──
  if (loading) return (
    <div style={{ textAlign: "center", padding: "72px 0" }}>
      <div style={{ position: "relative", width: 80, height: 80, margin: "0 auto 28px" }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "3px solid rgba(201,168,76,0.15)" }} />
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "3px solid transparent", borderTopColor: "var(--gold)", animation: "spin 0.9s linear infinite" }} />
        <div style={{ position: "absolute", inset: 8, borderRadius: "50%", border: "2px solid transparent", borderTopColor: "var(--gold2)", animation: "spin 1.4s linear infinite reverse" }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>💰</div>
      </div>
      <p style={{ color: "var(--text)", fontSize: 17, fontWeight: 600, marginBottom: 8, transition: "all 0.4s" }}>
        {LOADING_MSGS[loadingStep]}
      </p>
      <p style={{ color: "var(--text3)", fontSize: 13 }}>Gemini는 모델 한도 초과 시 자동으로 다음 모델 전환</p>
      <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 24 }}>
        {LOADING_MSGS.map((_, i) => (
          <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: i === loadingStep ? "var(--gold)" : "var(--bg3)", transition: "background 0.3s" }} />
        ))}
      </div>
    </div>
  );

  // ── 에러 ──
  if (error) return (
    <div style={{ padding: "32px 0" }}>
      <div style={{ background: "rgba(224,92,92,0.08)", border: "1px solid rgba(224,92,92,0.25)", borderRadius: 16, padding: "28px 24px", marginBottom: 20, textAlign: "center" }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>⚠️</div>
        <div style={{ fontSize: 16, color: "var(--red)", fontWeight: 700, marginBottom: 10 }}>분석 실패</div>
        <div style={{ fontSize: 14, color: "var(--text2)", lineHeight: 1.7 }}>{error}</div>
      </div>
      <button className="btn-gold" style={{ width: "100%", padding: 15 }} onClick={reset}>다시 시도</button>
    </div>
  );

  // ── 결과 ──
  if (result) return (
    <div style={{ animation: showResult ? "fadeIn 0.5s ease" : "none" }}>

      {/* 총액 헤더 */}
      <div style={{
        background: "linear-gradient(135deg,#0f1923,#1a2638)",
        border: "1px solid var(--gold-border)", borderRadius: 20,
        padding: "32px 28px", marginBottom: 20, position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -40, right: -40, width: 160, height: 160, borderRadius: "50%", background: "rgba(201,168,76,0.06)" }} />
        <div style={{ position: "absolute", bottom: -20, left: -20, width: 100, height: 100, borderRadius: "50%", background: "rgba(201,168,76,0.04)" }} />
        <div style={{ position: "relative" }}>
          <div style={{ fontSize: 12, color: "var(--text3)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>예상 환급 가능 금액</div>
          <div style={{ fontFamily: "'Noto Serif KR',serif", fontSize: "clamp(32px,6vw,48px)", fontWeight: 700, color: "var(--gold2)", marginBottom: 6, lineHeight: 1.1 }}>
            {countDisplay}
          </div>
          <div style={{ fontSize: 12, color: "var(--text3)", marginBottom: result.urgent ? 16 : 0 }}>
            경정청구 + 절세 전략 합산 기준 · 실제와 다를 수 있음
          </div>
          {result.urgent && (
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(201,168,76,0.12)", border: "1px solid rgba(201,168,76,0.25)", borderRadius: 100, padding: "8px 16px", fontSize: 13, color: "var(--gold2)", fontWeight: 600 }}>
              ⚡ {result.urgent}
            </div>
          )}
        </div>
      </div>

      {/* 항목 리스트 */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "var(--gold)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 12 }}>환급 가능 항목</div>
        {result.items?.map((item, i) => (
          <div key={i} style={{
            background: "var(--card)", border: "1px solid var(--border)",
            borderRadius: 14, padding: "18px 20px", marginBottom: 10,
            display: "flex", alignItems: "flex-start", gap: 14,
            animation: `fadeIn 0.4s ease ${i * 0.1}s both`,
            borderLeft: "3px solid var(--gold)",
          }}>
            <div style={{ fontSize: 26, flexShrink: 0 }}>{item.icon}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{item.title}</div>
              <div style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.6 }}>{item.desc}</div>
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "var(--green)", whiteSpace: "nowrap", flexShrink: 0 }}>{item.amount}</div>
          </div>
        ))}
      </div>

      {/* 절세 팁 */}
      {result.tips?.length > 0 && (
        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14, padding: "20px 20px", marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "var(--gold)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 14 }}>지금 바로 할 수 있는 것</div>
          {result.tips.map((tip, i) => (
            <div key={i} style={{ display: "flex", gap: 12, padding: "10px 0", borderBottom: i < result.tips.length - 1 ? "1px solid var(--border)" : "none", alignItems: "flex-start" }}>
              <div style={{ width: 24, height: 24, borderRadius: "50%", background: "var(--gold)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "var(--bg)", flexShrink: 0 }}>{i + 1}</div>
              <span style={{ fontSize: 14, color: "var(--text2)", lineHeight: 1.6 }}>{tip}</span>
            </div>
          ))}
        </div>
      )}

      {/* 버튼 2개 */}
      <div style={{ display: "flex", gap: 12 }}>
        <button className="btn-ghost" style={{ flex: 1, padding: 15, fontSize: 15 }} onClick={reset}>
          🔄 다시 분석
        </button>
        <button className="btn-gold" style={{ flex: 1.5, padding: 15, fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
          onClick={() => downloadPDF(result, answerSummary)}>
          📄 PDF 보고서 다운로드
        </button>
      </div>
    </div>
  );

  // ── 설문 ──
  return (
    <div className="fade-in">
      <div className="quiz-progress">
        {QUIZ.map((_, i) => <div key={i} className={`quiz-progress-dot ${i <= step ? "done" : ""}`} />)}
      </div>
      <div style={{ fontSize: 13, color: "var(--text3)", marginBottom: 6 }}>{step + 1} / {QUIZ.length}</div>
      <div className="quiz-q">{cur.q}</div>
      <div className="quiz-hint">{cur.hint}</div>
      <div>
        {cur.options.map(opt => (
          <button key={opt.value} className={`quiz-option ${isSelected(opt.value) ? "selected" : ""}`} onClick={() => select(opt.value)}>
            <span style={{ fontSize: 22, width: 30, textAlign: "center", flexShrink: 0 }}>{opt.icon}</span>
            <span style={{ fontSize: 15 }}>{opt.label}</span>
            {isSelected(opt.value) && <span style={{ marginLeft: "auto", color: "var(--gold)", fontSize: 16 }}>✓</span>}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
        {step > 0 && <button className="btn-ghost" onClick={() => setStep(s => s - 1)}>← 이전</button>}
        <button className="btn-gold"
          style={{ flex: 1, opacity: hasAnswer() ? 1 : 0.35, cursor: hasAnswer() ? "pointer" : "not-allowed", padding: 15, fontSize: 15 }}
          disabled={!hasAnswer()}
          onClick={() => isLast ? analyze() : setStep(s => s + 1)}>
          {isLast ? "🔍 AI 분석 시작" : "다음 →"}
        </button>
      </div>
    </div>
  );
}
