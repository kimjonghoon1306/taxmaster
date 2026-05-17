import { AnalysisResult } from "./aiClient";

export function downloadPDF(result: AnalysisResult, answers: string) {
  const now = new Date();
  const dateStr = `${now.getFullYear()}년 ${now.getMonth()+1}월 ${now.getDate()}일`;

  const html = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<title>세무마스터 환급 분석 보고서</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;700&family=Noto+Sans+KR:wght@300;400;500;700&display=swap');
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family:'Noto Sans KR',sans-serif; background:#fff; color:#1a1a2e; font-size:13px; line-height:1.6; }
  .page { width:794px; min-height:1123px; margin:0 auto; padding:48px 52px; }

  /* 헤더 */
  .header { display:flex; align-items:center; justify-content:space-between; padding-bottom:20px; border-bottom:2px solid #c9a84c; margin-bottom:28px; }
  .header-left { display:flex; align-items:center; gap:12px; }
  .logo-box { width:44px; height:44px; background:linear-gradient(135deg,#c9a84c,#e8c86e); border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:22px; color:#fff; }
  .logo-title { font-family:'Noto Serif KR',serif; font-size:20px; font-weight:700; color:#1a1a2e; }
  .logo-sub { font-size:11px; color:#888; margin-top:2px; }
  .header-right { text-align:right; font-size:11px; color:#888; line-height:1.8; }

  /* 제목 */
  .report-title { font-family:'Noto Serif KR',serif; font-size:22px; font-weight:700; color:#1a1a2e; margin-bottom:6px; }
  .report-sub { font-size:12px; color:#888; margin-bottom:28px; }

  /* 총액 박스 */
  .total-box { background:linear-gradient(135deg,#0e1420,#1a2235); border-radius:16px; padding:28px 32px; margin-bottom:24px; display:flex; align-items:center; justify-content:space-between; }
  .total-label { font-size:12px; color:#a8a098; margin-bottom:4px; }
  .total-amount { font-family:'Noto Serif KR',serif; font-size:36px; font-weight:700; color:#e8c86e; }
  .total-note { font-size:11px; color:#6b6560; margin-top:4px; }
  .total-badge { background:rgba(201,168,76,0.2); border:1px solid rgba(201,168,76,0.4); border-radius:100px; padding:6px 16px; font-size:12px; color:#e8c86e; font-weight:600; }

  /* 섹션 타이틀 */
  .section-title { font-size:13px; font-weight:700; color:#c9a84c; letter-spacing:0.5px; text-transform:uppercase; margin-bottom:12px; padding-bottom:8px; border-bottom:1px solid #eee; }

  /* 아이템 */
  .items { margin-bottom:24px; }
  .item { display:flex; align-items:flex-start; gap:14px; padding:14px 16px; background:#f9f9fb; border-radius:10px; margin-bottom:8px; border-left:3px solid #c9a84c; }
  .item-icon { font-size:22px; flex-shrink:0; }
  .item-body { flex:1; }
  .item-title { font-size:14px; font-weight:700; color:#1a1a2e; margin-bottom:3px; }
  .item-desc { font-size:12px; color:#555; line-height:1.6; }
  .item-amount { font-size:13px; font-weight:700; color:#2ecc71; white-space:nowrap; flex-shrink:0; margin-top:2px; }

  /* 팁 */
  .tips { margin-bottom:24px; }
  .tip { display:flex; align-items:flex-start; gap:10px; padding:10px 14px; background:#fffbf0; border-radius:8px; margin-bottom:6px; }
  .tip-num { width:22px; height:22px; background:#c9a84c; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:700; color:#fff; flex-shrink:0; margin-top:1px; }
  .tip-text { font-size:12px; color:#333; line-height:1.6; }

  /* 긴급 */
  .urgent-box { background:#fff8e1; border:1px solid #f0c040; border-radius:10px; padding:14px 16px; margin-bottom:24px; display:flex; align-items:center; gap:10px; }
  .urgent-icon { font-size:18px; }
  .urgent-text { font-size:13px; color:#7a5c00; font-weight:600; }

  /* 입력 요약 */
  .summary-box { background:#f5f5f7; border-radius:10px; padding:14px 16px; margin-bottom:28px; }
  .summary-text { font-size:11px; color:#666; line-height:1.8; }

  /* 푸터 */
  .footer { border-top:1px solid #eee; padding-top:16px; margin-top:auto; display:flex; justify-content:space-between; align-items:center; }
  .footer-text { font-size:10px; color:#aaa; line-height:1.7; }
  .footer-disclaimer { font-size:10px; color:#bbb; text-align:right; max-width:320px; line-height:1.6; }

  @media print {
    body { -webkit-print-color-adjust:exact; print-color-adjust:exact; }
    .page { padding:32px 40px; }
    .total-box { background:linear-gradient(135deg,#0e1420,#1a2235) !important; }
  }
</style>
</head>
<body>
<div class="page">
  <div class="header">
    <div class="header-left">
      <div class="logo-box">⚖</div>
      <div>
        <div class="logo-title">세무마스터</div>
        <div class="logo-sub">AI 세금 환급 분석 서비스</div>
      </div>
    </div>
    <div class="header-right">
      <div>분석일: ${dateStr}</div>
      <div>세무마스터 AI 자동 분석</div>
    </div>
  </div>

  <div class="report-title">환급 가능 세금 분석 보고서</div>
  <div class="report-sub">아래 내용은 AI 분석 결과로, 실제 세금과 다를 수 있습니다. 최종 신고 전 홈택스(hometax.go.kr)에서 확인하세요.</div>

  <div class="total-box">
    <div>
      <div class="total-label">예상 환급 가능 금액</div>
      <div class="total-amount">${result.totalEstimate}</div>
      <div class="total-note">경정청구 + 절세 전략 합산 기준</div>
    </div>
    <div class="total-badge">📋 보고서</div>
  </div>

  ${result.urgent ? `
  <div class="urgent-box">
    <div class="urgent-icon">⚡</div>
    <div class="urgent-text">지금 당장: ${result.urgent}</div>
  </div>` : ""}

  <div class="items">
    <div class="section-title">환급 가능 항목</div>
    ${result.items?.map(item => `
    <div class="item">
      <div class="item-icon">${item.icon}</div>
      <div class="item-body">
        <div class="item-title">${item.title}</div>
        <div class="item-desc">${item.desc}</div>
      </div>
      <div class="item-amount">${item.amount}</div>
    </div>`).join("") ?? ""}
  </div>

  ${result.tips?.length ? `
  <div class="tips">
    <div class="section-title">지금 바로 할 수 있는 절세 팁</div>
    ${result.tips.map((tip, i) => `
    <div class="tip">
      <div class="tip-num">${i+1}</div>
      <div class="tip-text">${tip}</div>
    </div>`).join("")}
  </div>` : ""}

  <div class="summary-box">
    <div class="section-title" style="border:none;margin-bottom:8px;">분석 기반 정보</div>
    <div class="summary-text">${answers.replace(/\n/g, " &nbsp;·&nbsp; ")}</div>
  </div>

  <div class="footer">
    <div class="footer-text">
      세무마스터 | AI 기반 세금 환급 분석<br>
      홈택스: www.hometax.go.kr | 국세청 상담: 126
    </div>
    <div class="footer-disclaimer">
      본 보고서는 참고용 AI 분석 결과입니다.<br>
      실제 세금 신고는 홈택스 또는 세무 전문가와 확인하세요.
    </div>
  </div>
</div>
<script>window.onload = () => { window.print(); }</script>
</body>
</html>`;

  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const win = window.open(url, "_blank");
  if (!win) {
    // 팝업 차단 시 직접 다운로드
    const a = document.createElement("a");
    a.href = url; a.download = `세무마스터_환급분석_${dateStr}.html`;
    a.click();
  }
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}
