"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Dashboard", href: "/admin" },
  { label: "Users", href: "/admin/users" },
  { label: "Assignments", href: "/admin/assignments" },
  { label: "Records", href: "/admin/records" },
  { label: "Flags", href: "/admin/flags" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-64 flex flex-col min-h-screen bg-[var(--color-surface)]/90 border-r border-white/60/80 px-4 py-6 backdrop-blur-sm">
      <h2 className="text-lg font-bold mb-5 text-[var(--color-primary)]">Admin Portal</h2>
      <nav className="flex-1 flex flex-col gap-1.5 text-sm">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded-xl px-3 py-2 font-medium transition-colors ${
              pathname === item.href
                ? "bg-[var(--color-primary)]/15 text-[var(--color-primary)]"
                : "text-[var(--color-foreground)] hover:bg-[var(--color-primary)]/8"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
