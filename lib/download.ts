import { DOCS } from "@/data/docs";

export function downloadDoc(filename: string) {
  const content = DOCS[filename] ?? `【${filename}】\n\n준비 중인 문서입니다.`;
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
