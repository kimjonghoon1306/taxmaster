"use client";
import { useState } from "react";
import { TAX_SECTIONS } from "@/data/taxSections";

export default function TaxGuide() {
  const [activeTab, setActiveTab] = useState<keyof typeof TAX_SECTIONS>("refund");
  const sec = TAX_SECTIONS[activeTab];

  return (
    <div>
      <div className="tabs">
        {(Object.keys(TAX_SECTIONS) as (keyof typeof TAX_SECTIONS)[]).map(key => (
          <button key={key} className={`tab ${activeTab === key ? "active" : ""}`} onClick={() => setActiveTab(key)}>
            {TAX_SECTIONS[key].title}
          </button>
        ))}
      </div>

      {sec.items.map((item, i) => (
        <div className="result-item" key={i}>
          <div className="result-item-icon">{item.icon}</div>
          <div className="result-item-content">
            <div className="result-item-title">{item.title}</div>
            <div className="result-item-desc">{item.desc}</div>
          </div>
          <div className="result-item-amount">{item.amount}</div>
        </div>
      ))}

      <div className="card" style={{ marginTop: 20 }}>
        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>📋 신청 순서</div>
        {sec.guide.map((g, i) => (
          <div key={i} style={{ display: "flex", gap: 12, padding: "9px 0", borderBottom: i < sec.guide.length - 1 ? "1px solid var(--border)" : "none", alignItems: "flex-start" }}>
            <div style={{
              width: 22, height: 22, borderRadius: "50%", background: "var(--gold-dim)",
              border: "1px solid var(--gold-border)", display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: 11, fontWeight: 700, color: "var(--gold)",
              flexShrink: 0, marginTop: 1,
            }}>{i + 1}</div>
            <span style={{ fontSize: 14, color: "var(--text2)", lineHeight: 1.6 }}>{g}</span>
          </div>
        ))}
      </div>

      {activeTab === "refund" && (
        <div style={{ marginTop: 16, padding: "16px 20px", background: "rgba(224,92,92,0.08)", border: "1px solid rgba(224,92,92,0.2)", borderRadius: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--red)", marginBottom: 6 }}>⏰ 기한 주의</div>
          <div style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.6 }}>
            경정청구는 법정 신고기한으로부터 <strong style={{ color: "var(--text)" }}>5년</strong>이 지나면 영구 소멸.
            2020년 귀속분은 2025년 5월 31일로 이미 마감됨.
          </div>
        </div>
      )}
    </div>
  );
}
