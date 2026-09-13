"use client";

import { toggleVideoActiveFromForm } from "@/lib/actions/videos";

export default function VideoActiveToggle({ id, isActive }: { id: string; isActive: boolean }) {
  return (
    <form action={toggleVideoActiveFromForm}>
      <input type="hidden" name="id" value={id} />
      <select
        name="isActive"
        defaultValue={String(isActive)}
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
        className="border border-mist bg-white px-2 py-1 text-xs text-ink"
      >
        <option value="true">Shown</option>
        <option value="false">Hidden</option>
      </select>
    </form>
  );
}
