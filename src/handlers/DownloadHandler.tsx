import { Diary, RawDiary } from "../model/Diary";
import encodeDate from "../utils/TimeUtils";

export function downloadDiaries(diaries: Diary[]): void {
  const raws = [...diaries].reverse().map(encodeDiary2Raw);

  const fileStr = JSON.stringify({diaries: raws});

  const blob = new Blob(
    [fileStr],
    {"type": "text/plain"}
  );

  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = 'diaries.json';
  link.click();
}

function encodeDiary2Raw(diary: Diary): RawDiary {
  return {
    inner_user_id: diary.inner_user_id || 0,
    diary_id: diary.diary_id || 0,
    date: encodeDate(diary.date),
    update_date: encodeDate(diary.update_date || new Date()),
    wheather: diary.wheather,
    feeling: diary.feeling,
    text: diary.text
  }
}