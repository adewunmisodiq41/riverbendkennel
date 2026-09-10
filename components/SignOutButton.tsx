"use client";

import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/admin/login" })}
      className="text-sm text-paper/70 hover:text-brasslight"
    >
      Sign out
    </button>
  );
}
