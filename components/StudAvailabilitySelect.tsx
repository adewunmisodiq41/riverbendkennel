"use client";

import { toggleStudAvailabilityFromForm } from "@/lib/actions/studs";

export default function StudAvailabilitySelect({ id, isAvailable }: { id: string; isAvailable: boolean }) {
  return (
    <form action={toggleStudAvailabilityFromForm}>
      <input type="hidden" name="id" value={id} />
      <select
        name="isAvailable"
        defaultValue={String(isAvailable)}
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
        className="border border-mist bg-white px-2 py-1 text-xs text-ink"
      >
        <option value="true">Available</option>
        <option value="false">Not available</option>
      </select>
    </form>
  );
}
