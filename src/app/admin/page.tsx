"use client";
import React, { useEffect, useMemo, useState } from 'react';

type EventItem = {
  _id?: string;
  title: string;
  description: string;
  date: string;
  location?: string;
};

export default function AdminPage() {
  const [token, setToken] = useState<string | null>(null);
  const [creds, setCreds] = useState({ email: '', password: '' });
  const [events, setEvents] = useState<EventItem[]>([]);
  const [editing, setEditing] = useState<EventItem | null>(null);
  const baseUrl = useMemo(() => process.env.NEXT_PUBLIC_BASE_URL || '', []);

  useEffect(() => {
    const t = localStorage.getItem('adminToken');
    if (t) setToken(t);
  }, []);

  useEffect(() => {
    if (!token) return;
    fetch(`${baseUrl}/api/events`).then((r) => r.json()).then((d) => setEvents(d.events || []));
  }, [token, baseUrl]);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(creds),
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem('adminToken', data.token);
      setToken(data.token);
    } else {
      alert(data.error || 'Login failed');
    }
  }

  async function saveEvent(ev: EventItem) {
    const method = ev._id ? 'PUT' : 'POST';
    const url = ev._id ? `${baseUrl}/api/events/${ev._id}` : `${baseUrl}/api/events`;
    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(ev),
    });
    const data = await res.json();
    if (!res.ok) return alert(data.error || 'Failed');
    if (method === 'POST') setEvents((prev) => [data.event, ...prev]);
    else setEvents((prev) => prev.map((e) => (e._id === data.event._id ? data.event : e)));
    setEditing(null);
  }

  async function deleteEvent(id?: string) {
    if (!id) return;
    if (!confirm('Delete this event?')) return;
    const res = await fetch(`${baseUrl}/api/events/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!res.ok) return alert('Delete failed');
    setEvents((prev) => prev.filter((e) => e._id !== id));
  }

  if (!token) {
    return (
      <div className="max-w-md mx-auto card p-6">
        <h1 className="page-title mb-4">Admin Login</h1>
        <form onSubmit={login} className="space-y-3">
          <div>
            <label className="label">Email</label>
            <input className="input" value={creds.email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCreds({ ...creds, email: e.target.value })} />
          </div>
          <div>
            <label className="label">Password</label>
            <input type="password" className="input" value={creds.password} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCreds({ ...creds, password: e.target.value })} />
          </div>
          <button className="btn-primary w-full">Login</button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="page-title">Manage Events</h1>
        <div className="flex gap-2">
          <button className="btn-secondary" onClick={() => setEditing({ title: '', description: '', date: new Date().toISOString().slice(0,16), location: '' })}>Add Event</button>
          <button className="btn-secondary" onClick={() => { localStorage.removeItem('adminToken'); setToken(null); }}>Logout</button>
        </div>
      </div>

      {editing && (
        <div className="card p-5">
          <h2 className="font-semibold mb-3">{editing._id ? 'Edit Event' : 'New Event'}</h2>
          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <label className="label">Title</label>
              <input className="input" value={editing.title} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditing({ ...editing, title: e.target.value })} />
            </div>
            <div>
              <label className="label">Date</label>
              <input type="datetime-local" className="input" value={editing.date} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditing({ ...editing, date: e.target.value })} />
            </div>
            <div className="md:col-span-2">
              <label className="label">Description</label>
              <textarea className="input h-28" value={editing.description} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEditing({ ...editing, description: e.target.value })} />
            </div>
            <div className="md:col-span-2">
              <label className="label">Location (optional)</label>
              <input className="input" value={editing.location || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditing({ ...editing, location: e.target.value })} />
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <button className="btn-primary" onClick={() => saveEvent(editing)}>Save</button>
            <button className="btn-secondary" onClick={() => setEditing(null)}>Cancel</button>
          </div>
        </div>
      )}

      <div className="grid gap-3">
        {events.map((ev) => (
          <div key={ev._id} className="card p-4 flex items-start justify-between gap-3">
            <div>
              <div className="font-semibold">{ev.title}</div>
              <div className="text-xs text-[var(--muted)]">{new Date(ev.date).toLocaleString()}</div>
            </div>
            <div className="flex gap-2">
              <button className="btn-secondary" onClick={() => setEditing(ev)}>Edit</button>
              <button className="btn-secondary" onClick={() => deleteEvent(ev._id)}>Delete</button>
            </div>
          </div>
        ))}
        {events.length === 0 && <div className="text-sm text-[var(--muted)]">No events yet.</div>}
      </div>
    </div>
  );
}
