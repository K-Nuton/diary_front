import React, { useCallback, useEffect, useState } from 'react';
import SearchBar from './components/SearchBar';
import DiaryList from './components/DiaryList';
import { createStyles, Fab, makeStyles, Theme } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import { Diary } from './model/Diary';
import DiaryModal from './components/DiaryModal';
import DiaryBody from './model/DiaryBody';
import encodeDate from './utils/TimeUtils';

import DiaryAPI from './utils/DiaryAPI';

const useStyles = makeStyles((theme: Theme) => 
  createStyles({
    addIcon: {
      position: 'fixed',
      right: '3%',
      bottom: '10%'
    }
  })
);

type DiaryRoot = {
  innerUserId: number;
  userInfo: {
    userName: string;
    onLogout: () => void;
  }
};
const DiaryRoot: React.FC<DiaryRoot> = ({ innerUserId, userInfo }) => {
  const classes = useStyles();

  const [searchInput, setSearchInput] = useState('');

  const [toDate, setToDate] = useState<Date>(new Date());
  const [fromDate, setFromDate] = useState<Date>(
    new Date(toDate.getFullYear(), toDate.getMonth()-2, toDate.getDate())
  );

  const [fromDisabled, setFromDisabled] = useState(false);
  const [toDisabled, setToDisabled] = useState(false);

  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [target, setTarget] = useState<Diary | null>(null);

  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(false);

  const [resetPage, setResetPage] = useState(false);

  const onEnter = useCallback((input: string) => {
    setSearchInput(input);
    console.log(input, fromDate, toDate)
  }, [fromDate, toDate]);

  const filter = {
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
  }

  const onSelected = useCallback((target: Diary) => {
    setEdit(false);
    target.onSave = async ({ date, wheather, feeling, text }: Diary) => {
      const uDate = target.date.getTime() === date.getTime() ? null : date;
      const uWheather = target.wheather === wheather ? null : wheather;
      const uFeeling = target.feeling === feeling ? null : feeling;
      const uText = target.text === text ? null : text;

      if (!target.diary_id) return;
      if (!(uDate || uWheather || uFeeling || uText)) {
        alert('更新する変更がありません');
        return;
      }

      if (text.length < 10) {
        alert('本文は10文字以上入力してください');
        return;
      }

      const result = window.confirm('更新します');
      if (!result) return;

      const body = {
        diary_id: target.diary_id,
        date: uDate ? encodeDate(date) : null,
        wheather: uWheather,
        feeling: uFeeling,
        text: uText
      }
      
      try {
        if (target.diary_id === undefined) return;
        const result = await DiaryAPI.update(
          target.diary_id,
          uDate,
          uWheather,
          uFeeling,
          uText
        );
      } catch(e) {
        alert(`更新できませんでした。 詳細: ${e.message}`);
      } finally {
        setFromDisabled(false);
        setToDisabled(true);
        setFromDate(date);
        setToDate(date);
        setOpen(false);
      }
      
    };

    target.onDelete = async () => {
      const result = window.confirm('本当に削除していいですか?');
      if (!result) return;

      try {
        if (target.diary_id === undefined) return;
        await DiaryAPI.delete(target.diary_id);

        setFromDisabled(false);
        setToDisabled(false);
        setToDate(new Date());
        setFromDate(new Date(toDate.getFullYear(), toDate.getMonth()-2, toDate.getDate()));
        setOpen(false);
      } catch(e) {
        alert(`削除できませんでした。 詳細: ${e.message}`);
      }
    };

    target.onCancel = async () => {
      const result = window.confirm('変更を破棄します');
      if (!result) return;
      setOpen(false);
    }
    setTarget(target);
    setOpen(true);
  }, [toDate]);

  const searchBody = useCallback(async (
    inner_user_id: number,
    searchInput: string | null,
    fromDate: Date | null,
    toDate: Date | null
  ) => {
    setResetPage(true);

    try {
      const diaries = await DiaryAPI.search(
        inner_user_id,
        searchInput,
        fromDate,
        toDate
      );
      setDiaries(diaries.reverse());
    } catch (e) {
      setDiaries([]);
    } finally {
      setResetPage(false);
    }
  }, []);

  // 検索用
  useEffect(
    () => {  
      searchBody(
        innerUserId,
        searchInput || null,
        fromDisabled ? null : fromDate,
        toDisabled ? null : toDate
      );
    }, 
    [innerUserId, searchInput, fromDate, toDate, fromDisabled, toDisabled, searchBody]
  );

  const handleModalClose = useCallback(() => setOpen(false), []);

  const createNew = useCallback(() => {
    const emptyDiary: Diary = {
      inner_user_id: innerUserId, // ここにログインで取得したものを設定する.
      date: new Date(),
      wheather: 0,
      feeling: 0,
      text: '',
      onSave: async ({ date, wheather, feeling, text }: Diary) => {
        if (text.length < 10) {
          alert('本文は10文字以上入力してください');
          return;
        }

        const result = window.confirm('以下の内容で作成します。');
        if (!result) return;

        try {
          const result = await DiaryAPI.insert(
            innerUserId,
            date,
            wheather,
            feeling,
            text
          );
        } catch(e) {
          alert(`作成できませんでした。 詳細: ${e.message}`);
        } finally {
          setFromDisabled(false);
          setToDisabled(true);
          setFromDate(date);
          setToDate(date);
          setOpen(false);
        }
      },
      onDelete: async () => {
        const result = window.confirm('入力を破棄してもよろしいですか?');
        if (!result) return;

        setOpen(false)
      },
      onCancel: async () => {
        const result = window.confirm('入力を破棄してもよろしいですか?');
        if (!result) return;
        
        setOpen(false)
      },
    };

    setEdit(true);
    setTarget(emptyDiary);
    setOpen(true);
  }, [innerUserId]);
  
  return (  
    <>
      <SearchBar 
        onEnter={onEnter} 
        filter={filter} 
        userInfo={userInfo}
      />
      <DiaryList 
        diaries={diaries} 
        onSelected={onSelected} 
        pageReset={resetPage} 
      />
      <DiaryModal 
        diary={target} 
        open={open} 
        edit={edit} 
        toggleEdit={setEdit} 
        onClose={handleModalClose}
      />
      <Fab 
        color='primary' 
        aria-label='add' 
        className={classes.addIcon}
        onClick={createNew}
      >
        <AddIcon />
      </Fab>
    </>
  ); 
};

export default DiaryRoot;