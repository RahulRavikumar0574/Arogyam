"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function DoctorSignupPage() {
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("/api/doctor-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        await signIn("doctor-credentials", {
          email: data.email as string,
          employeeId: data.rollNo as string,
          password: data.password as string,
          callbackUrl: "/doctor/scheduler",
        });
      } else {
        const { error } = await res.json();
        setError(error);
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-[var(--color-surface)]/95 rounded-2xl shadow-xl border border-white/60 p-6 md:p-8 space-y-5 backdrop-blur-sm">
        <div className="space-y-1 text-center">
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-secondary)]/90">Doctor Portal</p>
          <h1 className="text-2xl md:text-3xl font-semibold mb-1">Create your doctor profile</h1>
          <p className="text-sm text-[var(--color-foreground)]/70">Help patients by managing sessions, availability, and alerts.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          <div>
            <label className="block text-sm mb-1">Name</label>
            <input name="name" type="text" required className="w-full border rounded-lg px-3 py-2 bg-white/85 dark:bg-black/20 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/60" />
          </div>
          <div>
            <label className="block text-sm mb-1">Gender</label>
            <select name="gender" required className="w-full border rounded-lg px-3 py-2 bg-white/85 dark:bg-black/20 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/60">
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Affiliated Institute/Hospital</label>
            <input name="instituteName" type="text" required className="w-full border rounded-lg px-3 py-2 bg-white/85 dark:bg-black/20 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/60" />
          </div>
          <div>
            <label className="block text-sm mb-1">Institution Email</label>
            <input name="email" type="email" required className="w-full border rounded-lg px-3 py-2 bg-white/85 dark:bg-black/20 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/60" />
          </div>
          <div>
            <label className="block text-sm mb-1">Phone Number</label>
            <input name="phone" type="text" required className="w-full border rounded-lg px-3 py-2 bg-white/85 dark:bg-black/20 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/60" />
          </div>
          <div>
            <label className="block text-sm mb-1">Employee ID</label>
            <input name="rollNo" type="text" required className="w-full border rounded-lg px-3 py-2 bg-white/85 dark:bg-black/20 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/60" />
          </div>
          <div>
            <label className="block text-sm mb-1">Password</label>
            <input name="password" type="password" required className="w-full border rounded-lg px-3 py-2 bg-white/85 dark:bg-black/20 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/60" />
          </div>
          <div>
            <label className="block text-sm mb-1">Confirm Password</label>
            <input name="confirmPassword" type="password" required className="w-full border rounded-lg px-3 py-2 bg-white/85 dark:bg-black/20 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/60" />
          </div>
          {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
          <button
            type="submit"
            className="w-full rounded-full py-2.5 disabled:opacity-60 bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary)]/90 transition shadow-sm hover:shadow-md text-sm font-medium"
          >
            Sign Up
          </button>
        </form>
        <p className="text-xs md:text-sm text-center text-[var(--color-foreground)]/70">
          Already have an account?{" "}
          <Link href="/doctor-login" className="font-medium text-[var(--color-accent)] hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
