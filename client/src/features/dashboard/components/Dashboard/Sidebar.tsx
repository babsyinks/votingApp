import { cn } from "features/dashboard/lib/utils";
import { Home, Building2, Vote, Settings } from "lucide-react";
import { useSelector } from "react-redux";

import { userInfo } from "@/features/user/userSlice";

const navItems = [
  { icon: Home, label: "Dashboard", href: "/" },
  { icon: Building2, label: "Organizations", href: "/organizations" },
  { icon: Vote, label: "Elections", href: "/elections" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export const Sidebar = () => {
  const user = useSelector(userInfo);
  const firstChar = user?.username?.charAt(0).toUpperCase() || "";
  const userInitial = firstChar || "U";
  const normalizedUsername = firstChar + user.username.slice(1) || "User Name";
  return (
    <aside className="w-64 bg-card border-r border-border hidden md:flex flex-col">
      <div className="p-6 border-b border-border">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          VoteHub
        </h1>
        <p className="text-sm text-muted-foreground mt-1 mb-0">
          Election Management
        </p>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                  "text-foreground/70 hover:text-foreground hover:bg-accent/50",
                  "group",
                )}
              >
                <item.icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                <span className="font-medium">{item.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground font-semibold">
            {userInitial}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">User Name</p>
            <p className="text-xs text-muted-foreground truncate">
              {normalizedUsername}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};
