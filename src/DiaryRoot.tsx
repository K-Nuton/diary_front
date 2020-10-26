import React, { useCallback, useEffect, useState } from 'react';
import SearchBar, { useSearchBar } from './components/SearchBar';
import DiaryList from './components/DiaryList';
import { createStyles, Fab, makeStyles, Theme } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { Diary } from './model/Diary';
import DiaryModal, { useModal } from './components/DiaryModal';
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

  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [target, setTarget] = useState<Diary | null>(null);

  const [open, edit, setModalStatus] = useModal(false, false);

  const [resetPage, setResetPage] = useState(false);

  const [onSearch, dateFilter, setFilter] = useSearchBar(innerUserId, setDiaries);

  const onSelected = useCallback((target: Diary) => {
    // setEdit(false);
    setModalStatus(null, false);
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
        setFilter(date, date, false, true);
        onSearch("");
        setModalStatus(false, null);
      }
      
    };

    target.onDelete = async () => {
      const result = window.confirm('本当に削除していいですか?');
      if (!result) return;

      try {
        if (target.diary_id === undefined) return;
        await DiaryAPI.delete(target.diary_id);

        const toDate = new Date();
        setFilter(
          new Date(toDate.getFullYear(), toDate.getMonth()-2, toDate.getDate()),
          toDate,
          false,
          false
        );
        onSearch("");
        setModalStatus(false, null);
      } catch(e) {
        alert(`削除できませんでした。 詳細: ${e.message}`);
      }
    };

    target.onCancel = async () => {
      const result = window.confirm('変更を破棄します');
      if (!result) return;
      setModalStatus(false, null);
    }
    setTarget(target);
    setModalStatus(true, null);
  }, [onSearch, setModalStatus, setFilter]);

  // 初回検索
  useEffect(() => onSearch(""), []);

  const handleModalClose = useCallback(() => setModalStatus(false, null), []);

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
          setFilter(date, date, false, true);
          onSearch("");
          setModalStatus(false, null);
        }
      },
      onDelete: async () => {
        const result = window.confirm('入力を破棄してもよろしいですか?');
        if (!result) return;

        setModalStatus(false, null);
      },
      onCancel: async () => {
        const result = window.confirm('入力を破棄してもよろしいですか?');
        if (!result) return;
        
        setModalStatus(false, null);
      },
    };

    setTarget(emptyDiary);
    setModalStatus(true, true);
  }, [innerUserId, setModalStatus, onSearch, setFilter]);
  
  const toggleEdit = useCallback(
    (edit: boolean) => setModalStatus(null, edit), [setModalStatus]
  );
  return (  
    <>
      <SearchBar 
        onEnter={onSearch} 
        filter={dateFilter} 
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
        toggleEdit={toggleEdit} 
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