"use client";

import { useState, type FormEvent } from "react";
import type { StorePageVm } from "@application/view-models/store-page.vm";

/** Newsletter capture — client island (prevents native submit). Presentational shell. */
export function NewsletterForm({ vm }: { vm: StorePageVm["newsletter"] }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (email) setSubmitted(true);
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-md flex-col gap-4 md:flex-row">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={vm.placeholder}
        className="flex-grow border-0 border-b border-hairline-strong bg-transparent py-3 font-body text-label-md uppercase tracking-widest transition-colors focus:border-primary focus:ring-0"
      />
      <button
        type="submit"
        className="bg-primary px-8 py-3 font-body text-label-md uppercase tracking-widest text-background transition-opacity hover:opacity-90"
      >
        {submitted ? "Subscribed" : vm.submitLabel}
      </button>
    </form>
  );
}
