"use client";

import { updateDogStatusFromForm } from "@/lib/actions/dogs";
import type { DogStatus } from "@prisma/client";

export default function DogStatusSelect({ id, status }: { id: string; status: DogStatus }) {
  return (
    <form action={updateDogStatusFromForm}>
      <input type="hidden" name="id" value={id} />
      <select
        name="status"
        defaultValue={status}
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
        className="border border-mist bg-white px-2 py-1 text-xs text-ink"
      >
        <option value="AVAILABLE">Available</option>
        <option value="RESERVED">Reserved</option>
        <option value="SOLD">Sold</option>
      </select>
    </form>
  );
}
