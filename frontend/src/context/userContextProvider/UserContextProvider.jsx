import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { setAuthHeaders } from "../../../api/";
import { refreshAccessToken } from "../../../api/auth";
import { getMyInfo } from "../../../api/users";

export const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [working, setWorking] = useState(true);
  const timeoutId = useRef();

  const setRefreshTimeout = (ttlMs = 15 * 60 * 1000) => {
    timeoutId.current = setTimeout(refreshToken, ttlMs - 5 * 1000);
  };

  const refreshToken = async (onSuccess, onError) => {
    try {
      const { accessToken, ttl } = await refreshAccessToken();

      if (!accessToken) return onError?.(); // case for no client refresh token

      setAuthHeaders(accessToken);
      setRefreshTimeout(ttl);

      await onSuccess?.();
    } catch (err) {
      await onError?.(err);
    }
  };

  useEffect(() => {
    refreshToken(
      async () => {
        const user = await getMyInfo();

        setUser(user);
        setWorking(false);
      },
      () => {
        setWorking(false);
      },
    );

    return () => {
      if (timeoutId.current !== undefined) clearTimeout(timeoutId.current);
    };

    // eslint-disable-next-line
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {working ? null : children}
    </UserContext.Provider>
  );
}
