"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type NotificationItem = {
  id: string;
  title: string;
  body: string;
  audience: string;
  recipientRole?: string | null;
  createdAt: string;
  readAt?: string | null;
  scheduledFor?: string | null;
  deliveredAt?: string | null;
};

export function NotificationsInbox({
  title,
  description,
  items
}: {
  title: string;
  description: string;
  items: NotificationItem[];
}) {
  const router = useRouter();
  const [filter, setFilter] = useState<"all" | "unread" | "scheduled">("all");
  const [message, setMessage] = useState("");

  const filtered = useMemo(() => {
    if (filter === "unread") return items.filter((item) => !item.readAt);
    if (filter === "scheduled") return items.filter((item) => item.scheduledFor && !item.deliveredAt);
    return items;
  }, [filter, items]);

  async function markAsRead(id: string) {
    const response = await fetch("/api/notifications/read", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id })
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error ?? "Unable to mark notification as read.");
    setMessage(result.message ?? "Updated.");
    router.refresh();
  }

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-4xl font-semibold tracking-tight text-ink">{title}</h1>
        <p className="mt-2 text-mist">{description}</p>
      </div>
      <div className="flex flex-wrap gap-3">
        {(["all", "unread", "scheduled"] as const).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setFilter(item)}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${filter === item ? "bg-brand text-white" : "border border-slate-300 bg-white text-ink"}`}
          >
            {item}
          </button>
        ))}
        <span className="self-center text-sm text-mist">{message}</span>
      </div>
      <div className="grid gap-4">
        {filtered.length === 0 ? (
          <div className="glass rounded-[32px] p-6 text-mist">No notifications found for this filter.</div>
        ) : (
          filtered.map((item) => (
            <article key={item.id} className="glass rounded-[32px] p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-ink">{item.title}</h2>
                  <p className="mt-2 text-sm text-mist">{item.body}</p>
                </div>
                {!item.readAt ? (
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        await markAsRead(item.id);
                      } catch (error) {
                        setMessage(error instanceof Error ? error.message : "Unable to mark read.");
                      }
                    }}
                    className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold"
                  >
                    Mark Read
                  </button>
                ) : (
                  <span className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">Read</span>
                )}
              </div>
              <p className="mt-3 text-sm text-mist">
                {item.audience}
                {item.recipientRole ? ` | ${item.recipientRole}` : ""}
                {item.scheduledFor ? ` | Scheduled ${new Date(item.scheduledFor).toLocaleString()}` : ""}
                {item.deliveredAt ? ` | Delivered ${new Date(item.deliveredAt).toLocaleString()}` : ""}
                {` | Created ${new Date(item.createdAt).toLocaleString()}`}
              </p>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
