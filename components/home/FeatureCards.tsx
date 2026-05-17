"use client";
import { useRouter } from "next/navigation";

const FEATURES = [
  {
    icon: "💰", tag: "AI 분석", href: "/tax",
    title: "경정청구 & 세무",
    desc: "AI가 놓친 환급금을 찾아드려요. 최대 5년치 소급 가능.",
    items: ["AI 환급 가능액 자동 분석", "월세·의료비·부양가족 공제", "종합소득세 절세 전략", "경정청구 신청 가이드"],
  },
  {
    icon: "🏢", tag: "법무 가이드", href: "/legal?tab=corp",
    title: "법인 설립 A~Z",
    desc: "법무사 없이 셀프 설립. 서류 템플릿 무료 다운로드.",
    items: ["정관 작성 완전 가이드", "인터넷 등기소 셀프 등기", "사업자 등록까지 8단계", "표준 서류 템플릿 다운로드"],
  },
  {
    icon: "🤝", tag: "법무 가이드", href: "/legal?tab=coop",
    title: "협동조합 설립",
    desc: "5인 이상이면 누구나. 인가 없이 신고만으로 설립.",
    items: ["발기인 구성부터 등기까지", "표준정관·의사록 다운로드", "창립총회 진행 방법", "정부 지원 사업 안내"],
  },
];

export default function FeatureCards() {
  const router = useRouter();
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
      {FEATURES.map(f => (
        <div key={f.href}
          onClick={() => router.push(f.href)}
          style={{
            background: "var(--card)", border: "1px solid var(--border)",
            borderRadius: 20, padding: "32px 28px", cursor: "pointer",
            transition: "all 0.3s", position: "relative", overflow: "hidden",
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLDivElement).style.borderColor = "var(--gold-border)";
            (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
            (e.currentTarget as HTMLDivElement).style.background = "var(--card2)";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border)";
            (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
            (e.currentTarget as HTMLDivElement).style.background = "var(--card)";
          }}
        >
          <div style={{
            width: 52, height: 52, background: "var(--gold-dim)",
            border: "1px solid var(--gold-border)", borderRadius: 14,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 24, marginBottom: 20,
          }}>{f.icon}</div>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", color: "var(--gold)", marginBottom: 8 }}>{f.tag}</div>
          <h3 style={{ fontFamily: "'Noto Serif KR', serif", fontSize: 20, fontWeight: 700, marginBottom: 12 }}>{f.title}</h3>
          <p style={{ fontSize: 14, color: "var(--text2)", lineHeight: 1.7, marginBottom: 20 }}>{f.desc}</p>
          <ul style={{ listStyle: "none", marginBottom: 28 }}>
            {f.items.map(item => (
              <li key={item} style={{ fontSize: 13, color: "var(--text2)", padding: "5px 0", display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ color: "var(--gold)", fontSize: 18, lineHeight: 1 }}>·</span>{item}
              </li>
            ))}
          </ul>
          <div style={{
            width: "100%", padding: 13, background: "var(--gold-dim)",
            border: "1px solid var(--gold-border)", borderRadius: 10,
            color: "var(--gold2)", fontSize: 14, fontWeight: 600,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          }}>
            시작하기 →
          </div>
        </div>
      ))}
    </div>
  );
}
