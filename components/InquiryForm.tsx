"use client";

import { useState } from "react";

export default function InquiryForm({
  type,
  dogId,
  studId,
  subjectLabel
}: {
  type: "DOG" | "STUD" | "BREEDING" | "GENERAL";
  dogId?: string;
  studId?: string;
  subjectLabel: string;
}) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, type, dogId, studId })
      });
      if (!res.ok) throw new Error("failed");
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="border border-brass/40 bg-brass/10 p-6 text-sm text-ink">
        Thanks, {form.name.split(" ")[0] || "there"} — we've received your message about {subjectLabel}{" "}
        and will get back to you within a day or two.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <input
          type="text"
          required
          placeholder="Your name"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          className={inputClass}
        />
        <input
          type="email"
          required
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          className={inputClass}
        />
      </div>
      <input
        type="tel"
        placeholder="Phone (optional)"
        value={form.phone}
        onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
        className={inputClass}
      />
      <textarea
        required
        rows={4}
        placeholder={`I'm interested in ${subjectLabel}…`}
        value={form.message}
        onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
        className={inputClass}
      />
      <button
        type="submit"
        disabled={status === "sending"}
        className="bg-pine px-6 py-3 text-sm font-medium text-paper transition-colors hover:bg-ink disabled:opacity-60"
      >
        {status === "sending" ? "Sending…" : "Send inquiry"}
      </button>
      {status === "error" && (
        <p className="text-sm text-red-600">Something went wrong — please try again.</p>
      )}
    </form>
  );
}

const inputClass = "w-full border border-mist bg-white px-4 py-2.5 text-sm text-ink focus:border-brass";
