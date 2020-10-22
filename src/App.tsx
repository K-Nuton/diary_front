import React from 'react';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import jaLocale from 'date-fns/locale/ja'

import DiaryRoot from './DiaryRoot';

function App() {
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={jaLocale}>
      <DiaryRoot />
    </MuiPickersUtilsProvider>
  );
}

export default App;
