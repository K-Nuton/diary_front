import { useCallback, useState } from "react";

export default function useLogin(): [
  number | null,
  string | null,
  (userId: string) => Promise<void>,
  () => void
] {
  const [innerUserId, setInnerUserId] = useState<null | number>(null);
  const [userName, setUserName] = useState<null | string>(null);

  const onLogin = useCallback(async (userId: string) => {
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
  }, []);

  const onLogout = useCallback(() => setInnerUserId(null), []);

  return [innerUserId, userName, onLogin, onLogout];
}