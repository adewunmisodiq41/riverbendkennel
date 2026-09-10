"use client";

import { setInquiryStatusFromForm } from "@/lib/actions/inquiries";
import type { InquiryStatus } from "@prisma/client";

export default function InquiryStatusSelect({ id, status }: { id: string; status: InquiryStatus }) {
  return (
    <form action={setInquiryStatusFromForm}>
      <input type="hidden" name="id" value={id} />
      <select
        name="status"
        defaultValue={status}
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
        className="border border-mist bg-white px-2 py-1 text-xs text-ink"
      >
        <option value="NEW">New</option>
        <option value="CONTACTED">Contacted</option>
        <option value="CLOSED">Closed</option>
      </select>
    </form>
  );
}
