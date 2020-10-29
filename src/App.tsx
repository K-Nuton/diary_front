import React from 'react';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import jaLocale from 'date-fns/locale/ja'

import DiaryRoot from './DiaryRoot';
import Login from './Login';
import useLogin from './hooks/LoginHooks';
import { ThemeProvider } from '@material-ui/core';
import theme from './utils/Theme';

function App() {
  const [innerUserId, userName, onLogin, onLogout] = useLogin();

  return (
    <ThemeProvider theme={theme}>
      {innerUserId ? (
        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={jaLocale}>
          <DiaryRoot 
            innerUserId={innerUserId} 
            userInfo={{
              userName: userName || '',
              onLogout: onLogout
            }}
          />
        </MuiPickersUtilsProvider>
      ):(
        <Login onLogin={onLogin} />
      )}
    </ThemeProvider>
  );
}

export default App;
