import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Phone } from "lucide-react";
import Logo from "./Logo";
import { useState } from "react";

interface LoginPageProps {
  onLogin: (username: string) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupUsername, setSignupUsername] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginEmail && loginPassword) {
      const username = loginEmail.split('@')[0];
      onLogin(username);
    }
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (signupUsername && signupEmail && signupPassword) {
      onLogin(signupUsername);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center">
            <Logo className="h-14 w-auto" />
          </a>
          <nav className="hidden md:flex items-center gap-6">
            <a href="/" className="text-gray-600 hover:text-purple-600">
              ГЛАВНАЯ
            </a>
            <a href="/sos" className="text-gray-600 hover:text-purple-600">
              SOS
            </a>
            <a href="/ai" className="text-gray-600 hover:text-purple-600">
              AI
            </a>
            <a href="/report" className="text-gray-600 hover:text-purple-600">
              СООБЩИТЬ
            </a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-md mx-auto px-4 py-12">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Добро пожаловать в Nurai
          </h1>
          <p className="text-gray-600">Войдите или создайте аккаунт</p>
        </div>

        {/* Tabs Card */}
        <Card className="p-8 shadow-xl bg-white">
          <Tabs defaultValue="login" className="w-full">
            {/* Tabs List */}
            <TabsList className="grid w-full grid-cols-2 mb-8 bg-purple-100">
              <TabsTrigger
                value="login"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white font-semibold"
              >
                Вход
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white font-semibold"
              >
                Регистрация
              </TabsTrigger>
            </TabsList>

            {/* Login Tab */}
            <TabsContent value="login">
              <form className="space-y-5" onSubmit={handleLoginSubmit}>
                <div>
                  <Label htmlFor="login-email" className="text-gray-700">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="example@mail.com"
                    className="mt-2 h-12 rounded-xl border-gray-300 focus:border-purple-600"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="login-password" className="text-gray-700">Пароль</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                    className="mt-2 h-12 rounded-xl border-gray-300 focus:border-purple-600"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="text-right">
                  <a href="#" className="text-sm text-purple-600 hover:text-purple-700">
                    Забыли пароль?
                  </a>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-6 text-lg rounded-xl"
                >
                  Войти
                </Button>
              </form>
            </TabsContent>

            {/* Sign Up Tab */}
            <TabsContent value="signup">
              <form className="space-y-5" onSubmit={handleSignupSubmit}>
                <div>
                  <Label htmlFor="signup-username" className="text-gray-700">Username</Label>
                  <Input
                    id="signup-username"
                    type="text"
                    placeholder="Ваш username"
                    className="mt-2 h-12 rounded-xl border-gray-300 focus:border-purple-600"
                    value={signupUsername}
                    onChange={(e) => setSignupUsername(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="signup-email" className="text-gray-700">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="example@mail.com"
                    className="mt-2 h-12 rounded-xl border-gray-300 focus:border-purple-600"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="signup-password" className="text-gray-700">Пароль</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="••••••••"
                    className="mt-2 h-12 rounded-xl border-gray-300 focus:border-purple-600"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-6 text-lg rounded-xl"
                >
                  Создать аккаунт
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </Card>

        {/* Info */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Создавая аккаунт, вы соглашаетесь с нашими условиями использования и политикой конфиденциальности
        </p>
      </div>

      {/* Footer */}
      <footer className="bg-purple-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="mb-4">
                <Logo className="h-16 w-auto" />
              </div>
              <p className="text-purple-200">Платформа безопасности для защиты и поддержки</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Контакты</h4>
              <div className="flex items-center gap-2 text-purple-200">
                <Phone className="w-4 h-4" />
                <span>Экстренный номер: 112</span>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-4">Социальные сети</h4>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 bg-purple-800 rounded-full flex items-center justify-center hover:bg-purple-700 transition-colors">
                  T
                </a>
                <a href="#" className="w-10 h-10 bg-purple-800 rounded-full flex items-center justify-center hover:bg-purple-700 transition-colors">
                  I
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-purple-800 mt-8 pt-8 text-center text-purple-300">
            <p>&copy; 2024 Voice of Nurai. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}