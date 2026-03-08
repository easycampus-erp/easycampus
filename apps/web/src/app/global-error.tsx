"use client";

export default function GlobalError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-100">
        <div className="shell py-16">
          <div className="glass mx-auto max-w-3xl rounded-[32px] p-8">
            <h1 className="text-4xl font-semibold tracking-tight text-ink">Something went wrong</h1>
            <p className="mt-3 text-mist">
              The route hit an unexpected error. You can retry, or return to a safe dashboard page.
            </p>
            <pre className="mt-6 overflow-auto rounded-3xl bg-slate-950 p-4 text-sm text-slate-100">{error.message}</pre>
            <div className="mt-6 flex flex-wrap gap-3">
              <button type="button" onClick={reset} className="rounded-full bg-brand px-5 py-3 font-semibold text-white shadow-soft">
                Try again
              </button>
              <a href="/" className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold">
                Go home
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
