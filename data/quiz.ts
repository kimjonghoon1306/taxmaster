export interface QuizOption { icon: string; label: string; value: string; }
export interface QuizItem { q: string; hint: string; multi?: boolean; options: QuizOption[]; }

export const QUIZ: QuizItem[] = [
  {
    q: "현재 상황이 어떻게 되세요?",
    hint: "해당하는 것 모두 선택해도 돼요",
    multi: true,
    options: [
      { icon: "💼", label: "직장인 (회사 다님)", value: "worker" },
      { icon: "🏠", label: "전업주부", value: "housewife" },
      { icon: "💻", label: "프리랜서 / 3.3% 소득 있음", value: "freelancer" },
      { icon: "🛒", label: "부업 있음 (스마트스토어, 블로그 등)", value: "side" },
    ],
  },
  {
    q: "월세 내고 계세요?",
    hint: "연봉 8천만원 이하면 15~17% 세액공제 가능해요",
    options: [
      { icon: "✅", label: "네, 월세 내고 있어요", value: "rent_yes" },
      { icon: "🏠", label: "자가 또는 전세예요", value: "rent_no" },
    ],
  },
  {
    q: "부양가족이 있나요?",
    hint: "부모님(만 60세↑, 연소득 100만원↓), 자녀, 배우자 모두 포함",
    options: [
      { icon: "👨‍👩‍👧", label: "있어요", value: "family_yes" },
      { icon: "👤", label: "없어요", value: "family_no" },
    ],
  },
  {
    q: "연금저축 또는 IRP 납입하고 계세요?",
    hint: "최대 연 900만원 → 세액공제 최대 148만원",
    options: [
      { icon: "✅", label: "네, 납입 중이에요", value: "pension_yes" },
      { icon: "❌", label: "아니요, 안 하고 있어요", value: "pension_no" },
      { icon: "🤷", label: "잘 모르겠어요", value: "pension_unknown" },
    ],
  },
  {
    q: "지난 5년간 종합소득세를 제때 신고했나요?",
    hint: "경정청구로 5년치 소급 환급 가능해요",
    options: [
      { icon: "✅", label: "매년 꼼꼼히 했어요", value: "tax_yes" },
      { icon: "😅", label: "몇 년은 건너뛰었어요", value: "tax_skip" },
      { icon: "❌", label: "한 번도 안 했어요", value: "tax_never" },
    ],
  },
  {
    q: "연 소득 규모가 어느 정도예요?",
    hint: "소득 구간에 따라 세율과 절세 전략이 달라져요",
    options: [
      { icon: "💰", label: "3천만원 이하", value: "income_low" },
      { icon: "💰", label: "3천~6천만원", value: "income_mid" },
      { icon: "💰", label: "6천만원~1억", value: "income_high" },
      { icon: "💰", label: "1억 이상", value: "income_top" },
    ],
  },
];
