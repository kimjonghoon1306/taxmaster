"use client";
import { GuideStep } from "@/data/corpSteps";
import { downloadDoc } from "@/lib/download";

interface Props { steps: GuideStep[]; type: "corp" | "coop"; }

export default function GuideSection({ steps, type }: Props) {
  return (
    <div>
      <div className="highlight-box">
        <div className="highlight-box-title">📌 소요 기간 및 비용</div>
        <div className="highlight-box-text">
          {type === "corp"
            ? "총 소요 기간: 약 2~4주 | 셀프 등기 비용: 자본금 1억 기준 약 10~15만원 | 법무사 대행: 30~50만원"
            : "총 소요 기간: 약 4~6주 | 설립 신고 + 등기 비용: 약 5~10만원 | 최소 인원: 5인"}
        </div>
      </div>

      <div>
        {steps.map(step => (
          <div className="guide-step" key={step.num}>
            <div className="guide-step-num">{step.num}</div>
            <div className="guide-step-content">
              <div className="guide-step-title">{step.title}</div>
              <div className="guide-step-desc">{step.desc}</div>
              {step.tip && <div className="guide-step-tip">{step.tip}</div>}
              {step.docs.length > 0 && (
                <div className="guide-step-docs">
                  {step.docs.map(doc => (
                    <button key={doc} className="doc-btn" onClick={() => downloadDoc(doc)}>
                      📄 {doc}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
