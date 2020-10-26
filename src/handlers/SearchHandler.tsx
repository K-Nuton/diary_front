import { Diary } from "../model/Diary";
import DiaryAPI from "../utils/DiaryAPI";

export default function getSearchHandler(
  inner_user_id: number,
  setFilter: (from: Date, to: Date, fromDisabled: boolean, toDisabled: boolean) => void,
  setModalStatus: (open: boolean | null, edit: boolean | null) => void,
  setDiaries: (value: React.SetStateAction<Diary[]>) => void,
  setPage: (value: React.SetStateAction<boolean>) => void,
  getDates: () => [Date | null, Date | null]
): (input: string) => Promise<void> {
  return async function onSearch(input: string): Promise<void> {
    const text: string | null = input === "" ? null : input;
    const [from, to] = getDates();
    console.log(from?.toLocaleDateString(), to?.toLocaleDateString());
    try {
      const diaries = await DiaryAPI.search(
        inner_user_id,
        text,
        from,
        to
      );

      diaries.forEach((diary) => addHandler(
        diary,
        setFilter,
        onSearch,
        setModalStatus
      ));

      setDiaries(diaries);
    } catch(e) {
      setDiaries([]);
    } finally {
      setPage(true);
      setPage(false)
    }
  };
}

function addHandler(
  target: Diary,
  setFilter: (from: Date, to: Date, fromDisabled: boolean, toDisabled: boolean) => void,
  onSearch: (input: string) => void,
  setModalStatus: (open: boolean | null, edit: boolean | null) => void
) {
  addSaveHandler(target, setFilter, onSearch, setModalStatus);
  addDeleteHandler(target, setFilter, onSearch, setModalStatus);
  addCancelHandler(target, setModalStatus);
}

function addSaveHandler(
  target: Diary,
  setFilter: (from: Date, to: Date, fromDisabled: boolean, toDisabled: boolean) => void,
  onSearch: (input: string) => void,
  setModalStatus: (open: boolean | null, edit: boolean | null) => void
): void {
  target.onSave = async ({ date, wheather, feeling, text }) => {
    const dateHasChanged = target.date.getTime() !== date.getTime();
    const wheatherHasChanged  = target.wheather !== wheather;
    const feelingHasChanged = target.feeling !== feeling;
    const textHasChanged = target.text !== text;

    if (!target.diary_id) return;
    if (!(dateHasChanged || wheatherHasChanged || feelingHasChanged || textHasChanged)) {
      alert('変更がありません');
      return;
    }

    if (text.length < 10) {
      alert('本文は10文字以上入力してください');
      return;
    }

    const result = window.confirm('更新します');
    if (!result) return;

    try {
      const result = await DiaryAPI.update(
        target.diary_id,
        dateHasChanged ? date : null,
        wheatherHasChanged ? wheather : null,
        feelingHasChanged ? feeling : null,
        textHasChanged ? text : null
      );
    } catch(e) {
      alert(`更新できませんでした。 詳細: ${e.message}`);
    } finally {
      setFilter(date, date, false, true);
      onSearch("");
      setModalStatus(false, null);
    }
  }
}

function addDeleteHandler(
  target: Diary,
  setFilter: (from: Date, to: Date, fromDisabled: boolean, toDisabled: boolean) => void,
  onSearch: (input: string) => void,
  setModalStatus: (open: boolean | null, edit: boolean | null) => void
): void {
  target.onDelete = async () => {
    const result = window.confirm('本当に削除していいですか?');
    if (!result) return;

    if (target.diary_id === undefined) return;
    try {
      await DiaryAPI.delete(target.diary_id);
  
    } catch(e) {
      alert(`削除できませんでした。 詳細: ${e.message}`);
    } finally {
      const to = new Date();
      setFilter(
        new Date(to.getFullYear(), to.getMonth()-2, to.getDate()),
        to, false, false
      );
      onSearch("");
      setModalStatus(false, null)
    }
  }
}

function addCancelHandler(
  target: Diary,
  setModalStatus: (open: boolean | null, edit: boolean | null) => void
): void {
  target.onCancel = async () => {
    const result = window.confirm('変更を破棄します');
    if (!result) return;
    setModalStatus(false, null);
  };
}
