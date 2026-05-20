import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Bot, Brain, MapPin, MessageCircle, Phone } from "lucide-react";
import Logo from "./Logo";

interface AIPageProps {
  user: { username: string } | null;
}

export default function AIPage({ user }: AIPageProps) {
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
            <a href="/ai" className="text-purple-900 font-medium">
              AI
            </a>
            <a href="/report" className="text-gray-600 hover:text-purple-600">
              СООБЩИТЬ
            </a>
            {user ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Добро пожаловать,</span>
                <span className="font-semibold text-purple-600">{user.username}</span>
              </div>
            ) : (
              <a href="/login">
                <Button variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-50">
                  Войти
                </Button>
              </a>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="mb-8">
          <div className="inline-block p-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-6">
            <Bot className="w-16 h-16 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            AI-помощник для вашей безопасности
          </h1>
          <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
            Наш AI-ассистент поможет вам действовать правильно в экстренных ситуациях
          </p>
        </div>
      </section>

      {/* Что умеет AI */}
      <section className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          <Card className="p-6 bg-white hover:shadow-lg transition-shadow text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center">
                <Brain className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="font-bold text-gray-900">Советы в опасных ситуациях</h3>
            </div>
          </Card>

          <Card className="p-6 bg-white hover:shadow-lg transition-shadow text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-14 h-14 bg-pink-100 rounded-full flex items-center justify-center">
                <MapPin className="w-7 h-7 text-pink-600" />
              </div>
              <h3 className="font-bold text-gray-900">Что делать прямо сейчас</h3>
            </div>
          </Card>

          <Card className="p-6 bg-white hover:shadow-lg transition-shadow text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
                <Phone className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="font-bold text-gray-900">Куда обратиться за помощью</h3>
            </div>
          </Card>

          <Card className="p-6 bg-white hover:shadow-lg transition-shadow text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
                <MessageCircle className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="font-bold text-gray-900">Ответы 24/7</h3>
            </div>
          </Card>
        </div>
      </section>

      {/* Главная кнопка - ЦЕНТР СТРАНИЦЫ */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center">
          <p className="text-gray-600 mb-8 text-lg">
            📲 Нажмите кнопку, чтобы открыть чат в Telegram
          </p>
          <a 
            href="https://t.me/YourBotName" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block"
          >
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold px-16 py-10 text-2xl shadow-2xl hover:shadow-purple-500/50 transition-all hover:scale-105 active:scale-95"
            >
              <Bot className="w-8 h-8 mr-4" />
              Открыть AI в Telegram
            </Button>
          </a>
        </div>
      </section>

      {/* Info */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-purple-50 rounded-2xl p-8 border border-purple-200">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center flex-shrink-0">
              <Bot className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-purple-900 mb-2">Как это работает?</h3>
              <p className="text-gray-700 leading-relaxed">
                Наш AI-ассистент работает через Telegram. После нажатия на кнопку вы будете перенаправлены в мессенджер,
                где сможете задать любой вопрос о безопасности и получить мгновенный ответ. Все ваши разговоры конфиденциальны.
              </p>
            </div>
          </div>
        </div>
      </section>

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