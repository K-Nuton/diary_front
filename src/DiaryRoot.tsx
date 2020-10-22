import React, { useCallback, useState } from 'react';
import PrimarySearchAppBar from './components/SearchBar';
import DiaryDrawer from './components/Drawer';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import DiaryList from './components/DiaryList';
import { createStyles, Fab, makeStyles, Theme } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

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

  const [isOpen, drawerCloseHandler] = useState(false);
  const onClose = useCallback(() => drawerCloseHandler(false), []);
  const handleSearchBarClick = useCallback(() => drawerCloseHandler(true), []);

  const [fromDate, setFromDate] = useState(new Date());
  const handleFromChange = useCallback((date: MaterialUiPickersDate) => setFromDate(date as Date), []);

  const [toDate, setToDate] = useState(new Date());
  const handleToChange = useCallback((date: MaterialUiPickersDate) => setToDate(date as Date), []);
  
  return (  
    <>
      <PrimarySearchAppBar sideOnClick={handleSearchBarClick}/>
      <DiaryDrawer 
        isOpen={isOpen} 
        onClose={onClose}
        from={fromDate}
        to={toDate}
        fromChange={handleFromChange} 
        toChange={handleToChange}
      />
      <DiaryList />
      <Fab color='primary' aria-label='add' className={classes.addIcon}>
        <AddIcon />
      </Fab>
    </>
  ); 
};

export default DiaryRoot;