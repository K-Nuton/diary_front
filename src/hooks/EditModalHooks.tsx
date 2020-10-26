import { RefObject, useCallback, useRef, useState } from "react";
import { Diary } from "../model/Diary";

export type UseEditModal = {
  date: Date;
  wheather: number;
  feeling: number;
  textRef: RefObject<HTMLTextAreaElement>;
  buttonDisabled: boolean;
  handleDateChange: (date: any) => void;
  handleWChange: (event: React.ChangeEvent<{value: unknown;}>) => void;
  handleFChange: (event: React.ChangeEvent<{value: unknown;}>) => void;
  handleOnDelete: () => void
  handleOnSave: () => void
  handleOnClose: () => void
}
export default function useEditModal(diary: Diary): UseEditModal {
  const [date, setDate] = useState(diary.date);
  const handleDateChange = useCallback((date) => setDate(date), []);

  const [wheather, setWheather] = useState(diary.wheather);
  const handleWChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setWheather(event.target.value as number);
  };
  
  const [feeling, setFeeling] = useState(diary.feeling);
  const handleFChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setFeeling(event.target.value as number);
  };

  const [buttonDisabled, setButtonDisabled] = useState(false);

  const textRef =  useRef<HTMLTextAreaElement>(null);
  const handleOnSave = () => {
    const text = textRef.current ? textRef.current.value : '';
    if (!diary.onSave) return;

    setButtonDisabled(true);
    diary.onSave({ date, wheather, feeling, text})
      .then(() => setButtonDisabled(false));
  };

  const handleOnDelete = () => {
    if (!diary.onDelete) return;

    setButtonDisabled(true);
    diary.onDelete()
      .then(() => setButtonDisabled(false));
  };

  const handleOnClose = () => {
    if (!diary.onCancel) return;

    setButtonDisabled(true);
    diary.onCancel()
      .then(() => setButtonDisabled(false));
  };

  return {
    date, 
    wheather, 
    feeling, 
    textRef, 
    buttonDisabled, 
    handleDateChange, 
    handleWChange, 
    handleFChange, 
    handleOnDelete,
    handleOnSave, 
    handleOnClose 
  };
}