import React from 'react';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import jaLocale from 'date-fns/locale/ja'

import DiaryRoot from './DiaryRoot';
import Login from './Login';

function App() {
  return (
    <Login />
    // <MuiPickersUtilsProvider utils={DateFnsUtils} locale={jaLocale}>
    //   <DiaryRoot innerUserId={1000} />
    // </MuiPickersUtilsProvider>
  );
}

export default App;
