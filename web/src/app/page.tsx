import Link from "next/link";

export default function Home() {
  const cards = [
    {
      title: "Patient Portal",
      desc: "Access your dashboard, sessions, and reports",
      href: "/signup",
      cta: "Patient Signup",
      accent: "bg-[var(--color-primary)]/10 border-[var(--color-primary)]/30",
    },
    {
      title: "Doctor Portal",
      desc: "Manage patients, availability, and messages",
      href: "/doctor-signup",
      cta: "Doctor Signup",
      accent: "bg-[var(--color-secondary)]/10 border-[var(--color-secondary)]/30",
    },
    {
      title: "Admin Portal",
      desc: "Institute-wide insights and management",
      href: "/admin-login",
      cta: "Admin Login",
      accent: "bg-[var(--color-accent)]/10 border-[var(--color-accent)]/30",
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 md:py-16">
      <div className="max-w-6xl w-full">
        {/* Hero */}
        <div className="mb-10 md:mb-14 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="max-w-xl space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full bg-[var(--color-surface)]/80 px-3 py-1 text-xs font-medium text-[var(--color-primary)] border border-[var(--color-primary)]/20 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-[var(--color-secondary)] animate-pulse" />
              Smarter mental health triage for institutes
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight text-[var(--color-foreground)]">
              Welcome to <span className="text-[var(--color-primary)]">Arogyam</span>
            </h1>
            <p className="text-sm md:text-base text-[var(--color-foreground)]/75 leading-relaxed">
              A playful, privacy‑aware platform connecting patients, doctors, and administrators.
              Choose the portal that matches your role to get started.
            </p>
          </div>

          {/* Simple decorative blob */}
          <div className="relative hidden md:block w-full max-w-xs lg:max-w-sm">
            <div className="absolute inset-0 rounded-3xl bg-[var(--color-secondary)]/30 blur-3xl" />
            <div className="relative rounded-3xl border border-white/60 bg-[var(--color-surface)]/90 shadow-xl p-5 flex flex-col gap-3 backdrop-blur">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide text-[var(--color-foreground)]/60">Today&apos;s overview</p>
                  <p className="text-lg font-semibold text-[var(--color-foreground)]">Campus wellbeing</p>
                </div>
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/40">
                  <svg
                    aria-hidden
                    className="h-4 w-4 text-[var(--color-primary)]"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      x="4"
                      y="5"
                      width="16"
                      height="10"
                      rx="2"
                      stroke="currentColor"
                      strokeWidth="1.6"
                    />
                    <path
                      d="M8 15V18L11 15"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle cx="9" cy="9" r="1" fill="currentColor" />
                    <path
                      d="M11.5 9.5C12.1667 8.83333 13 8.5 14 8.5C15 8.5 15.8333 8.83333 16.5 9.5"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="rounded-xl bg-white/70 dark:bg-white/5 p-3 flex flex-col gap-1">
                  <span className="text-[var(--color-foreground)]/60">Sessions</span>
                  <span className="text-base font-semibold">24</span>
                </div>
                <div className="rounded-xl bg-white/70 dark:bg-white/5 p-3 flex flex-col gap-1">
                  <span className="text-[var(--color-foreground)]/60">Alerts</span>
                  <span className="text-base font-semibold text-[var(--color-alert)]">3</span>
                </div>
                <div className="rounded-xl bg-white/70 dark:bg-white/5 p-3 flex flex-col gap-1">
                  <span className="text-[var(--color-foreground)]/60">Mood</span>
                  <span className="text-base font-semibold text-[var(--color-success)]">Stable</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Portal cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {cards.map((c) => (
            <div
              key={c.title}
              className={`group relative overflow-hidden rounded-2xl border p-5 md:p-6 shadow-sm backdrop-blur-sm ${c.accent}`}
            >
              <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-white/20 opacity-60 group-hover:scale-110 transition-transform" />
              <div className="relative flex flex-col h-full">
                <h2 className="text-lg md:text-xl font-semibold mb-1 text-[var(--color-foreground)]">{c.title}</h2>
                <p className="text-sm mb-4 text-[var(--color-foreground)]/80 flex-1">{c.desc}</p>
                <Link
                  href={c.href}
                  className="inline-flex items-center justify-center rounded-full bg-[var(--color-primary)] text-white px-4 py-2 text-sm font-medium shadow-sm hover:shadow-md hover:bg-[var(--color-primary)]/90 transition-all gap-2"
                >
                  {c.cta}
                  <span aria-hidden className="text-xs">
                    →
                  </span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
