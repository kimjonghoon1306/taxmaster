"use client";
import { useState, useEffect } from "react";
import { isLoggedIn, login, logout, getAIConfig, saveAIConfig, getAdminPassword, setAdminPassword, AIProvider } from "@/lib/adminStorage";

// ─── 스타일 ──────────────────────────────────────────────────
const S = {
  wrap: {
    minHeight: "100vh", background: "#080c14",
    display: "flex", flexDirection: "column" as const,
  },
  center: {
    flex: 1, display: "flex", alignItems: "center",
    justifyContent: "center", padding: "24px 16px",
  },
  loginBox: {
    width: "100%", maxWidth: 420,
    background: "#111827", border: "1px solid rgba(201,168,76,0.2)",
    borderRadius: 24, padding: "40px 32px",
  },
  logo: {
    textAlign: "center" as const, marginBottom: 32,
  },
  logoIcon: {
    width: 56, height: 56, background: "linear-gradient(135deg,#c9a84c,#e8c86e)",
    borderRadius: 14, display: "flex", alignItems: "center",
    justifyContent: "center", fontSize: 26, margin: "0 auto 12px",
    color: "#080c14",
  },
  logoTitle: {
    fontFamily: "'Noto Serif KR',serif", fontSize: 22,
    fontWeight: 700, color: "#e8c86e",
  },
  logoSub: { fontSize: 13, color: "#6b6560", marginTop: 4 },
  label: {
    display: "block", fontSize: 14, fontWeight: 600,
    color: "#a8a098", marginBottom: 8,
  },
  input: {
    width: "100%", padding: "14px 16px",
    background: "#0e1420", border: "1.5px solid rgba(255,255,255,0.07)",
    borderRadius: 12, color: "#f0ece4", fontSize: 16,
    fontFamily: "'Noto Sans KR',sans-serif", outline: "none",
    boxSizing: "border-box" as const, transition: "border 0.2s",
  },
  btn: {
    width: "100%", padding: "15px",
    background: "#c9a84c", border: "none", borderRadius: 12,
    color: "#080c14", fontSize: 16, fontWeight: 700,
    cursor: "pointer", fontFamily: "'Noto Sans KR',sans-serif",
    marginTop: 8, transition: "opacity 0.2s",
  },
  err: {
    background: "rgba(224,92,92,0.1)", border: "1px solid rgba(224,92,92,0.3)",
    borderRadius: 10, padding: "12px 16px", fontSize: 14,
    color: "#e05c5c", marginTop: 12, textAlign: "center" as const,
  },
  // 대시보드
  dash: { maxWidth: 900, margin: "0 auto", padding: "32px 16px 80px", width: "100%" },
  header: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    marginBottom: 32, flexWrap: "wrap" as const, gap: 12,
  },
  headerTitle: {
    fontFamily: "'Noto Serif KR',serif", fontSize: "clamp(20px,4vw,28px)",
    fontWeight: 700, color: "#e8c86e",
  },
  logoutBtn: {
    padding: "10px 20px", background: "transparent",
    border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10,
    color: "#a8a098", fontSize: 14, cursor: "pointer",
    fontFamily: "'Noto Sans KR',sans-serif", transition: "all 0.2s",
    whiteSpace: "nowrap" as const,
  },
  tabs: { display: "flex", gap: 8, marginBottom: 28, flexWrap: "wrap" as const },
  tab: (active: boolean): React.CSSProperties => ({
    padding: "10px 22px", borderRadius: 100, fontSize: 15,
    cursor: "pointer", fontFamily: "'Noto Sans KR',sans-serif",
    border: active ? "none" : "1px solid rgba(255,255,255,0.1)",
    background: active ? "#c9a84c" : "transparent",
    color: active ? "#080c14" : "#a8a098", fontWeight: active ? 700 : 400,
    transition: "all 0.2s",
  }),
  card: {
    background: "#111827", border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 20, padding: "28px 24px", marginBottom: 16,
  },
  cardTitle: {
    fontSize: 17, fontWeight: 700, color: "#f0ece4",
    marginBottom: 20, display: "flex", alignItems: "center", gap: 8,
  },
  row: { marginBottom: 20 },
  select: {
    width: "100%", padding: "14px 16px",
    background: "#0e1420", border: "1.5px solid rgba(255,255,255,0.07)",
    borderRadius: 12, color: "#f0ece4", fontSize: 16,
    fontFamily: "'Noto Sans KR',sans-serif", outline: "none",
    boxSizing: "border-box" as const, cursor: "pointer",
  },
  saveBtn: {
    padding: "14px 32px", background: "#c9a84c",
    border: "none", borderRadius: 12, color: "#080c14",
    fontSize: 15, fontWeight: 700, cursor: "pointer",
    fontFamily: "'Noto Sans KR',sans-serif", transition: "opacity 0.2s",
  },
  toast: (show: boolean): React.CSSProperties => ({
    position: "fixed", bottom: 32, left: "50%",
    transform: `translateX(-50%) translateY(${show ? 0 : 20}px)`,
    background: "#34c77b", color: "#fff", padding: "13px 28px",
    borderRadius: 100, fontSize: 15, fontWeight: 600,
    opacity: show ? 1 : 0, transition: "all 0.3s", zIndex: 999,
    whiteSpace: "nowrap" as const, pointerEvents: "none",
  }),
  divider: { height: 1, background: "rgba(255,255,255,0.06)", margin: "20px 0" },
  hint: { fontSize: 13, color: "#6b6560", marginTop: 6, lineHeight: 1.6 },
  pwRow: { display: "flex", gap: 10, alignItems: "flex-end", flexWrap: "wrap" as const },
};

