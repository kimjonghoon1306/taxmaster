"use client";
import { useState } from "react";
import GuideSection from "@/components/legal/GuideSection";
import { CORP_STEPS, COOP_STEPS } from "@/data/corpSteps";

export default function LegalPage() {
  const [tab, setTab] = useState<"corp" | "coop">("corp");
  return (
    <div className="section">
      <h2 className="section-title"><span>법인 & 협동조합</span> 설립 가이드</h2>
      <p className="section-desc">법무사 없이 직접 설립하는 완전 가이드. 서류 템플릿을 바로 다운로드하세요.</p>
      <div className="tabs">
        <button className={`tab ${tab === "corp" ? "active" : ""}`} onClick={() => setTab("corp")}>🏢 법인 설립</button>
        <button className={`tab ${tab === "coop" ? "active" : ""}`} onClick={() => setTab("coop")}>🤝 협동조합 설립</button>
      </div>
      <GuideSection steps={tab === "corp" ? CORP_STEPS : COOP_STEPS} type={tab} />
    </div>
  );
}
