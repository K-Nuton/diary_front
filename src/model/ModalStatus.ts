const Modal = {
  OPEN: [true, null],
  CLOSE: [false, null],
  VIEW: [null, false],
  EDIT: [null, true],
  OPEN_WITH_VIEW: [true, false],
  OPEN_WITH_EDIT: [true, true],
  CLOSE_WITH_VIEW: [false, false]
} as const;
type Modal = typeof Modal[keyof typeof Modal];

export default Modal;