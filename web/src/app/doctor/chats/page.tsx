"use client";

import { useEffect, useState } from "react";

interface Thread {
  conversationId: string;
  peer: { id: string; name: string | null; email: string };
  last: { text: string; createdAt: string } | null;
}

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  createdAt: string;
}

export default function DoctorChatsPage() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingThreads, setLoadingThreads] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [input, setInput] = useState("");

  useEffect(() => {
    const loadThreads = async () => {
      try {
        const res = await fetch("/api/chat/threads");
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error || "Failed to load chats");
        }
        const data = (await res.json()) as { items: Thread[] };
        setThreads(data.items || []);
        if (data.items && data.items.length > 0) {
          setActiveId(data.items[0].conversationId);
        }
      } catch (e: any) {
        setError(e?.message || "Failed to load chats");
      } finally {
        setLoadingThreads(false);
      }
    };
    loadThreads();
  }, []);

  useEffect(() => {
    if (!activeId) return;
    const loadMessages = async () => {
      setLoadingMessages(true);
      try {
        const res = await fetch(`/api/chat/messages?conversationId=${encodeURIComponent(activeId)}`);
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error || "Failed to load messages");
        }
        const data = (await res.json()) as { items: Message[] };
        setMessages(data.items || []);
      } catch (e: any) {
        setError(e?.message || "Failed to load messages");
      } finally {
        setLoadingMessages(false);
      }
    };
    loadMessages();
  }, [activeId]);

  const activeThread = threads.find((t) => t.conversationId === activeId) || null;

  const sendMessage = async () => {
    if (!activeId || !input.trim()) return;
    setSending(true);
    try {
      const res = await fetch("/api/chat/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId: activeId, text: input }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to send message");
      }
      if (data.message) {
        setMessages((prev) => [...prev, data.message as Message]);
        setInput("");
      }
    } catch (e: any) {
      setError(e?.message || "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] gap-4">
      <aside className="w-64 flex-shrink-0 bg-[var(--color-surface)] rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-3 flex flex-col">
        <h2 className="text-sm font-semibold mb-2">Chats</h2>
        {loadingThreads && <p className="text-xs text-[var(--color-foreground)]/70">Loading threads...</p>}
        {!loadingThreads && threads.length === 0 && (
          <p className="text-xs text-[var(--color-foreground)]/70">No chat threads yet.</p>
        )}
        <div className="flex-1 overflow-y-auto mt-1 space-y-1">
          {threads.map((t) => (
            <button
              key={t.conversationId}
              onClick={() => setActiveId(t.conversationId)}
              className={`w-full text-left px-3 py-2 rounded text-xs hover:bg-[var(--color-primary)]/10 transition ${
                activeId === t.conversationId ? "bg-[var(--color-primary)]/20 text-[var(--color-primary)]" : ""
              }`}
            >
              <div className="font-medium text-sm">{t.peer.name || "Patient"}</div>
              <div className="text-[10px] text-[var(--color-foreground)]/70 truncate">{t.last?.text || "No messages yet"}</div>
            </button>
          ))}
        </div>
      </aside>
      <section className="flex-1 flex flex-col bg-[var(--color-surface)] rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        {error && (
          <p className="text-sm text-red-600 mb-2" role="alert">
            {error}
          </p>
        )}
        {activeThread ? (
          <>
            <header className="mb-3 border-b border-gray-200 dark:border-gray-800 pb-2">
              <h2 className="text-lg font-semibold">{activeThread.peer.name || "Patient"}</h2>
              <p className="text-xs text-[var(--color-foreground)]/70">{activeThread.peer.email}</p>
            </header>
            <div className="flex-1 overflow-y-auto space-y-2 mb-3 pr-1">
              {loadingMessages && <p className="text-sm text-[var(--color-foreground)]/70">Loading messages...</p>}
              {!loadingMessages && messages.length === 0 && (
                <p className="text-sm text-[var(--color-foreground)]/70">No messages yet. Start the conversation.</p>
              )}
              {messages.map((m) => (
                <div key={m.id} className="max-w-md rounded-lg bg-gray-100 dark:bg-gray-900/60 px-3 py-2 text-sm">
                  <p>{m.text}</p>
                  <p className="mt-1 text-[10px] text-[var(--color-foreground)]/60">
                    {new Date(m.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-auto flex gap-2">
              <input
                className="flex-1 border rounded px-3 py-2 bg-white/80 dark:bg-black/20 text-sm"
                placeholder="Type a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
              />
              <button
                onClick={sendMessage}
                disabled={sending || !input.trim()}
                className="px-4 py-2 rounded bg-[var(--color-primary)] text-white text-sm disabled:opacity-60 hover:opacity-90 transition"
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-sm text-[var(--color-foreground)]/70">
            Select a thread to start chatting.
          </div>
        )}
      </section>
    </div>
  );
}
