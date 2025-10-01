import type { Metadata } from 'next';
import React from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'Hackathon Platform',
  description: 'Simple hackathon events platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header className="border-b border-slate-800">
          <nav className="container py-4 flex items-center justify-between">
            <a href="/" className="font-semibold">Hackathon Platform</a>
            <div className="flex gap-3 text-sm">
              <a href="/" className="hover:underline">Home</a>
              <a href="/admin" className="hover:underline">Admin</a>
            </div>
          </nav>
        </header>
        <main className="container py-6 md:py-10">{children}</main>
        <footer className="container py-10 text-center text-xs text-[var(--muted)]">
          Built for a hackathon task
        </footer>
      </body>
    </html>
  );
}
