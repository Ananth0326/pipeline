'use client';

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#FDFCFB] text-[#1C1917] flex items-center justify-center p-6">
        <div className="premium-card w-[min(760px,96%)] p-8">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#78716C]">Global Render Error</p>
          <h1 className="mt-2 text-2xl font-black">Something went wrong while rendering this page.</h1>
          <p className="mt-3 text-sm text-[#78716C]">
            Digest: <span className="font-mono">{error.digest ?? 'not provided'}</span>
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-6 rounded-xl bg-[#1C1917] px-4 py-2 text-sm font-semibold text-white hover:bg-black"
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
