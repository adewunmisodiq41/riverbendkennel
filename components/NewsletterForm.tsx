"use client";

import { useState } from "react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      if (!res.ok) throw new Error("failed");
      setStatus("done");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return <p className="text-sm text-brasslight">You're on the list — watch for our next update.</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
      <input
        type="email"
        required
        placeholder="your@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border border-paper/30 bg-transparent px-4 py-3 text-sm text-paper placeholder:text-paper/40 focus:border-brass sm:max-w-xs"
      />
      <button
        type="submit"
        disabled={status === "sending"}
        className="whitespace-nowrap bg-brass px-6 py-3 text-sm font-medium text-ink transition-colors hover:bg-brasslight disabled:opacity-60"
      >
        {status === "sending" ? "Sending…" : "Get updates"}
      </button>
      {status === "error" && (
        <p className="text-sm text-red-300">
          That didn't go through — check the address and try again.
        </p>
      )}
    </form>
  );
}
