"use client";

import { useCallback, useEffect, useState } from "react";

function hasAuthToken() {
  if (typeof window === "undefined") return false;
  return Boolean(localStorage.getItem("access_token"));
}

export function useHiilboxAuth() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const sync = () => setLoggedIn(hasAuthToken());
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener("hiilbox-auth-changed", sync as EventListener);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("hiilbox-auth-changed", sync as EventListener);
    };
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("auth_user");
    window.dispatchEvent(new Event("hiilbox-auth-changed"));
    setLoggedIn(false);
    window.location.href = "/";
  }, []);

  return { loggedIn, logout };
}