// ─── 로그인 화면 ─────────────────────────────────────────────
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState(false);

  function submit() {
    if (login(pw)) { onLogin(); }
    else { setErr(true); setTimeout(() => setErr(false), 2000); }
  }

  return (
    <div style={S.wrap}>
      <div style={S.center}>
        <div style={S.loginBox}>
          <div style={S.logo}>
            <div style={S.logoIcon}>⚖</div>
            <div style={S.logoTitle}>세무마스터</div>
            <div style={S.logoSub}>관리자 페이지</div>
          </div>
          <div style={S.row}>
            <label style={S.label}>비밀번호</label>
            <input
              style={S.input} type="password" placeholder="비밀번호 입력"
              value={pw} onChange={e => setPw(e.target.value)}
              onKeyDown={e => e.key === "Enter" && submit()}
              onFocus={e => (e.target.style.borderColor = "rgba(201,168,76,0.5)")}
              onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.07)")}
            />
          </div>
          <button style={S.btn} onClick={submit}>로그인</button>
          {err && <div style={S.err}>비밀번호가 틀렸습니다</div>}
          <div style={{ fontSize: 12, color: "#6b6560", textAlign: "center", marginTop: 20 }}>
            초기 비밀번호: 456789
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── AI 설정 탭 ───────────────────────────────────────────────
function AITab({ onSave }: { onSave: () => void }) {
  const [cfg, setCfg] = useState(getAIConfig());
  const [show, setShow] = useState({ groq: false, gemini: false, openai: false });

  function save() {
    saveAIConfig(cfg);
    onSave();
  }

  const providers: { id: AIProvider; label: string; placeholder: string; hint: string }[] = [
    { id: "groq", label: "Groq API Key", placeholder: "gsk_...", hint: "무료 · 가장 빠름 — console.groq.com" },
    { id: "gemini", label: "Gemini API Key", placeholder: "AIzaSy...", hint: "무료 — aistudio.google.com/app/apikey" },
    { id: "openai", label: "OpenAI API Key", placeholder: "sk-...", hint: "유료 — platform.openai.com/api-keys" },
  ];

  return (
    <div>
      <div style={S.card}>
        <div style={S.cardTitle}>🤖 AI 프로바이더 선택</div>
        <div style={S.row}>
          <label style={S.label}>사용할 AI</label>
          <select style={S.select} value={cfg.provider}
            onChange={e => setCfg({ ...cfg, provider: e.target.value as AIProvider })}>
            <option value="groq">Groq (llama3 · 무료 · 빠름)</option>
            <option value="gemini">Gemini (Google · 무료)</option>
            <option value="openai">OpenAI (gpt-4o-mini · 유료)</option>
          </select>
        </div>
      </div>

      {providers.map(p => (
        <div style={S.card} key={p.id}>
          <div style={S.cardTitle}>
            {p.id === "groq" ? "⚡" : p.id === "gemini" ? "💎" : "🔮"} {p.label}
          </div>
          <div style={{ position: "relative" }}>
            <input
              style={{ ...S.input, paddingRight: 56 }}
              type={show[p.id] ? "text" : "password"}
              placeholder={p.placeholder}
              value={p.id === "groq" ? cfg.groqKey : p.id === "gemini" ? cfg.geminiKey : cfg.openaiKey}
              onChange={e => setCfg({
                ...cfg,
                groqKey: p.id === "groq" ? e.target.value : cfg.groqKey,
                geminiKey: p.id === "gemini" ? e.target.value : cfg.geminiKey,
                openaiKey: p.id === "openai" ? e.target.value : cfg.openaiKey,
              })}
              onFocus={e => (e.target.style.borderColor = "rgba(201,168,76,0.5)")}
              onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.07)")}
            />
            <button
              onClick={() => setShow(s => ({ ...s, [p.id]: !s[p.id] }))}
              style={{
                position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
                background: "none", border: "none", cursor: "pointer",
                fontSize: 18, color: "#6b6560", padding: 4,
              }}>
              {show[p.id] ? "🙈" : "👁"}
            </button>
          </div>
          <div style={S.hint}>{p.hint}</div>
        </div>
      ))}

      <button style={S.saveBtn} onClick={save}>저장하기</button>
    </div>
  );
}

