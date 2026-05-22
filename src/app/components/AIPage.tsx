import { Bot, ExternalLink } from "lucide-react";
import Layout from "./Layout";
import { Button } from "./ui/button";
import { BOT_USERNAME, User } from "../lib/api";

type AIPageProps = {
  user: User | null;
  logout: () => void;
};

export default function AIPage({ user, logout }: AIPageProps) {
  return (
    <Layout user={user} active="ai" logout={logout}>
      <main className="mx-auto max-w-3xl px-4 py-16 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-sky-100 text-sky-700">
          <Bot className="h-10 w-10" />
        </div>
        <h1 className="text-4xl font-bold text-slate-950">AI Помощник</h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-slate-600">
          Откройте Telegram-бота, чтобы получить советы по безопасности на русском языке.
        </p>
        <a href={`https://t.me/${BOT_USERNAME}`} target="_blank" rel="noopener noreferrer" className="mt-8 inline-block">
          <Button size="lg">
            <ExternalLink className="mr-2 h-5 w-5" />
            Открыть Telegram
          </Button>
        </a>
      </main>
    </Layout>
  );
}
