import { SearchResponse } from "../utils/DiaryAPI";

export function downloadDiaries(json: SearchResponse): void {
  const result = window.confirm('日記JSONをダウンロードします');
  if (!result) return;

  const fileStr = JSON.stringify(json);

  const blob = new Blob(
    [fileStr],
    {"type": "text/plain"}
  );

  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = 'diaries.json';
  link.click();
}