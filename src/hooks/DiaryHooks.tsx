import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import React, { useState } from 'react';
import { Filter } from '../components/SearchBar';
import { Diary, Feeling, Wheather } from '../model/Diary';
import { SearchResponse } from '../utils/DiaryAPI';
import { fixDate } from '../utils/TimeUtils';

export type SelectTarget = {
  diary: Diary;
  saveHandler: ({ date, wheather, feeling, text }: Diary) => Promise<void>;
  deleteHandler: () => Promise<void>;
  cancelHandler: () => Promise<void>;
};

export function useDiaryList(): [
  Diary[],
  SearchResponse,
  SelectTarget,
  boolean,
  React.Dispatch<React.SetStateAction<Diary[]>>,
  React.Dispatch<React.SetStateAction<SearchResponse>>,
  React.Dispatch<React.SetStateAction<SelectTarget>>,
  React.Dispatch<React.SetStateAction<boolean>>
] {
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [original, setOriginal] = useState<SearchResponse>({ diaries: [] });

  const [target, setTarget] = useState<SelectTarget>({
    diary: {
      date: new Date(),
      wheather: Wheather.SUNNY,
      feeling: Feeling.HAPPY,
      text: ''
    },
    saveHandler: async ({ date, wheather, feeling, text }) => {return},
    deleteHandler: async () => {return},
    cancelHandler: async () => {return}
  });
  const [resetPage, setResetPage] = useState(false);

  return [diaries, original, target, resetPage, setDiaries, setOriginal, setTarget, setResetPage];
}

export function useModal(init_open: boolean, init_edit: boolean): [
  boolean,
  boolean,
  (open: boolean | null, edit: boolean | null) => void
] {
  const [open, setOpen] = useState(init_open);
  const [edit, setEdit] = useState(init_edit);

  function setModalStatus(open: boolean | null, edit: boolean | null) {
    open !== null ? setOpen(open) : void(0);
    edit !== null ? setEdit(edit) : void(0);
  }

  return [open, edit, setModalStatus];
}

type useSearchBar = [
  Filter,
  (
    from: Date,
    to: Date,
    fromDisabled: boolean,
    toDisabled: boolean
  ) => void,
  () => [Date|null, Date|null]
];
export function useSearchBar(): useSearchBar {
  const [toDate, setToDate] = useState<Date>(new Date());
  const [fromDate, setFromDate] = useState<Date>(
    new Date(toDate.getFullYear(), toDate.getMonth()-2, toDate.getDate())
  );

  const [fromDisabled, setFromDisabled] = useState(false);
  const [toDisabled, setToDisabled] = useState(false);

  function setFilter(
    from: Date,
    to: Date,
    fromDisabled: boolean,
    toDisabled: boolean
  ): void {
    setFromDate(fixDate(from, true));
    setToDate(fixDate(to, false));
    setFromDisabled(fromDisabled);
    setToDisabled(toDisabled);
  }

  const filter: Filter = {
    from: {
      date: fromDate,
      onChange: (date: MaterialUiPickersDate) => setFromDate(date as Date),
      onDisabled: (disabled: boolean) => setFromDisabled(disabled),
      disabled: fromDisabled
    },
    to: {
      date: toDate,
      onChange: (date: MaterialUiPickersDate) => setToDate(date as Date),
      onDisabled: (disabled: boolean) => setToDisabled(disabled),
      disabled: toDisabled
    }
  };

  function getDates(): [Date|null, Date|null] {
    return [fromDisabled ? null : fromDate, toDisabled ? null : toDate];
  }

  return [filter, setFilter, getDates];
}

