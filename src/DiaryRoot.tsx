import React, { useState } from 'react';
import PrimarySearchAppBar from './components/SearchBar';
import DiaryList from './components/DiaryList';
import { createStyles, Fab, makeStyles, Theme } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';

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
      onChange: (date: MaterialUiPickersDate) => setToDate(date ? date as Date : new Date()),
      onDisabled: (disabled: boolean) => setToActive(disabled),
      disabled: toDisabled
    },
    onClick: () => console.log(fromDate, toDate)
  }
  
  return (  
    <>
      <PrimarySearchAppBar onEnter={onEnter} filter={filter} />
      <DiaryList />
      <Fab color='primary' aria-label='add' className={classes.addIcon}>
        <AddIcon />
      </Fab>
    </>
  ); 
};

export default DiaryRoot;