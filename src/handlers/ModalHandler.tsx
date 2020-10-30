import { SelectTarget } from "../hooks/DiaryHooks";
import { Diary } from "../model/Diary";
import DiaryAPI from "../utils/DiaryAPI";
import { getHandler, OnSearch } from "./SearchHandler";

export default function getDiaryTemplate(
  inner_user_id: number,
  onSearch: OnSearch,
  setFilter: (from: Date, to: Date, fromDisabled: boolean, toDisabled: boolean) => void,
  setModalStatus: (open: boolean | null, edit: boolean | null) => void,
  setTarget: React.Dispatch<React.SetStateAction<SelectTarget>>
): SelectTarget {
  const diary = getEmpty(inner_user_id);

  const saveHandler = getSaveHandler(diary, onSearch, setFilter, setModalStatus, setTarget);
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
  onSearch: OnSearch,
  setFilter: (from: Date, to: Date, fromDisabled: boolean, toDisabled: boolean) => void,
  setModalStatus: (open: boolean | null, edit: boolean | null) => void,
  setTarget: React.Dispatch<React.SetStateAction<SelectTarget>>
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
      const result = await DiaryAPI.insert(
        target.inner_user_id as number,
        date,
        wheather,
        feeling,
        text
      );
      
      setTarget(getHandler(
        result,
        onSearch,
        setFilter,
        setModalStatus,
        setTarget
      ));

    } catch(e) {
      alert(`作成できませんでした。 詳細: ${e.message}`);

    } finally {
      const from = new Date(date.getFullYear(), date.getMonth() - 2, date.getDate());
      setFilter(from, date, false, false);
      onSearch("", from, date);
      setModalStatus(true, false);
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