import { RefObject, useCallback, useRef, useState } from "react";
import { SelectTarget } from "./DiaryHooks";

export type UseEditModal = {
  date: Date;
  wheather: number;
  feeling: number;
  textRef: RefObject<HTMLTextAreaElement>;
  handleDateChange: (date: any) => void;
  handleWChange: (event: React.ChangeEvent<{value: unknown;}>) => void;
  handleFChange: (event: React.ChangeEvent<{value: unknown;}>) => void;
  handleOnSave: () => void;
  handleOnClose: () => void;
  handleOnDelete: () => void
}
export default function useEditModal(selectTarget: SelectTarget): UseEditModal {
  const { diary, saveHandler, deleteHandler, cancelHandler } = selectTarget;

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

  const textRef = useRef<HTMLTextAreaElement>(null);

  const handleOnDelete = useCallback(() => {
    deleteHandler()
  }, [deleteHandler]);
  
  const handleOnSave = useCallback(() => {
    const text = textRef.current ? textRef.current.value : "";
    saveHandler({ date, wheather, feeling, text });
  }, [date, feeling, saveHandler, wheather]);

  const handleOnClose = useCallback(() => {
    cancelHandler();
  }, [cancelHandler]);

  return {
    date, 
    wheather, 
    feeling, 
    textRef,
    handleDateChange, 
    handleWChange, 
    handleFChange,
    handleOnDelete,
    handleOnSave,
    handleOnClose
  };
}