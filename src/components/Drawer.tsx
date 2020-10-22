import React from 'react';
import { createStyles, Drawer, makeStyles, Theme, } from '@material-ui/core';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import { DatePicker } from '@material-ui/pickers';

const useStyles = makeStyles((theme: Theme) => 
  createStyles({
    wrapper: {
      // display: 'flex',
      // justifyContent: 'center'
    },
    picker: {
      padding: '5%'
    }
  })
)
type DiaryDrawer = {
  isOpen: boolean;
  onClose: ((event: {}, reason: "backdropClick" | "escapeKeyDown") => void);
  from: Date;
  to: Date;
  fromChange: (date: MaterialUiPickersDate) => void;
  toChange: (date: MaterialUiPickersDate) => void;
};
const DiaryDrawer: React.FC<DiaryDrawer> = ({ isOpen, onClose, from, to, fromChange, toChange }) => {
  const classes = useStyles();

  return (
    <Drawer 
      anchor='left'
      open={isOpen}
      onClose={onClose}
    >
      <div className={classes.wrapper}>
      <DatePicker 
        format='yyyy年MMMd日'
        disableFuture={true}
        disableToolbar={true}
        value={from}
        onChange={fromChange}
        variant='inline'
      />
      <DatePicker 
        disableFuture={true}
        disableToolbar={true}
        value={to}
        onChange={toChange}
        variant='inline'
      />
      </div>
    </Drawer>
  );
};

export default DiaryDrawer;