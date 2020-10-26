import { createStyles, FormControl, InputBase, makeStyles, MenuItem, Modal, Select, Theme } from '@material-ui/core';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import React from 'react';
import { DateTimePicker } from '@material-ui/pickers';

import Fab from '@material-ui/core/Fab';
import EditIcon from '@material-ui/icons/Edit';
import NavigationIcon from '@material-ui/icons/Navigation';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

import {
  Diary, Wheather, Feeling, decodeWheather, decodeFeeling
} from '../model/Diary';
import useEditModal from '../hooks/EditModalHooks';
import { SelectTarget } from '../hooks/DiaryHooks';

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

type DiaryModal = {
  selectTarget: SelectTarget;
  open: boolean;
  edit: boolean;
  enterEdit: () => void;
  onClose: () => void;
}
export default function DiaryModal({ selectTarget, open, edit, enterEdit, onClose }: DiaryModal): JSX.Element {
  const classes = useStyles();

  const normalBody = (
    <ViewBody
      diary={selectTarget.diary}
      onClick={enterEdit}
    />
  );

  const editBody = (
    <EditBody
      selectTarget={selectTarget}
    />
  );
  
  return (
    <Modal
      aria-labelledby='transition-modal-title'
      aria-describedby='transition-modal-description'
      disableBackdropClick={edit}
      className={classes.modal}
      open={open}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open} disableStrictModeCompat>
        <>
          {edit ? editBody : normalBody}
        </>
      </Fade>
    </Modal>
  );
}

type ViewBody = {
  diary: Diary;
  onClick: () => void;
}
export function ViewBody({ diary, onClick }: ViewBody) {
  const classes = useStyles();

  return (
    <div className={classes.paper}>
      <h2 id='transition-modal-title'>
        {diary.date.toLocaleString() + " " + decodeWheather(diary.wheather) + " " + decodeFeeling(diary.feeling)}
      </h2>
      <p id='transition-modal-description' className={classes.textOverFlow}>{diary.text}</p>
      <div className={classes.enterEdit}>
        <Fab color="secondary" aria-label="edit" size='medium' onClick={onClick}>
          <EditIcon />
        </Fab>
      </div>
    </div>
  );
}

type EditBody = {
  selectTarget: SelectTarget;
}
export function EditBody({ selectTarget }: EditBody) {
  const classes = useStyles();
  const { diary } = selectTarget;
  const { 
    date, wheather, feeling, textRef,
    handleDateChange, handleWChange, handleFChange,
    handleOnSave, handleOnClose, handleOnDelete
  } = useEditModal(selectTarget);

  return (
    <div className={classes.paper}>
      <DateTimePicker 
        value={date} 
        variant='inline'
        onChange={handleDateChange}
        ampm={false}
        disableFuture
        format='yyyy/MM/dd HH:mm'
      />
      <FormControl >
        <Select 
          value={wheather}
          onChange={handleWChange}
        > 
          <MenuItem value={Wheather.SUNNY}>
            <span role='img' aria-label='sunny'>{decodeWheather(Wheather.SUNNY)}</span>
          </MenuItem>
          <MenuItem value={Wheather.CLOUDY}>
            <span role='img' aria-label='cloudy'>{decodeWheather(Wheather.CLOUDY)}</span>
          </MenuItem>
          <MenuItem value={Wheather.RAINY}>
            <span role='img' aria-label='rainy'>{decodeWheather(Wheather.RAINY)}</span>
          </MenuItem>
          <MenuItem value={Wheather.THUNDER}>
            <span role='img' aria-label='thunder'>{decodeWheather(Wheather.THUNDER)}</span>
          </MenuItem>
          <MenuItem value={Wheather.SNOW}>
            <span role='img' aria-label='snow'>{decodeWheather(Wheather.SNOW)}</span>
          </MenuItem>
          <MenuItem value={Wheather.WIND}>
            <span role='img' aria-label='wind'>{decodeWheather(Wheather.WIND)}</span>
          </MenuItem>
        </Select>
      </FormControl>
      <FormControl>
        <Select
          value={feeling}
          onChange={handleFChange}
        >
          <MenuItem value={Feeling.HAPPY}>
            <span role='img' aria-label='happy'>{decodeFeeling(Feeling.HAPPY)}</span>
          </MenuItem>
          <MenuItem value={Feeling.NORMAL}>
            <span role='img' aria-label='normal'>{decodeFeeling(Feeling.NORMAL)}</span>
          </MenuItem>
          <MenuItem value={Feeling.LIT_SAD}>
            <span role='img' aria-label='little-bit-sad'>{decodeFeeling(Feeling.LIT_SAD)}</span>
          </MenuItem>
          <MenuItem value={Feeling.SAD}>
            <span role='img' aria-label='sad'>{decodeFeeling(Feeling.SAD)}</span>
          </MenuItem>
          <MenuItem value={Feeling.ANGRY}>
            <span role='img' aria-label='angry'>{decodeFeeling(Feeling.ANGRY)}</span>
          </MenuItem>
        </Select>
      </FormControl>
      <InputBase
        inputRef={textRef}
        className={classes.editTextMargin}
        rows={20}
        defaultValue={diary.text}
        multiline
        fullWidth
        rowsMax={20}
        inputProps={{ 'aria-label': 'naked' }}
      />
      <div className={classes.editButtonWrapper}>
        <div className={classes.delete}>
          <IconButton
            onClick={handleOnDelete}
            aria-label="delete"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </div>
        <div className={classes.close}>
          <Fab
            onClick={handleOnSave}
            variant="extended"
            size="medium"
            color="primary"
            aria-label="add"
          >
            <NavigationIcon />
            保存
          </Fab>
          <IconButton 
            aria-label='close' 
            onClick={handleOnClose}
          >
            <CloseIcon fontSize='small'/>
          </IconButton>
        </div>
      </div>
    </div>
  );
}
