"use client";

import { useState } from "react";
import DoctorSidebar from "@/components/DoctorSidebar";
import DashboardNavbar from "@/components/DashboardNavbar";

export default function DoctorShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen relative">
      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <DoctorSidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <button
            type="button"
            className="flex-1 bg-black/40"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close navigation menu"
          />
          <DoctorSidebar />
        </div>
      )}

      <div className="flex-1 flex flex-col">
        <DashboardNavbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
