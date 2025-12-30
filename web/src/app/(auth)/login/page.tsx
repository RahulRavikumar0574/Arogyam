"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await signIn("patient-credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (res?.ok) {
      router.push("/dashboard");
    } else {
      setError(res?.error || "Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-[var(--color-surface)]/95 rounded-2xl shadow-xl border border-white/60 p-6 md:p-8 backdrop-blur-sm space-y-5">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-primary)]/80">Patient Portal</p>
          <h1 className="text-2xl md:text-3xl font-semibold mb-1">Sign in</h1>
          <p className="text-sm text-[var(--color-foreground)]/70">Access your sessions, records, and support tools.</p>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              className="w-full border rounded-lg px-3 py-2 bg-white/85 dark:bg-black/20 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/60 focus:border-[var(--color-primary)]/70 text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              className="w-full border rounded-lg px-3 py-2 bg-white/85 dark:bg-black/20 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/60 focus:border-[var(--color-primary)]/70 text-sm"
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
        <p className="text-xs md:text-sm text-[var(--color-foreground)]/70 mt-2 text-center">
          Don&apos;t have an account? {" "}
          <a className="font-medium text-[var(--color-accent)] hover:underline" href="/signup">Sign up</a>
        </p>
      </div>
    </div>
  );
}
