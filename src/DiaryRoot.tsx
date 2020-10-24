import React, { useCallback, useEffect, useState } from 'react';
import SearchBar from './components/SearchBar';
import DiaryList from './components/DiaryList';
import { createStyles, Fab, makeStyles, Theme } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import { Diary, RawDiary } from './model/Diary';
import DiaryModal from './components/DiaryModal';
import DiaryBody from './model/DiaryBody';
import encodeDate from './utils/TimeUtils';

const useStyles = makeStyles((theme: Theme) => 
  createStyles({
    addIcon: {
      position: 'fixed',
      right: '3%',
      bottom: '10%'
    }
  })
);

function createRow({ 
  inner_user_id,
  diary_id,
  date,
  update_date,
  wheather,
  feeling,
  text
 }: RawDiary): Diary {
  return {
    inner_user_id,
    diary_id,
    date: new Date(date),
    update_date: new Date(update_date),
    wheather,
    feeling,
    text
  };
}

async function search(body: DiaryBody): Promise<Diary[]> {
  const res = await fetch(
    '../web_diary/search',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: body.toString()
    }
  );

  const json = await res.json();
  if (json.error) throw new Error(json.error.message);

  const raws: RawDiary[] = json.diaries;

  return raws.map(createRow);
}

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
        const res = await fetch(
          '../web_diary/diary',
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(body, (_, v) => v || undefined)
          }
        );
        const json = await res.json();

        if (json.error) {
          alert(`更新できませんでした。 詳細: ${json.error.message}`);
        }
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
        const res = await fetch(
          `../web_diary/diary/${target.diary_id}`,
          { method: 'DELETE' }
        );

        const status = res.status;
        if (status !== 204) {
          alert(`削除できませんでした。 詳細: ${status}`);
          return;
        }

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

  const searchBody = useCallback(async (body: DiaryBody) => {
    setResetPage(true);

    try {
      const diaries = await search(body);
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
      const body = new DiaryBody(
        innerUserId,
        searchInput || null,
        fromDisabled ? null : fromDate,
        fromDisabled || toDisabled ? null : toDate
      );
  
      searchBody(body);
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

        const body = {
          inner_user_id: innerUserId,
          date: encodeDate(date),
          wheather: wheather,
          feeling: feeling,
          text: text
        };

        const result = window.confirm('以下の内容で作成します。');
        if (!result) return;

        try {
          const res = await fetch(
            '../web_diary/diary',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(body)
            }
          );
  
          const json = await res.json();

          if (json.error) {
            alert(`作成できませんでした。 詳細: ${json.error.message}`);
          }
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