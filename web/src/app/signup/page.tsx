"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("/api/patient-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        router.push("/login");
      } else {
        const { error } = await res.json();
        setError(error);
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-sm bg-[var(--color-surface)] rounded-xl shadow-sm p-6 space-y-6">
        <h1 className="text-2xl font-semibold text-center mb-1">Patient Signup</h1>
        <p className="text-sm text-[var(--color-foreground)]/70 text-center mb-2">Create your patient account to access your health portal.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Name</label>
            <input name="name" type="text" required className="w-full border rounded px-3 py-2 bg-white/80 dark:bg-black/20" />
          </div>
          <div>
            <label className="block text-sm mb-1">Gender</label>
            <select name="gender" required className="w-full border rounded px-3 py-2 bg-white/80 dark:bg-black/20">
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Age</label>
            <input name="age" type="number" required className="w-full border rounded px-3 py-2 bg-white/80 dark:bg-black/20" />
          </div>
          <div>
            <label className="block text-sm mb-1">Height (cm)</label>
            <input name="height" type="number" required className="w-full border rounded px-3 py-2 bg-white/80 dark:bg-black/20" />
          </div>
          <div>
            <label className="block text-sm mb-1">Weight (kg)</label>
            <input name="weight" type="number" required className="w-full border rounded px-3 py-2 bg-white/80 dark:bg-black/20" />
          </div>
          <div>
            <label className="block text-sm mb-1">Special Condition</label>
            <input name="specialCondition" type="text" className="w-full border rounded px-3 py-2 bg-white/80 dark:bg-black/20" />
          </div>
          <div>
            <label className="block text-sm mb-1">Address</label>
            <input name="address" type="text" required className="w-full border rounded px-3 py-2 bg-white/80 dark:bg-black/20" />
          </div>
          <div>
            <label className="block text-sm mb-1">Email ID</label>
            <input name="email" type="email" required className="w-full border rounded px-3 py-2 bg-white/80 dark:bg-black/20" />
          </div>
          <div>
            <label className="block text-sm mb-1">Phone Number</label>
            <input name="phone" type="text" required className="w-full border rounded px-3 py-2 bg-white/80 dark:bg-black/20" />
          </div>
          <div>
            <label className="block text-sm mb-1">Password</label>
            <input name="password" type="password" required className="w-full border rounded px-3 py-2 bg-white/80 dark:bg-black/20" />
          </div>
          <div>
            <label className="block text-sm mb-1">Confirm Password</label>
            <input name="confirmPassword" type="password" required className="w-full border rounded px-3 py-2 bg-white/80 dark:bg-black/20" />
          </div>
          {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
          <button
            type="submit"
            className="w-full rounded py-2 disabled:opacity-60 bg-[var(--color-primary)] text-white hover:opacity-90 transition"
          >
            Sign Up
          </button>
        </form>
        <p className="text-sm text-center">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
