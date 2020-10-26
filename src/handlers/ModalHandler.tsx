import { SelectTarget } from "../hooks/DiaryHooks";
import { Diary } from "../model/Diary";
import DiaryAPI from "../utils/DiaryAPI";
import { OnSearch } from "./SearchHandler";

export default function getDiaryTemplate(
  inner_user_id: number,
  setFilter: (from: Date, to: Date, fromDisabled: boolean, toDisabled: boolean) => void,
  onSearch: OnSearch,
  setModalStatus: (open: boolean | null, edit: boolean | null) => void
): SelectTarget {
  const diary = getEmpty(inner_user_id);

  const saveHandler = getSaveHandler(diary, setFilter, onSearch, setModalStatus);
  const deleteHandler = getDeleteAndCancelHandler(setModalStatus);
  return {
    diary,
    saveHandler,
    deleteHandler,
    cancelHandler: deleteHandler
  }
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

function getSaveHandler(
  target: Diary,
  setFilter: (from: Date, to: Date, fromDisabled: boolean, toDisabled: boolean) => void,
  onSearch: OnSearch,
  setModalStatus: (open: boolean | null, edit: boolean | null) => void
): ({ date, wheather, feeling, text }: Diary) => Promise<void> {
  if (target.inner_user_id === undefined) throw new Error('ログインしなおしてください');

  return async ({ date, wheather, feeling, text} ) => {
    if (text.length < 10) {
      alert('本文は10文字以上入力してください');
      return;
    }

    const result = window.confirm('以下の内容で作成します')
    if (!result) return;

    try {
      await DiaryAPI.insert(
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
      onSearch("", date, date);
      setModalStatus(false, null);
    }
  }
}

function getDeleteAndCancelHandler(
  setModalStatus: (open: boolean | null, edit: boolean | null) => void
): () => Promise<void> {
  return async () => {
    const result = window.confirm('入力を破棄してもよろしいですか?');
    if (!result) return;

    setModalStatus(false, null);
  }
}