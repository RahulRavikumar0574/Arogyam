"use client";

import { useEffect, useState } from "react";

interface AssignmentResponse {
  doctor?: {
    id: string;
    name: string | null;
    email: string;
    instituteName: string | null;
  } | null;
}

export default function PatientDoctorPage() {
  const [data, setData] = useState<AssignmentResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/assignments");
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error || "Failed to load doctor assignment");
        }
        const json = (await res.json()) as AssignmentResponse;
        setData(json);
      } catch (e: any) {
        setError(e?.message || "Failed to load doctor assignment");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const doctor = data?.doctor || null;

  return (
    <div className="space-y-4 max-w-xl">
      <h1 className="text-2xl font-semibold">Your Doctor</h1>
      {loading && <p className="text-sm text-[var(--color-foreground)]/70">Loading assigned doctor...</p>}
      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
      {!loading && !error && !doctor && (
        <p className="text-sm text-[var(--color-foreground)]/70">
          You don&apos;t have an assigned doctor yet. Once a doctor is assigned, their details will appear here.
        </p>
      )}
      {doctor && (
        <div className="rounded-xl bg-[var(--color-surface)] border border-gray-200 dark:border-gray-700 p-4 space-y-2">
          <p className="text-sm text-[var(--color-foreground)]/70">Assigned doctor</p>
          <p className="text-lg font-semibold">{doctor.name || "Doctor"}</p>
          <p className="text-sm">{doctor.email}</p>
          {doctor.instituteName && (
            <p className="text-sm text-[var(--color-foreground)]/70">{doctor.instituteName}</p>
          )}
        </div>
      )}
    </div>
  );
}
