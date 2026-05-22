import { useCallback, useEffect, useMemo, useState } from "react";
import HomePage from "./components/HomePage";
import SOSPage from "./components/SOSPage";
import AIPage from "./components/AIPage";
import ReportPage from "./components/ReportPage";
import LoginPage from "./components/LoginPage";
import ContactsPage from "./components/ContactsPage";
import ActiveSOSPage from "./components/ActiveSOSPage";
import TrackPage from "./components/TrackPage";
import { api, ApiError, clearLocalAuthUser, getLocalAuthUser, setLocalAuthUser, User } from "./lib/api";

export default function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [user, setUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  const navigate = useCallback((path: string) => {
    window.history.pushState({}, "", path);
    setCurrentPath(path);
    window.scrollTo(0, 0);
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const data = await api<{ user: User }>("/api/auth/me");
      setUser(data.user);
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        clearLocalAuthUser();
        setUser(null);
      } else {
        setUser(getLocalAuthUser());
      }
    } finally {
      setAuthChecked(true);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  useEffect(() => {
    const handlePathChange = () => setCurrentPath(window.location.pathname);

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const link = target.closest("a");
      if (!link || !link.href || link.target === "_blank") return;
      if (!link.href.startsWith(window.location.origin)) return;

      event.preventDefault();
      navigate(new URL(link.href).pathname);
    };

    window.addEventListener("popstate", handlePathChange);
    document.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("popstate", handlePathChange);
      document.removeEventListener("click", handleClick);
    };
  }, [navigate]);

  const logout = useCallback(async () => {
    try {
      await api("/api/auth/logout", { method: "POST" });
    } finally {
      clearLocalAuthUser();
      setUser(null);
      navigate("/");
    }
  }, [navigate]);

  const activateLocalUser = useCallback((localUser: User) => {
    setLocalAuthUser(localUser);
    setUser(localUser);
    setAuthChecked(true);
  }, []);

  const appProps = useMemo(
    () => ({ user, navigate, refreshUser, logout, activateLocalUser }),
    [user, navigate, refreshUser, logout, activateLocalUser],
  );

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-700">
        Загрузка приложения...
      </div>
    );
  }

  if (currentPath === "/login" || currentPath === "/register") {
    return <LoginPage {...appProps} mode={currentPath === "/register" ? "register" : "login"} />;
  }

  if (currentPath === "/sos") return <SOSPage {...appProps} />;
  if (currentPath === "/sos/active") return <ActiveSOSPage {...appProps} />;
  if (currentPath.startsWith("/track/")) {
    const sessionId = currentPath.split("/").filter(Boolean)[1] || "";
    return <TrackPage {...appProps} sessionId={sessionId} />;
  }
  if (currentPath === "/contacts") return <ContactsPage {...appProps} />;
  if (currentPath === "/ai") return <AIPage {...appProps} />;
  if (currentPath === "/report/new" || currentPath === "/report") return <ReportPage {...appProps} />;

  return <HomePage {...appProps} />;
}
