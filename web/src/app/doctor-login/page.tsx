"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function DoctorLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await signIn("doctor-credentials", {
      email,
      employeeId,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.ok) {
      router.push("/doctor/scheduler");
    } else {
      setError(res?.error || "Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-[var(--color-surface)]/95 rounded-2xl shadow-xl border border-white/60 p-6 md:p-8 space-y-5 backdrop-blur-sm">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-secondary)]/90">Doctor Portal</p>
          <h1 className="text-2xl md:text-3xl font-semibold mb-1">Sign in as a doctor</h1>
          <p className="text-sm text-[var(--color-foreground)]/70">
            Use your institutional email, employee ID, and password.
          </p>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              className="w-full border rounded-lg px-3 py-2 bg-white/85 dark:bg-black/20 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/60"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Employee ID</label>
            <input
              type="text"
              className="w-full border rounded-lg px-3 py-2 bg-white/85 dark:bg-black/20 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/60"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              className="w-full border rounded-lg px-3 py-2 bg-white/85 dark:bg-black/20 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/60"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          )}
          <button
            type="submit"
            className="w-full rounded-full py-2.5 disabled:opacity-60 bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary)]/90 transition shadow-sm hover:shadow-md text-sm font-medium"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
