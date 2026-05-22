import { Bot, FileText, Home, LogOut, ShieldAlert, Users } from "lucide-react";
import Logo from "./Logo";
import { Button } from "./ui/button";
import { User } from "../lib/api";

type LayoutProps = {
  user: User | null;
  active?: string;
  children: React.ReactNode;
  logout: () => void;
};

const links = [
  { href: "/", label: "Главная", key: "home", icon: Home },
  { href: "/sos", label: "SOS", key: "sos", icon: ShieldAlert },
  { href: "/ai", label: "AI Помощник", key: "ai", icon: Bot },
  { href: "/contacts", label: "Доверенные лица", key: "contacts", icon: Users },
  { href: "/report/new", label: "Сообщить", key: "report", icon: FileText },
];

export default function Layout({ user, active, children, logout }: LayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 shadow-sm backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
          <a href="/" className="flex w-fit items-center rounded-lg px-2 py-1 transition hover:bg-slate-100">
            <Logo className="h-10 w-auto" />
          </a>
          <nav className="flex flex-wrap items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = active === link.key;
              return (
                <a
                  key={link.key}
                  href={link.href}
                  className={`inline-flex min-h-10 items-center gap-2 rounded-lg px-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-white text-rose-700 shadow-sm"
                      : "text-slate-600 hover:bg-white hover:text-slate-950"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </a>
              );
            })}
          </nav>
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2">
            {user ? (
              <>
                <span className="max-w-[220px] truncate text-sm text-slate-600">
                  Добро пожаловать, <strong className="text-slate-950">{user.username}</strong>
                </span>
                <Button variant="outline" size="sm" onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Выйти
                </Button>
              </>
            ) : (
              <a href="/login">
                <Button size="sm">Войти</Button>
              </a>
            )}
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}
