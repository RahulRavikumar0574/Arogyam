"use client";

import { useState } from "react";

type RecordItem = { predicted_emotion: string; prediction_time: string };

function parseCsv(text: string): RecordItem[] {
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length <= 1) return [];
  const header = lines[0].split(",").map((h) => h.trim().toLowerCase());
  const emotionIdx = header.findIndex((h) => h.includes("emotion"));
  const timeIdx = header.findIndex((h) => h.includes("time") || h.includes("timestamp"));
  if (emotionIdx === -1 || timeIdx === -1) return [];
  const out: RecordItem[] = [];
  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split(",");
    const emotion = parts[emotionIdx]?.trim();
    const time = parts[timeIdx]?.trim();
    if (!emotion || !time) continue;
    out.push({ predicted_emotion: emotion, prediction_time: time });
  }
  return out;
}

export default function ReportUploadPage() {
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setStatus(null);
    setError(null);
    try {
      const text = await file.text();
      const records = parseCsv(text);
      if (records.length === 0) {
        setError("Could not find emotion/time columns in the CSV.");
        return;
      }
      const existingRaw = typeof window !== "undefined" ? localStorage.getItem("emotion_records") : null;
      const existing = existingRaw ? (JSON.parse(existingRaw) as RecordItem[]) : [];
      const merged = [...existing, ...records];
      localStorage.setItem("emotion_records", JSON.stringify(merged));
      setStatus(`Imported ${records.length} records. You can now view them in the Reports page.`);
    } catch (err: any) {
      setError(err?.message || "Failed to read CSV");
    }
  };

  return (
    <div className="max-w-xl space-y-4">
      <h1 className="text-2xl font-semibold">Report Upload</h1>
      <p className="text-sm text-[var(--color-foreground)]/70">
        Upload a CSV of prediction results. The data will be stored locally in your browser and visualized on the
        Reports page.
      </p>
      <input
        type="file"
        accept=".csv,text/csv"
        onChange={onFileChange}
        className="block w-full text-sm file:mr-3 file:px-3 file:py-2 file:rounded file:border-0 file:bg-[var(--color-primary)] file:text-white file:text-sm file:cursor-pointer"
      />
      {status && (
        <p className="text-sm text-emerald-600" role="status">
          {status}
        </p>
      )}
      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
