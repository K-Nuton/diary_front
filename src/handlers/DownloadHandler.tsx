import { SearchResponse } from "../utils/DiaryAPI";

export function downloadDiaries(json: SearchResponse): void {
  const result = window.confirm('日記JSONをダウンロードします');
  if (!result) return;

  addZero(json);
  const fileStr = JSON.stringify(json);

  const blob = new Blob(
    [fileStr],
    { "type": "text/plain" }
  );

  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = 'diaries.json';
  link.click();
}

function addZero(json: SearchResponse): void {
  const ADD = ".0";
  for (let i = 0, len = json.diaries.length; i < len; i++) {
    json.diaries[i].date += ADD;
    json.diaries[i].update_date += ADD;
  }
}