"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const LINKS = [
  { href: "/", label: "홈" },
  { href: "/tax", label: "세금·환급" },
  { href: "/legal", label: "법인·협동조합" },
];

export default function Nav() {
  const path = usePathname();
  const router = useRouter();
  return (
    <nav style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "18px 24px", borderBottom: "1px solid var(--border)",
      background: "rgba(8,12,20,0.95)", backdropFilter: "blur(20px)",
      position: "sticky", top: 0, zIndex: 100,
    }}>
      <Link href="/" style={{ textDecoration: "none" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
          <div style={{
            width: 32, height: 32, background: "linear-gradient(135deg, var(--gold), var(--gold2))",
            borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16, color: "var(--bg)",
          }}>⚖</div>
          <span style={{ fontFamily: "'Noto Serif KR', serif", fontSize: 18, fontWeight: 700, color: "var(--gold2)" }}>
            세무마스터
          </span>
        </div>
      </Link>

      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        {LINKS.map(l => (
          <Link key={l.href} href={l.href} style={{ textDecoration: "none" }}>
            <button className="nav-tab-btn" style={{
              padding: "7px 16px", borderRadius: 8, fontSize: 13, cursor: "pointer",
              fontWeight: 500, border: "none",
              background: path === l.href ? "var(--gold-dim)" : "transparent",
              color: path === l.href ? "var(--gold2)" : "var(--text2)",
              fontFamily: "'Noto Sans KR', sans-serif",
            }}>
              {l.label}
            </button>
          </Link>
        ))}

        {/* 톱니바퀴 */}
        <button
          onClick={() => router.push("/admin")}
          className="gear-btn"
          title="관리자"
          style={{
            width: 36, height: 36, borderRadius: 8, border: "none",
            background: "transparent", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, color: "var(--text3)", marginLeft: 4,
          }}
        >
          ⚙
        </button>
      </div>
    </nav>
  );
}
