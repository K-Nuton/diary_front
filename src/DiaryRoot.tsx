import React, { useCallback, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import DiaryList from './components/DiaryList';
import { createStyles, Fab, makeStyles, Theme } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { Diary } from './model/Diary';
import DiaryModal from './components/DiaryModal';
import { useDiaryList, useModal, useSearchBar } from './hooks/DiaryHooks';
import searchDiaries, { getHandler } from './handlers/SearchHandler';
import getDiaryTemplate from './handlers/ModalHandler';
import Modal from './model/ModalStatus';

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

  const [diaries, original, target, resetPage, setDiaries, setOriginal, setTarget, setResetPage] = useDiaryList();
  const [open, edit, setModalStatus] = useModal(...Modal.CLOSE_WITH_VIEW);
  const [filter, setFilter, getDates] = useSearchBar();

  const onSearch = useCallback(searchDiaries(
    innerUserId,
    setDiaries,
    setOriginal,
    setResetPage,
    getDates
  ), [innerUserId, setOriginal, setDiaries, setResetPage, getDates]);

  const onSelected = useCallback((target: Diary) => {
    setTarget(getHandler(
      target,
      onSearch,
      setFilter, 
      setModalStatus,
      setTarget
    ));
    setModalStatus(...Modal.OPEN_WITH_VIEW);
  }, [onSearch, setFilter, setModalStatus, setTarget]);

  const onReverse = useCallback((diaries: Diary[]) => setDiaries(([] as Diary[]).concat(diaries).reverse()), [setDiaries]);

  const handleModalClose = useCallback(() => setModalStatus(...Modal.CLOSE), [setModalStatus]);

  const createNew = useCallback(() => {
    setTarget(getDiaryTemplate(
      innerUserId, onSearch, setFilter, setModalStatus, setTarget
    ));
    setModalStatus(...Modal.OPEN_WITH_EDIT);
  }, [innerUserId, setTarget, setModalStatus, setFilter, onSearch]);
  
  const toggleEdit = useCallback(
    () => setModalStatus(...Modal.EDIT), [setModalStatus]
  );

  // 初回検索
  useEffect(() => {
    onSearch("")
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (  
    <>
      <SearchBar 
        onEnter={onSearch} 
        filter={filter} 
        userInfo={userInfo}
        json={original}
      />
      <DiaryList 
        diaries={diaries} 
        pageReset={resetPage}
        onSelected={onSelected} 
        onReverse={onReverse} 
      />
      <DiaryModal 
        selectTarget={target} 
        open={open} 
        edit={edit} 
        enterEdit={toggleEdit} 
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