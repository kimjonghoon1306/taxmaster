"use client";
import { useState } from "react";
import { GuideStep } from "@/data/corpSteps";
import { downloadDoc } from "@/lib/download";

interface Props { steps: GuideStep[]; type: "corp" | "coop"; }

export default function GuideSection({ steps, type }: Props) {
  const [openStep, setOpenStep] = useState<number | null>(null);

  return (
    <div>
      {/* 상단 요약 */}
      <div style={{
        background: "var(--gold-dim)", border: "1px solid var(--gold-border)",
        borderRadius: 14, padding: "18px 20px", marginBottom: 28,
      }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "var(--gold)", letterSpacing: 1, marginBottom: 6 }}>📌 전체 일정 및 비용</div>
        <div style={{ fontSize: 14, color: "var(--text2)", lineHeight: 1.8 }}>
          {type === "corp"
            ? "⏱ 총 소요 기간: 약 2~4주  |  💰 셀프 등기 비용: 자본금 1억 기준 약 50만원 내외  |  📋 법무사 대행: 30~50만원 추가"
            : "⏱ 총 소요 기간: 약 4~6주  |  💰 설립 신고 + 등기 비용: 약 15~25만원  |  👥 최소 인원: 5인"}
        </div>
      </div>

      {/* 단계 목록 */}
      <div>
        {steps.map((step, idx) => {
          const isOpen = openStep === step.num;
          return (
            <div key={step.num} style={{ marginBottom: 12 }}>
              {/* 단계 헤더 (클릭으로 열기) */}
              <div
                onClick={() => setOpenStep(isOpen ? null : step.num)}
                style={{
                  display: "flex", alignItems: "center", gap: 16,
                  background: isOpen ? "var(--card2)" : "var(--card)",
                  border: `1px solid ${isOpen ? "var(--gold-border)" : "var(--border)"}`,
                  borderRadius: isOpen ? "14px 14px 0 0" : 14,
                  padding: "18px 20px", cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                <div style={{
                  width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
                  background: isOpen ? "var(--gold)" : "var(--gold-dim)",
                  border: `2px solid ${isOpen ? "var(--gold)" : "var(--gold-border)"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 14, fontWeight: 700,
                  color: isOpen ? "var(--bg)" : "var(--gold)",
                  transition: "all 0.2s",
                }}>
                  {step.num}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: isOpen ? "var(--gold2)" : "var(--text)" }}>
                    {step.title}
                  </div>
                  {!isOpen && (
                    <div style={{ fontSize: 13, color: "var(--text3)", marginTop: 2 }}>
                      {step.docs.length > 0 && `📄 서류 ${step.docs.length}개`}
                      {step.links && step.links.length > 0 && `  🔗 링크 ${step.links.length}개`}
                      {step.checklist && `  ✅ 체크리스트 ${step.checklist.filter(c => c.startsWith("  ") === false && c !== "제출 서류 준비:").length}개`}
                    </div>
                  )}
                </div>
                <div style={{ color: "var(--text3)", fontSize: 18, transition: "transform 0.2s", transform: isOpen ? "rotate(180deg)" : "none" }}>
                  ▾
                </div>
              </div>

              {/* 단계 상세 내용 */}
              {isOpen && (
                <div style={{
                  background: "var(--card)", border: "1px solid var(--gold-border)",
                  borderTop: "none", borderRadius: "0 0 14px 14px",
                  padding: "20px 20px 24px",
                }}>
                  {/* 설명 */}
                  <div style={{ fontSize: 14, color: "var(--text2)", lineHeight: 1.8, marginBottom: 16 }}>
                    {step.desc}
                  </div>

                  {/* 팁 */}
                  {step.tip && (
                    <div style={{
                      background: "var(--bg3)", borderLeft: "3px solid var(--gold)",
                      padding: "12px 16px", borderRadius: "0 8px 8px 0",
                      fontSize: 13, color: "var(--text2)", lineHeight: 1.6, marginBottom: 16,
                    }}>
                      {step.tip}
                    </div>
                  )}

                  {/* 제출처 정보 */}
                  {step.submit && (
                    <div style={{
                      background: "rgba(74,158,255,0.08)", border: "1px solid rgba(74,158,255,0.2)",
                      borderRadius: 10, padding: "14px 16px", marginBottom: 16,
                    }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "var(--blue)", marginBottom: 8, letterSpacing: 0.5 }}>
                        📬 제출처 및 방법
                      </div>
                      <div style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.8 }}>
                        <span style={{ color: "var(--text)", fontWeight: 600 }}>어디에:</span> {step.submit.where}<br />
                        <span style={{ color: "var(--text)", fontWeight: 600 }}>어떻게:</span> {step.submit.how}<br />
                        <span style={{ color: "var(--text)", fontWeight: 600 }}>소요시간:</span> {step.submit.time}
                      </div>
                    </div>
                  )}

                  {/* 바로가기 링크 */}
                  {step.links && step.links.length > 0 && (
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text3)", marginBottom: 8, letterSpacing: 0.5 }}>
                        🔗 바로가기
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                        {step.links.map(link => (
                          <a
                            key={link.url}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: "inline-flex", alignItems: "center", gap: 6,
                              padding: "9px 16px", background: "var(--bg3)",
                              border: "1px solid var(--border)", borderRadius: 8,
                              fontSize: 13, color: "var(--blue)", textDecoration: "none",
                              transition: "all 0.2s", fontWeight: 500,
                            }}
                            onMouseEnter={e => {
                              (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(74,158,255,0.4)";
                              (e.currentTarget as HTMLAnchorElement).style.background = "rgba(74,158,255,0.08)";
                            }}
                            onMouseLeave={e => {
                              (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--border)";
                              (e.currentTarget as HTMLAnchorElement).style.background = "var(--bg3)";
                            }}
                          >
                            ↗ {link.label}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 체크리스트 */}
                  {step.checklist && step.checklist.length > 0 && (
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text3)", marginBottom: 10, letterSpacing: 0.5 }}>
                        ✅ 이 단계에서 할 일
                      </div>
                      <div style={{ background: "var(--bg3)", borderRadius: 10, padding: "14px 16px" }}>
                        {step.checklist.map((item, i) => (
                          item.startsWith("  ") ? (
                            <div key={i} style={{ fontSize: 13, color: "var(--text3)", padding: "3px 0 3px 24px", lineHeight: 1.6 }}>
                              {item.trim()}
                            </div>
                          ) : (
                            <CheckItem key={i} text={item} />
                          )
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 서류 다운로드 */}
                  {step.docs.length > 0 && (
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text3)", marginBottom: 8, letterSpacing: 0.5 }}>
                        📄 서류 다운로드
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                        {step.docs.filter(doc => doc !== "사업목적_작성예시.txt").map(doc => (
                          <button
                            key={doc}
                            className="doc-btn"
                            onClick={() => downloadDoc(doc)}
                          >
                            ⬇ {doc.replace(".txt", "")}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 완료 후 안내 */}
      <div style={{
        marginTop: 28, background: "var(--card)", border: "1px solid var(--border)",
        borderRadius: 14, padding: "20px", textAlign: "center",
      }}>
        <div style={{ fontSize: 24, marginBottom: 8 }}>🎉</div>
        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>
          모든 단계 완료 = {type === "corp" ? "법인" : "협동조합"} 설립 완료!
        </div>
        <div style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.7 }}>
          궁금한 점은 국세청 126, {type === "coop" ? "기획재정부 협동조합 포털 www.coop.go.kr" : "인터넷등기소 www.iros.go.kr"}에서 확인하세요.
        </div>
      </div>
    </div>
  );
}

function CheckItem({ text }: { text: string }) {
  const [checked, setChecked] = useState(false);
  return (
    <div
      onClick={() => setChecked(c => !c)}
      style={{
        display: "flex", alignItems: "flex-start", gap: 10,
        padding: "7px 0", cursor: "pointer",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
        opacity: checked ? 0.5 : 1, transition: "all 0.15s",
      }}
    >
      <div style={{
        width: 18, height: 18, borderRadius: 4, flexShrink: 0, marginTop: 1,
        background: checked ? "var(--green)" : "transparent",
        border: `1.5px solid ${checked ? "var(--green)" : "var(--border)"}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 11, color: "#fff", transition: "all 0.15s",
      }}>
        {checked && "✓"}
      </div>
      <span style={{
        fontSize: 13, color: "var(--text2)", lineHeight: 1.6,
        textDecoration: checked ? "line-through" : "none",
      }}>
        {text}
      </span>
    </div>
  );
}
