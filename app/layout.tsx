import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";

export const metadata: Metadata = {
  title: "세무마스터 | 세무사·법무사 없이 직접 해결",
  description: "경정청구, 절세 전략, 법인·협동조합 설립을 AI와 함께 직접 처리하세요.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <Nav />
        <main>{children}</main>
      </body>
    </html>
  );
}
