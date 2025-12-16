"use client";

import { useEffect, useState } from "react";

interface Patient {
  id: string;
  name: string | null;
  email: string;
  rollNo: string | null;
  instituteName: string | null;
}

export default function DoctorPatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/doctor/patients");
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error || "Failed to load patients");
        }
        const data = (await res.json()) as { patients: Patient[] };
        setPatients(data.patients || []);
      } catch (e: any) {
        setError(e?.message || "Failed to load patients");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Patient List</h1>
      {loading && <p className="text-sm text-[var(--color-foreground)]/70">Loading patients...</p>}
      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
      {!loading && !error && patients.length === 0 && (
        <p className="text-sm text-[var(--color-foreground)]/70">No patients assigned yet.</p>
      )}
      {!loading && !error && patients.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-[var(--color-surface)]">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-900/40">
              <tr>
                <th className="px-4 py-2 text-left font-medium">Name</th>
                <th className="px-4 py-2 text-left font-medium">Email</th>
                <th className="px-4 py-2 text-left font-medium">Patient ID</th>
                <th className="px-4 py-2 text-left font-medium">Institute / Hospital</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((p) => (
                <tr key={p.id} className="border-t border-gray-100 dark:border-gray-800">
                  <td className="px-4 py-2">{p.name || "Unknown"}</td>
                  <td className="px-4 py-2">{p.email}</td>
                  <td className="px-4 py-2">{p.rollNo || "-"}</td>
                  <td className="px-4 py-2">{p.instituteName || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
