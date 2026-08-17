import { ReactNode } from "react";

import { Sidebar } from "./Sidebar";
import "features/dashboard/dashboard.css";
import "./DashboardLayout.module.css";

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="flex min-h-screen w-full bg-gradient-to-br from-background to-muted/20 dash">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-6 md:p-8 lg:p-12 max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  );
};
