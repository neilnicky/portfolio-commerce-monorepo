"use client";

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center gap-3">
        <h1 className="text-xl font-semibold">Something went wrong</h1>
        <button onClick={reset} className="rounded-md bg-white px-4 py-2 text-sm text-black">
          Try again
        </button>
      </body>
    </html>
  );
}
