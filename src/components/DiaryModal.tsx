import { createStyles, FormControl, InputBase, makeStyles, MenuItem, Modal, Select, Theme } from '@material-ui/core';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import React, { useCallback, useState } from 'react';
import { DateTimePicker } from '@material-ui/pickers';

import Fab from '@material-ui/core/Fab';
import EditIcon from '@material-ui/icons/Edit';
import NavigationIcon from '@material-ui/icons/Navigation';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    paper: {
      position: 'relative',
      backgroundColor: theme.palette.background.paper,
      width: '80%',
      maxWidth: '768px',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
      borderRadius: '10px',
      '& h2, p': {
        cursor: 'default'
      }
    },
    enterEdit: {
      position: 'relative',
      display: 'flex',
      justifyContent: 'flex-end',
      marginTop: '1%'
    },
    textOverFlow: {
      width: '100%',
      margin: 0,
      maxHeight: '50vh',
      overflow: 'auto'
    },
    editTextMargin: {
      marginTop: '1%',
    },
    editButtonWrapper: {
      width: '100%',
      display: 'flex',
      justifyContent: 'space-evenly'
    },
    delete: {
      width: '50%'
    },
    close: {
      width: '50%',
      display: 'flex',
      justifyContent: 'flex-end',
      '& button': {
        marginLeft: '1%'
      }
    }
  }),
);

type Diary = {
  date: string;
  wheather: string;
  text: string;
};
type DiaryModal = {
  diary: Diary | null;
  isOpen: boolean;
  onClose: () => void;
}
export default function DiaryModal({ diary, isOpen, onClose }: DiaryModal): JSX.Element {
  const classes = useStyles();
  const [edit, setEdit] = useState(false);

  const handleClose = () => {
    onClose();
    setEdit(false);
  };

  const enterEdit = useCallback(() => setEdit(true), []);
  const exitEdit = useCallback(() => setEdit(false), []);

  const normalBody = (
    <TestBody
      date={diary ? diary.date : ''}
      wheather={diary ? diary.wheather : new Date().toISOString()}
      text={diary ? diary.text : ''}
      onClick={enterEdit}
    />
  );

  const editBody = (
    <TestEditBody
      date={diary ? diary.date : ''}
      wheather={diary ? diary.wheather : new Date().toISOString()}
      text={diary ? diary.text : ''}
      onClose={exitEdit}
    />
  );

  return (
    <Modal
      aria-labelledby='transition-modal-title'
      aria-describedby='transition-modal-description'
      disableBackdropClick={edit}
      className={classes.modal}
      open={isOpen}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <>
      <Fade in={isOpen}>
        {edit ? editBody : normalBody}
      </Fade>
      </>
    </Modal>
  );
}

type Normal = {
  date: string,
  wheather: string,
  text: string,
  onClick: () => void
}
export function TestBody({ date, wheather, text, onClick }: Normal) {
  const classes = useStyles();

  return (
    <div className={classes.paper}>
      <h2 id='transition-modal-title'>{date + " " + wheather}</h2>
      <p id='transition-modal-description' className={classes.textOverFlow}>{text}</p>
      <div className={classes.enterEdit}>
        <Fab color="secondary" aria-label="edit" size='medium' onClick={onClick}>
          <EditIcon />
        </Fab>
      </div>
    </div>
  );
}

type Edit = {
  date: string;
  wheather: string;
  text: string;
  onClose: () => void;
}
export function TestEditBody({date, wheather, text, onClose}: Edit) {
  const classes = useStyles();
  const [stateDate, setDate] = useState(new Date(date));
  const handleDateChange = useCallback((date) => setDate(date), []);

  const [wSelect, setWheather] = useState(0);
  const handleWChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setWheather(event.target.value as number);
  };

  const [feeling, setFeeling] = useState(0);
  const handleFChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setFeeling(event.target.value as number);
  };

  return (
    <div className={classes.paper}>
      <DateTimePicker value={stateDate} onChange={handleDateChange}/>
      <FormControl >
        <Select 
          value={wSelect}
          onChange={handleWChange}
        >
          <MenuItem value={0}>
            <span role='img' aria-label='sunny'>🔆</span>
          </MenuItem>
          <MenuItem value={1}>
            <span role='img' aria-label='cloudy'>☁</span>
          </MenuItem>
          <MenuItem value={2}>
            <span role='img' aria-label='rainy'>☔</span>
          </MenuItem>
          <MenuItem value={3}>
            <span role='img' aria-label='thunder'>⚡</span>
          </MenuItem>
          <MenuItem value={4}>
            <span role='img' aria-label='snow'>⛄</span>
          </MenuItem>
          <MenuItem value={5}>
            <span role='img' aria-label='wind'>🌀</span>
          </MenuItem>
        </Select>
      </FormControl>
      <FormControl>
        <Select
          value={feeling}
          onChange={handleFChange}
        >
          <MenuItem value={0}>
            <span role='img' aria-label='happy'>😀</span>
          </MenuItem>
          <MenuItem value={1}>
            <span role='img' aria-label='normal'>😐</span>
          </MenuItem>
          <MenuItem value={2}>
            <span role='img' aria-label='little-bit-sad'>😥</span>
          </MenuItem>
          <MenuItem value={3}>
            <span role='img' aria-label='sad'>😭</span>
          </MenuItem>
          <MenuItem value={4}>
            <span role='img' aria-label='angry'>😡</span>
          </MenuItem>
        </Select>
      </FormControl>
      <InputBase
        className={classes.editTextMargin}
        rows={20}
        defaultValue={text}
        multiline
        fullWidth
        rowsMax={20}
        inputProps={{ 'aria-label': 'naked' }}
      />
      <div className={classes.editButtonWrapper}>
        <div className={classes.delete}>
          <IconButton aria-label="delete">
            <DeleteIcon fontSize="small" />
          </IconButton>
        </div>
        <div className={classes.close}>
          <Fab
            variant="extended"
            size="medium"
            color="primary"
            aria-label="add"
          >
            <NavigationIcon />
            保存
          </Fab>
          <IconButton aria-label='close' onClick={onClose}>
            <CloseIcon fontSize='small'/>
          </IconButton>
        </div>
      </div>
    </div>
  );
}