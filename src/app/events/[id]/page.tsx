import React from 'react';
import { notFound } from 'next/navigation';

async function fetchEvent(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/events/${id}`, { cache: 'no-store' });
  if (res.status === 404) return null;
  return res.json();
}

export default async function EventDetails({ params }: { params: { id: string } }) {
  const data = await fetchEvent(params.id);
  if (!data?.event) return notFound();
  const ev = data.event as { _id: string; title: string; description: string; date: string };
  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2 card p-5 space-y-3">
        <h1 className="page-title">{ev.title}</h1>
        <div className="text-sm text-[var(--muted)]">{new Date(ev.date).toLocaleString()}</div>
        <p className="text-sm leading-relaxed">{ev.description}</p>
      </div>
      <div className="card p-5">
        <h2 className="font-semibold mb-4">Register</h2>
        <form className="space-y-3" action={`/api/registrations`} method="post">
          <input type="hidden" name="eventId" value={ev._id} />
          <div>
            <label className="label">Name</label>
            <input className="input" name="name" required />
          </div>
          <div>
            <label className="label">Email</label>
            <input className="input" name="email" type="email" required />
          </div>
          <div>
            <label className="label">College</label>
            <input className="input" name="college" required />
          </div>
          <div>
            <label className="label">Phone</label>
            <input className="input" name="phone" required />
          </div>
          <div>
            <label className="label">Team Name (optional)</label>
            <input className="input" name="teamName" />
          </div>
          <SubmitButton />
        </form>
      </div>
    </div>
  );
}

function SubmitButton() {
  return (
    <button className="btn-primary w-full" formAction={async (formData: FormData) => {
      'use server';
      const payload = Object.fromEntries(formData.entries());
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/registrations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        throw new Error('Registration failed');
      }
    }}>Submit</button>
  );
}