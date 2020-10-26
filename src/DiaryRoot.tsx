import React, { useCallback, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import DiaryList from './components/DiaryList';
import { createStyles, Fab, makeStyles, Theme } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { Diary } from './model/Diary';
import DiaryModal from './components/DiaryModal';
import { useDiaryList, useModal, useSearchBar } from './hooks/DiaryHooks';
import getSearchHandler from './handlers/SearchHandler';
import getDiaryTemplate from './handlers/ModalHandler';

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

  const [diaries, target, resetPage, setDiaries, setTarget, setResetPage] = useDiaryList();
  const [open, edit, setModalStatus] = useModal(false, false);
  const [filter, setFilter, getDates] = useSearchBar();

  const onSearch = useCallback(getSearchHandler(
    innerUserId,
    setFilter,
    setModalStatus,
    setDiaries,
    setResetPage,
    getDates
  ), []);

  const onSelected = useCallback((target: Diary) => {
    setTarget(target);
    setModalStatus(true, false);
  }, [setModalStatus, setTarget]);

  // 初回検索
  useEffect(() => {
    onSearch("")
  }, [onSearch]);

  const handleModalClose = useCallback(() => setModalStatus(false, null), []);

  const createNew = useCallback(() => {
    setTarget(getDiaryTemplate(
      innerUserId, setFilter, onSearch, setModalStatus
    ));
    setModalStatus(true, true);
  }, [innerUserId, setTarget, setModalStatus, setFilter, onSearch]);
  
  const toggleEdit = useCallback(
    (edit: boolean) => setModalStatus(null, edit), [setModalStatus]
  );
  return (  
    <>
      <SearchBar 
        onEnter={onSearch} 
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