"use client";

import { useEffect, useState } from "react";

interface PatientSummary {
  patient: { id: string; name: string | null; email: string };
  NEGATIVE: number;
  NEUTRAL: number;
  POSITIVE: number;
  lastAt: string | null;
}

interface AnalyticsResponse {
  summary: { total: number; NEGATIVE: number; NEUTRAL: number; POSITIVE: number };
  perPatient: PatientSummary[];
}

export default function DoctorAnalyticsPage() {
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/doctor/analytics");
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error || "Failed to load analytics");
        }
        const json = (await res.json()) as AnalyticsResponse;
        setData(json);
      } catch (e: any) {
        setError(e?.message || "Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const summary = data?.summary;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">General Analytics</h1>
      {loading && <p className="text-sm text-[var(--color-foreground)]/70">Loading analytics...</p>}
      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="rounded-lg bg-[var(--color-surface)] border border-gray-200 dark:border-gray-700 p-3">
            <p className="text-xs text-[var(--color-foreground)]/70">Total predictions</p>
            <p className="text-xl font-semibold">{summary.total}</p>
          </div>
          <div className="rounded-lg bg-[var(--color-surface)] border border-gray-200 dark:border-gray-700 p-3">
            <p className="text-xs text-[var(--color-foreground)]/70">Negative</p>
            <p className="text-xl font-semibold text-red-600">{summary.NEGATIVE}</p>
          </div>
          <div className="rounded-lg bg-[var(--color-surface)] border border-gray-200 dark:border-gray-700 p-3">
            <p className="text-xs text-[var(--color-foreground)]/70">Neutral</p>
            <p className="text-xl font-semibold">{summary.NEUTRAL}</p>
          </div>
          <div className="rounded-lg bg-[var(--color-surface)] border border-gray-200 dark:border-gray-700 p-3">
            <p className="text-xs text-[var(--color-foreground)]/70">Positive</p>
            <p className="text-xl font-semibold text-emerald-600">{summary.POSITIVE}</p>
          </div>
        </div>
      )}
      {data && data.perPatient.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-[var(--color-surface)]">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-900/40">
              <tr>
                <th className="px-4 py-2 text-left font-medium">Patient</th>
                <th className="px-4 py-2 text-left font-medium">Email</th>
                <th className="px-4 py-2 text-left font-medium">Negative</th>
                <th className="px-4 py-2 text-left font-medium">Neutral</th>
                <th className="px-4 py-2 text-left font-medium">Positive</th>
                <th className="px-4 py-2 text-left font-medium">Last prediction</th>
              </tr>
            </thead>
            <tbody>
              {data.perPatient.map((row) => (
                <tr key={row.patient.id} className="border-t border-gray-100 dark:border-gray-800">
                  <td className="px-4 py-2">{row.patient.name || "Unknown"}</td>
                  <td className="px-4 py-2">{row.patient.email}</td>
                  <td className="px-4 py-2 text-red-600 font-semibold">{row.NEGATIVE}</td>
                  <td className="px-4 py-2">{row.NEUTRAL}</td>
                  <td className="px-4 py-2 text-emerald-600 font-semibold">{row.POSITIVE}</td>
                  <td className="px-4 py-2">{row.lastAt ? new Date(row.lastAt).toLocaleString() : "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {data && data.perPatient.length === 0 && !loading && !error && (
        <p className="text-sm text-[var(--color-foreground)]/70">No prediction data yet for your patients.</p>
      )}
    </div>
  );
}
