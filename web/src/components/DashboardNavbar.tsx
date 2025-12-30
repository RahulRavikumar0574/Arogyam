"use client";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";

type DashboardNavbarProps = {
  onMenuClick?: () => void;
};

export default function DashboardNavbar({ onMenuClick }: DashboardNavbarProps) {
  const { data: session } = useSession();
  const role = (session?.user as any)?.role;
  const userName = session?.user?.name || (role === 'DOCTOR' ? 'Doctor' : 'Patient');
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const stored = (typeof window !== "undefined" && localStorage.getItem("theme")) as
      | "light"
      | "dark"
      | null;
    if (stored) {
      setTheme(stored);
      document.documentElement.setAttribute("data-theme", stored);
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {}
  };

  return (
    <nav className="w-full flex items-center justify-between bg-[var(--color-surface)] border-b border-gray-200 dark:border-gray-700 px-4 md:px-6 py-3">
      <div className="flex items-center gap-2">
        {onMenuClick && (
          <button
            type="button"
            onClick={onMenuClick}
            className="md:hidden mr-1 p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-[var(--color-background)]/80 text-[var(--color-foreground)] hover:bg-[var(--color-primary)]/5 transition"
            aria-label="Open navigation menu"
          >
            <span className="block w-4 h-[2px] bg-[var(--color-foreground)] mb-0.5" />
            <span className="block w-4 h-[2px] bg-[var(--color-foreground)] mb-0.5" />
            <span className="block w-4 h-[2px] bg-[var(--color-foreground)]" />
          </button>
        )}
        <span
          aria-hidden
          className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/40 text-[var(--color-primary)] text-xs font-semibold uppercase tracking-wide"
        >
          AR
        </span>
        <span className="font-semibold text-[var(--color-primary)] text-lg">{userName}</span>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={toggleTheme}
          className="px-3 py-2 rounded border border-transparent hover:border-[var(--color-primary)] text-sm inline-flex items-center gap-2"
          title="Toggle theme"
        >
          {theme === "dark" ? (
            <>
              <svg
                aria-hidden
                className="h-4 w-4 text-[var(--color-foreground)]"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21 12.79C20.39 13 19.74 13.12 19.06 13.12C14.66 13.12 11.06 9.52 11.06 5.12C11.06 4.44 11.18 3.79 11.39 3.19C8.39 3.86 6.25 6.52 6.25 9.62C6.25 13.73 9.58 17.06 13.69 17.06C16.79 17.06 19.45 14.92 20.12 11.92Z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Dark</span>
            </>
          ) : (
            <>
              <svg
                aria-hidden
                className="h-4 w-4 text-[var(--color-foreground)]"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
                <path d="M12 3V5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                <path d="M12 19V21" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                <path d="M4.22 4.22L5.64 5.64" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                <path d="M18.36 18.36L19.78 19.78" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                <path d="M3 12H5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                <path d="M19 12H21" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                <path d="M4.22 19.78L5.64 18.36" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                <path d="M18.36 5.64L19.78 4.22" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
              <span>Light</span>
            </>
          )}
        </button>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="bg-[var(--color-primary)] text-white px-4 py-2 rounded font-medium hover:opacity-90 transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
