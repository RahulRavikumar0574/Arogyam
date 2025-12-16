"use client";

import { useEffect, useState } from "react";

interface AlertItem {
  patient: { id: string; name: string | null; email: string };
  streak: number;
  lastAt: string | null;
}

export default function DoctorAlertsPage() {
  const [items, setItems] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/doctor/alerts");
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error || "Failed to load alerts");
        }
        const data = (await res.json()) as { items: AlertItem[] };
        setItems(data.items || []);
      } catch (e: any) {
        setError(e?.message || "Failed to load alerts");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Alerts</h1>
      {loading && <p className="text-sm text-[var(--color-foreground)]/70">Loading alerts...</p>}
      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
      {!loading && !error && items.length === 0 && (
        <p className="text-sm text-[var(--color-foreground)]/70">No patients currently have critical negative emotion streaks.</p>
      )}
      {!loading && !error && items.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-[var(--color-surface)]">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-900/40">
              <tr>
                <th className="px-4 py-2 text-left font-medium">Patient</th>
                <th className="px-4 py-2 text-left font-medium">Email</th>
                <th className="px-4 py-2 text-left font-medium">NEGATIVE streak</th>
                <th className="px-4 py-2 text-left font-medium">Last prediction</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.patient.id} className="border-t border-gray-100 dark:border-gray-800">
                  <td className="px-4 py-2">{item.patient.name || "Unknown"}</td>
                  <td className="px-4 py-2">{item.patient.email}</td>
                  <td className="px-4 py-2 font-semibold text-red-600">{item.streak}</td>
                  <td className="px-4 py-2">{item.lastAt ? new Date(item.lastAt).toLocaleString() : "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
