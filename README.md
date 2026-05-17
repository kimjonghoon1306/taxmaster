# 세무마스터 (TaxMaster)

세무사·법무사 없이 경정청구, 절세, 법인·협동조합 설립을 직접 처리하는 AI 도우미

## 기능

- **AI 경정청구 분석기** — 6문답으로 놓친 환급금 자동 분석
- **세무 가이드** — 경정청구 / 절세 전략 / 종합소득세 신고
- **법인 설립 A~Z** — 8단계 완전 가이드 + 서류 템플릿 다운로드
- **협동조합 설립** — 8단계 완전 가이드 + 표준정관·의사록 다운로드

## 시작하기

```bash
# 패키지 설치
npm install

# 환경변수 설정
cp .env.local.example .env.local
# .env.local 에 ANTHROPIC_API_KEY 입력

# 개발 서버 실행
npm run dev
```

## 환경변수

```
# 사용할 AI 선택 (groq 권장 — 무료, 빠름)
AI_PROVIDER=groq

GROQ_API_KEY=gsk_...       # https://console.groq.com
GEMINI_API_KEY=AIzaSy...   # https://aistudio.google.com/app/apikey
OPENAI_API_KEY=sk-...      # https://platform.openai.com/api-keys
```

하나만 설정해도 동작. `AI_PROVIDER` 미설정 시 Groq → Gemini → OpenAI 순으로 자동 감지.

## 배포 (Vercel)

```bash
vercel --prod
# Vercel 대시보드에서 ANTHROPIC_API_KEY 환경변수 추가
```

## 프로젝트 구조

```
taxmaster/
├── app/
│   ├── api/analyze/route.ts   # Anthropic API 서버 라우트
│   ├── tax/page.tsx           # 세금·환급 페이지
│   ├── legal/page.tsx         # 법인·협동조합 페이지
│   ├── layout.tsx
│   ├── page.tsx               # 홈
│   └── globals.css
├── components/
│   ├── Nav.tsx
│   ├── home/FeatureCards.tsx
│   ├── tax/RefundAnalyzer.tsx
│   ├── tax/TaxGuide.tsx
│   └── legal/GuideSection.tsx
├── data/
│   ├── quiz.ts
│   ├── corpSteps.ts
│   ├── taxSections.ts
│   └── docs.ts
└── lib/
    └── download.ts
```

## 기술 스택

- **Next.js 15** (App Router)
- **TypeScript**
- **Anthropic Claude API** (서버사이드, API 키 노출 없음)
- **Vercel** 배포
