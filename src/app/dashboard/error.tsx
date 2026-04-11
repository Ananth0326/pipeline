'use client';

import { useEffect } from 'react';

type DashboardErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function DashboardError({ error, reset }: DashboardErrorProps) {
  useEffect(() => {
    console.error('Dashboard route error:', error);
  }, [error]);

  return (
    <div className="mx-auto mt-24 w-[min(720px,92%)] rounded-2xl border border-red-400/40 bg-red-500/10 p-6 text-white backdrop-blur-xl">
      <p className="text-xs uppercase tracking-[0.18em] text-red-200">Dashboard Render Error</p>
      <h2 className="mt-2 text-2xl font-bold">Something failed while loading this page.</h2>
      <p className="mt-3 text-sm text-red-100/90">
        Digest: <span className="font-mono">{error.digest ?? 'not provided'}</span>
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-5 rounded-lg border border-white/25 bg-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/20"
      >
        Try again
      </button>
    </div>
  );
}
