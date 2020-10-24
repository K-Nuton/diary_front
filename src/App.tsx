import React, { useCallback, useState } from 'react';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import jaLocale from 'date-fns/locale/ja'

import DiaryRoot from './DiaryRoot';
import Login from './Login';

function App() {
  const [innerUserId, setInnerUserId] = useState<null | number>(null);
  const [userName, setUserName] = useState<null | string>(null);

  const onLogin = async (userId: string) => {
    if (!userId) {
      alert('ユーザーIDを入力してください');
      return;
    }

    try {
      const res = await fetch(`../web_diary/user/${userId}`);
      const userInfo = await res.json();
      if (userInfo.error) {
        alert(`ログインできませんでした。 詳細: ${userInfo.error.message}`);
        return;
      }
      setInnerUserId(userInfo.inner_user_id);
      setUserName(userInfo.user_name);
    } catch(e) {
      alert(`ログインできませんでした。詳細: ${e.message}`);
    }
  };

  const onLogout = useCallback(() => setInnerUserId(null), []);

  return (
    <>
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
    </>
  );
}

export default App;