// ─── 비밀번호 변경 탭 ────────────────────────────────────────
function SecurityTab({ onSave }: { onSave: () => void }) {
  const [cur, setCur] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [err, setErr] = useState("");

  function save() {
    if (cur !== getAdminPassword()) { setErr("현재 비밀번호가 틀렸습니다"); return; }
    if (next.length < 6) { setErr("새 비밀번호는 6자 이상이어야 합니다"); return; }
    if (next !== confirm) { setErr("새 비밀번호가 일치하지 않습니다"); return; }
    setAdminPassword(next);
    setCur(""); setNext(""); setConfirm(""); setErr("");
    onSave();
  }

  const fields = [
    { label: "현재 비밀번호", val: cur, set: setCur },
    { label: "새 비밀번호 (6자 이상)", val: next, set: setNext },
    { label: "새 비밀번호 확인", val: confirm, set: setConfirm },
  ];

  return (
    <div style={S.card}>
      <div style={S.cardTitle}>🔒 비밀번호 변경</div>
      {fields.map(f => (
        <div style={S.row} key={f.label}>
          <label style={S.label}>{f.label}</label>
          <input style={S.input} type="password" value={f.val}
            onChange={e => f.set(e.target.value)}
            onFocus={e => (e.target.style.borderColor = "rgba(201,168,76,0.5)")}
            onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.07)")}
          />
        </div>
      ))}
      {err && <div style={S.err}>{err}</div>}
      <button style={{ ...S.saveBtn, marginTop: 4 }} onClick={save}>변경하기</button>
    </div>
  );
}

// ─── 메인 ────────────────────────────────────────────────────
export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState<"ai" | "security">("ai");
  const [toast, setToast] = useState(false);

  useEffect(() => { setAuthed(isLoggedIn()); }, []);

  function showToast() {
    setToast(true);
    setTimeout(() => setToast(false), 2200);
  }

  function doLogout() { logout(); setAuthed(false); }

  if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} />;

  const TABS = [
    { id: "ai" as const, label: "🤖 AI 설정" },
    { id: "security" as const, label: "🔒 보안" },
  ];

  return (
    <div style={S.wrap}>
      <div style={{ padding: "0 16px" }}>
        <div style={S.dash}>
          <div style={S.header}>
            <div>
              <div style={S.headerTitle}>관리자 대시보드</div>
              <div style={{ fontSize: 14, color: "#6b6560", marginTop: 4 }}>세무마스터 설정</div>
            </div>
            <button style={S.logoutBtn} onClick={doLogout}
              onMouseEnter={e => { (e.target as HTMLButtonElement).style.color = "#e05c5c"; (e.target as HTMLButtonElement).style.borderColor = "rgba(224,92,92,0.3)"; }}
              onMouseLeave={e => { (e.target as HTMLButtonElement).style.color = "#a8a098"; (e.target as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.1)"; }}>
              로그아웃
            </button>
          </div>

          <div style={S.tabs}>
            {TABS.map(t => (
              <button key={t.id} style={S.tab(tab === t.id)} onClick={() => setTab(t.id)}>
                {t.label}
              </button>
            ))}
          </div>

          {tab === "ai" && <AITab onSave={showToast} />}
          {tab === "security" && <SecurityTab onSave={showToast} />}
        </div>
      </div>

      <div style={S.toast(toast)}>✅ 저장되었습니다</div>
    </div>
  );
}

