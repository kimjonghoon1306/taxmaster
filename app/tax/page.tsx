"use client";
import { useState } from "react";
import RefundAnalyzer from "@/components/tax/RefundAnalyzer";
import TaxGuide from "@/components/tax/TaxGuide";

export default function TaxPage() {
  const [tab, setTab] = useState<"ai" | "guide">("ai");
  return (
    <div className="section">
      <h2 className="section-title"><span>경정청구</span> & 세무 가이드</h2>
      <p className="section-desc">AI가 당신의 상황을 분석해 놓친 환급금과 절세 방법을 찾아드려요.</p>
      <div className="tabs">
        <button className={`tab ${tab === "ai" ? "active" : ""}`} onClick={() => setTab("ai")}>🤖 AI 환급 분석</button>
        <button className={`tab ${tab === "guide" ? "active" : ""}`} onClick={() => setTab("guide")}>📚 세무 가이드</button>
      </div>
      {tab === "ai" ? <RefundAnalyzer /> : <TaxGuide />}
    </div>
  );
}
