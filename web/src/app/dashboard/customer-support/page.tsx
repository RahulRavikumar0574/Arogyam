"use client";

import { useState } from "react";

export default function CustomerSupportPage() {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For now we just show a local confirmation; backend integration can be added later.
    if (!message.trim()) return;
    setStatus("Your message has been recorded locally. Support will review this in the next version.");
    setMessage("");
  };

  return (
    <div className="max-w-xl space-y-4">
      <h1 className="text-2xl font-semibold">Customer Support</h1>
      <p className="text-sm text-[var(--color-foreground)]/70">
        If you&apos;re facing issues with the portal, describe them below. In a deployed version, this would send a ticket
        to the support team.
      </p>
      <div className="rounded-xl bg-[var(--color-surface)] border border-gray-200 dark:border-gray-700 p-4 space-y-3">
        <p className="text-sm">
          You can also reach out via email: <span className="font-mono">support@example.com</span>
        </p>
        <form onSubmit={onSubmit} className="space-y-2">
          <textarea
            className="w-full min-h-[120px] border rounded px-3 py-2 bg-white/80 dark:bg-black/20 text-sm"
            placeholder="Describe your issue or feedback..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            type="submit"
            className="px-4 py-2 rounded bg-[var(--color-primary)] text-white text-sm hover:opacity-90 transition"
          >
            Submit feedback
          </button>
        </form>
        {status && (
          <p className="text-xs text-emerald-600" role="status">
            {status}
          </p>
        )}
      </div>
    </div>
  );
}
