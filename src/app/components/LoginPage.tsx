import { useState } from "react";
import Layout from "./Layout";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { api, ApiError, canUseLocalAuthFallback, requestGeolocation, User } from "../lib/api";

type LoginPageProps = {
  mode: "login" | "register";
  user: User | null;
  navigate: (path: string) => void;
  refreshUser: () => Promise<void>;
  activateLocalUser: (user: User) => void;
  logout: () => void;
};

export default function LoginPage({ mode, user, navigate, refreshUser, activateLocalUser, logout }: LoginPageProps) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const isRegister = mode === "register";

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    if (isRegister && password !== confirmPassword) {
      setError("Пароль и подтверждение пароля не совпадают");
      return;
    }

    setLoading(true);
    try {
      await api(isRegister ? "/api/auth/register" : "/api/auth/login", {
        method: "POST",
        body: JSON.stringify(isRegister ? { username, email, password } : { email, password }),
      });
      await refreshUser();
      requestGeolocation();
      navigate("/");
    } catch (err) {
      if (canUseLocalAuthFallback(err)) {
        const localUser = {
          id: Date.now(),
          username: isRegister ? username : email.split("@")[0],
          email,
        };
        activateLocalUser(localUser);
        requestGeolocation();
        navigate("/");
        return;
      }

      const message = err instanceof ApiError ? err.message : "Не удалось выполнить запрос";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout user={user} active="" logout={logout}>
      <main className="mx-auto max-w-md px-4 py-12">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-950">{isRegister ? "Регистрация" : "Вход"}</h1>
          <p className="mt-2 text-slate-600">
            {isRegister ? "Создайте аккаунт, чтобы пользоваться SOS и репортами" : "Войдите, чтобы продолжить"}
          </p>
        </div>

        <Card className="bg-white p-6 shadow-sm">
          <div className="mb-6 grid grid-cols-2 rounded-md bg-slate-100 p-1">
            <a className={`rounded px-3 py-2 text-center text-sm font-medium ${!isRegister ? "bg-white shadow-sm" : ""}`} href="/login">
              Вход
            </a>
            <a className={`rounded px-3 py-2 text-center text-sm font-medium ${isRegister ? "bg-white shadow-sm" : ""}`} href="/register">
              Регистрация
            </a>
          </div>

          <form className="space-y-4" onSubmit={submit}>
            {isRegister && (
              <div>
                <Label htmlFor="username">Имя пользователя</Label>
                <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
              </div>
            )}
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="password">Пароль</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            {isRegister && (
              <div>
                <Label htmlFor="confirm-password">Подтверждение пароля</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            )}
            {error && <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>}
            <Button className="w-full" disabled={loading} type="submit">
              {loading ? "Отправка..." : isRegister ? "Создать аккаунт" : "Войти"}
            </Button>
          </form>
        </Card>
      </main>
    </Layout>
  );
}
