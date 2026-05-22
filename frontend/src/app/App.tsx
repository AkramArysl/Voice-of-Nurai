import { useState, useEffect } from "react";
import HomePage from "./components/HomePage";
import SOSPage from "./components/SOSPage";
import AIPage from "./components/AIPage";
import ReportPage from "./components/ReportPage";
import LoginPage from "./components/LoginPage";

export default function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [user, setUser] = useState<{ username: string } | null>(null);

  useEffect(() => {
    const handlePathChange = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePathChange);
    
    // Handle clicks on links
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');
      if (link && link.href && link.href.startsWith(window.location.origin)) {
        // Не перехватываем внешние ссылки (с target="_blank")
        if (link.getAttribute('target') === '_blank') {
          return;
        }
        e.preventDefault();
        const path = new URL(link.href).pathname;
        window.history.pushState({}, '', path);
        setCurrentPath(path);
        window.scrollTo(0, 0);
      }
    };

    document.addEventListener('click', handleClick);
    
    return () => {
      window.removeEventListener('popstate', handlePathChange);
      document.removeEventListener('click', handleClick);
    };
  }, []);

  const handleLogin = (username: string) => {
    setUser({ username });
    window.history.pushState({}, '', '/');
    setCurrentPath('/');
  };

  let PageComponent;
  if (currentPath === '/sos') {
    PageComponent = () => <SOSPage user={user} />;
  } else if (currentPath === '/ai') {
    PageComponent = () => <AIPage user={user} />;
  } else if (currentPath === '/report') {
    PageComponent = () => <ReportPage user={user} />;
  } else if (currentPath === '/login') {
    PageComponent = () => <LoginPage onLogin={handleLogin} />;
  } else {
    PageComponent = () => <HomePage user={user} />;
  }

  return <PageComponent />;
}