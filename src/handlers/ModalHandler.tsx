import { Diary } from "../model/Diary";
import DiaryAPI from "../utils/DiaryAPI";

export default function getDiaryTemplate(
  inner_user_id: number,
  setFilter: (from: Date, to: Date, fromDisabled: boolean, toDisabled: boolean) => void,
  onSearch: (input: string) => void,
  setModalStatus: (open: boolean | null, edit: boolean | null) => void
): Diary {
  const diary = getEmpty(inner_user_id);
  addHandler(diary, setFilter, onSearch, setModalStatus);

  return diary;
}

function getEmpty(inner_user_id: number): Diary {
  return {
    inner_user_id,
    date: new Date(),
    wheather: 0,
    feeling: 0,
    text: '',
  }
}

function addHandler(
  target: Diary,
  setFilter: (from: Date, to: Date, fromDisabled: boolean, toDisabled: boolean) => void,
  onSearch: (input: string) => void,
  setModalStatus: (open: boolean | null, edit: boolean | null) => void
): void {
  addSaveHandler(target, setFilter, onSearch, setModalStatus);
  target.onDelete = addDeleteAndCancelHandler(setModalStatus);
  target.onCancel = addDeleteAndCancelHandler(setModalStatus);
}

function addSaveHandler(
  target: Diary,
  setFilter: (from: Date, to: Date, fromDisabled: boolean, toDisabled: boolean) => void,
  onSearch: (input: string) => void,
  setModalStatus: (open: boolean | null, edit: boolean | null) => void
): void {
  if (target.inner_user_id === undefined) return;

  target.onSave = async ({ date, wheather, feeling, text} ) => {
    if (text.length < 10) {
      alert('本文は10文字以上入力してください');
      return;
    }

    const result = window.confirm('以下の内容で作成します')
    if (!result) return;

    try {
      const result = await DiaryAPI.insert(
        target.inner_user_id as number,
        date,
        wheather,
        feeling,
        text
      );

    } catch(e) {
      alert(`作成できませんでした。 詳細: ${e.message}`);

    } finally {
      setFilter(date, date, false, true);
      onSearch("");
      setModalStatus(false, null);
    }
  }
}

function addDeleteAndCancelHandler(
  setModalStatus: (open: boolean | null, edit: boolean | null) => void
): () => Promise<any> {
  return async () => {
    const result = window.confirm('入力を破棄してもよろしいですか?');
    if (!result) return;

    setModalStatus(false, null);
  }
}