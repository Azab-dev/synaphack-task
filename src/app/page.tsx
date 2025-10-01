import Link from 'next/link';
import React from 'react';

type EventItem = {
  _id: string;
  title: string;
  description: string;
  date: string;
};

async function fetchEvents(): Promise<EventItem[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/events`, {
    cache: 'no-store',
  });
  const data = await res.json();
  return data.events || [];
}

export default async function HomePage() {
  const events = await fetchEvents();
  return (
    <div className="space-y-6">
      <h1 className="page-title">Upcoming Hackathons</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {events.map((ev: EventItem) => (
          <div className="card p-5 flex flex-col gap-3" key={ev._id}>
            <div className="text-lg font-semibold">{ev.title}</div>
            <div className="text-sm text-[var(--muted)]">{new Date(ev.date).toLocaleString()}</div>
            <p className="text-sm leading-relaxed">{ev.description}</p>
            <div className="mt-2">
              <Link href={`/events/${ev._id}`} className="btn-primary">Apply</Link>
            </div>
          </div>
        ))}
        {events.length === 0 && (
          <div className="text-sm text-[var(--muted)]">No events yet.</div>
        )}
      </div>
    </div>
  );
}