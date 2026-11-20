"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  getMe,
  login as apiLogin,
  logout as apiLogout,
  signup as apiSignup,
  verifySignup as apiVerify,
  resendCode as apiResend,
  type User,
} from "@/lib/api";

type SessionStatus = "loading" | "authenticated" | "unauthenticated";

interface SessionContextValue {
  user: User | null;
  status: SessionStatus;
  login: (input: { email: string; password: string }) => Promise<User>;
  signup: (input: {
    name: string;
    email: string;
    password: string;
  }) => Promise<void>;
  verifySignup: (input: { email: string; code: string }) => Promise<User>;
  resendCode: (input: { email: string }) => Promise<void>;
  logout: () => Promise<void>;
}

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<SessionStatus>("loading");

  useEffect(() => {
    let cancelled = false;

    getMe()
      .then((me) => {
        if (cancelled) return;
        setUser(me);
        setStatus(me ? "authenticated" : "unauthenticated");
      })
      .catch(() => {
        if (cancelled) return;
        setUser(null);
        setStatus("unauthenticated");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(
    async (input: { email: string; password: string }) => {
      const me = await apiLogin(input);
      setUser(me);
      setStatus("authenticated");
      return me;
    },
    [],
  );

  const signup = useCallback(
    async (input: { name: string; email: string; password: string }) => {
      await apiSignup(input);
      // Does NOT auto-login — user must verify their email first
    },
    [],
  );

  const verifySignup = useCallback(
    async (input: { email: string; code: string }) => {
      const me = await apiVerify(input);
      setUser(me);
      setStatus("authenticated");
      return me;
    },
    [],
  );

  const resendCode = useCallback(
    async (input: { email: string }) => {
      await apiResend(input);
    },
    [],
  );

  const logout = useCallback(async () => {
    try {
      await apiLogout();
    } finally {
      setUser(null);
      setStatus("unauthenticated");
    }
  }, []);

  const value = useMemo(
    () => ({ user, status, login, signup, verifySignup, resendCode, logout }),
    [user, status, login, signup, verifySignup, resendCode, logout],
  );

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export function useSession(): SessionContextValue {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used inside <SessionProvider>");
  }
  return context;
}
