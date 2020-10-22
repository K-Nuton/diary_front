import React, { useEffect, useState } from 'react';
import PrimarySearchAppBar from './components/SearchBar';
import DiaryList from './components/DiaryList';
import { createStyles, Fab, makeStyles, Theme } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import { Diary, RawDiary } from './model/Diary';
import DiaryModal from './components/DiaryModal';

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

const useStyles = makeStyles((theme: Theme) => 
  createStyles({
    addIcon: {
      position: 'fixed',
      right: '3%',
      bottom: '10%'
    }
  })
)

const DiaryRoot: React.FC = () => {
  const classes = useStyles();

  const [searchInput, setSearchInput] = useState('');
  const [fromDate, setFromDate] = useState<Date>(new Date());
  const [toDate, setToDate] = useState<Date>(new Date());
  const [fromDisabled, setFromActive] = useState(true);
  const [toDisabled, setToActive] = useState(true);
  const [edit, setEdit] = useState(false);

  const onEnter = (input: string) => {
    setSearchInput(input);
    console.log(input, fromDate, toDate)
  }

  const filter = {
    from: {
      date: fromDate,
      onChange: (date: MaterialUiPickersDate) => setFromDate(date as Date),
      onDisabled: (disabled: boolean) => setFromActive(disabled),
      disabled: fromDisabled
    },
    to: {
      date: toDate,
      onChange: (date: MaterialUiPickersDate) => setToDate(date as Date),
      onDisabled: (disabled: boolean) => setToActive(disabled),
      disabled: toDisabled
    },
    onClick: () => console.log(fromDate, toDate)
  }

  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [target, setTarget] = useState<Diary | null>(null);
  const onSelected = (target: Diary) => {
    setEdit(false);
    target.onSave = ({ date, wheather, feeling, text }: Diary) => {
      console.log(date, wheather, feeling, text);
    };

    target.onDelete = () => alert('本当に削除していいですか?');
    setTarget(target);
    setOpen(true);
  };

  useEffect(
    () => {
      (async () => {
        const res = await fetch('../1000.json');
        const rawDiaries: RawDiary[] = (await res.json()).diaries;
        setDiaries(rawDiaries.map(createRow))
      })();
    }, 
    []
  );

  const [open, setOpen] = useState(false);
  const handleModalClose = () => setOpen(false);

  const createNew = () => {
    const emptyDiary: Diary = {
      inner_user_id: 1000, // ここにログインで取得したものを設定する.
      date: new Date(),
      wheather: 0,
      feeling: 0,
      text: '',
      onSave: ({ date, wheather, feeling, text }: Diary) => {
        console.log(date, wheather, feeling, text)
      },
      onDelete: () => setOpen(false),
      onCancel: () => setOpen(false)
    } as const;

    setEdit(true);
    setTarget(emptyDiary);
    setOpen(true);
  }
  
  return (  
    <>
      <PrimarySearchAppBar onEnter={onEnter} filter={filter} />
      <DiaryList diaries={diaries} target={target} onSelected={onSelected}/>
      <DiaryModal diary={target} open={open} edit={edit} toggleEdit={setEdit} onClose={handleModalClose}/>
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