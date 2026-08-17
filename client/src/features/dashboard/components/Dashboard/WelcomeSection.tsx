import { Sparkles } from "lucide-react";

export const WelcomeSection = () => {
  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12
      ? "Good morning"
      : currentHour < 18
        ? "Good afternoon"
        : "Good evening";

  return (
    <div className="mb-8 animate-fade-in">
      <div className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-8 text-primary-foreground shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="w-6 h-6" />
          <h2 className="text-3xl font-bold">{greeting}!</h2>
        </div>
        <p className="text-primary-foreground/90 text-lg">
          Welcome to your voting dashboard. Manage your organizations and
          elections with ease.
        </p>
      </div>
    </div>
  );
};
