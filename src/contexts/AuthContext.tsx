import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  AUTH_TOKEN_KEY,
  clearAuth,
  getAuthToken,
  getMe,
  loginStudent,
  setUnauthorizedCallback,
  signupStudent,
  unwrapMe,
} from "@/lib/xano";

export type MeUser = Record<string, unknown> | null;

type AuthContextValue = {
  user: MeUser;
  ready: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [user, setUser] = useState<MeUser>(null);
  const [ready, setReady] = useState(false);

  const logout = useCallback(() => {
    clearAuth();
    setUser(null);
    navigate("/login", { replace: true });
  }, [navigate]);

  useEffect(() => {
    setUnauthorizedCallback(() => {
      setUser(null);
      navigate("/login", { replace: true });
    });
    return () => setUnauthorizedCallback(null);
  }, [navigate]);

  const refreshUser = useCallback(async () => {
    const raw = await getMe();
    setUser(unwrapMe(raw));
  }, []);

  useEffect(() => {
    let cancelled = false;
    const token = getAuthToken();
    if (!token) {
      setUser(null);
      setReady(true);
      return () => {
        cancelled = true;
      };
    }

    (async () => {
      try {
        const raw = await getMe();
        if (!cancelled) setUser(unwrapMe(raw));
      } catch {
        if (!cancelled) {
          clearAuth();
          setUser(null);
        }
      } finally {
        if (!cancelled) setReady(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      await loginStudent(email, password);
      const raw = await getMe();
      setUser(unwrapMe(raw));
      navigate("/", { replace: true });
    },
    [navigate]
  );

  const signup = useCallback(async (name: string, email: string, password: string) => {
    await signupStudent(name, email, password);
  }, []);

  const value = useMemo(
    () => ({
      user,
      ready,
      login,
      signup,
      logout,
      refreshUser,
    }),
    [user, ready, login, signup, logout, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}

export { AUTH_TOKEN_KEY };
