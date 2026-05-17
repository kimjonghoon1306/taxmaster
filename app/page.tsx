import FeatureCards from "@/components/home/FeatureCards";

export default function HomePage() {
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "60px 24px 80px" }}>
      {/* 히어로 */}
      <div style={{ textAlign: "center", marginBottom: 72 }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          background: "var(--gold-dim)", border: "1px solid var(--gold-border)",
          color: "var(--gold)", fontSize: 12, fontWeight: 500,
          padding: "5px 14px", borderRadius: 100, marginBottom: 24, letterSpacing: "0.5px"
        }}>
          ⚡ 세무사·법무사 없이 직접 해결
        </div>
        <h1 style={{
          fontFamily: "'Noto Serif KR', serif", fontSize: "clamp(30px, 5vw, 48px)",
          fontWeight: 700, lineHeight: 1.25, marginBottom: 18
        }}>
          당신의 <span style={{ color: "var(--gold2)" }}>세금과 법인 설립</span>,<br />
          혼자서도 완벽하게
        </h1>
        <p style={{ fontSize: 17, color: "var(--text2)", lineHeight: 1.7, maxWidth: 560, margin: "0 auto" }}>
          놓친 환급금 찾기부터 법인·협동조합 설립까지.<br />
          AI와 함께라면 전문가 없이도 됩니다.
        </p>
      </div>
      <FeatureCards />
    </div>
  );
}
