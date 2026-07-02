"use client";

export default function ProductsError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-red-400">Could not load products.</p>
      <button onClick={reset} className="w-fit rounded-md bg-white px-4 py-2 text-sm text-black">
        Retry
      </button>
    </div>
  );
}
