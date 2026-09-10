import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createAdmin, deleteAdmin } from "@/lib/actions/admins";
import { formatDate } from "@/lib/format";

export default async function ManageAdminsPage() {
  const session = await getServerSession(authOptions);
  const admins = await prisma.adminUser.findMany({ orderBy: { createdAt: "asc" } });

  return (
    <div>
      <h1 className="font-display text-3xl text-ink">Manage admins</h1>
      <p className="mt-1 text-sm text-ink/60">
        Everyone listed here can sign in and manage every part of the site.
      </p>

      <div className="mt-8 max-w-md bg-paper p-6">
        <h2 className="font-display text-lg text-ink">Add an admin</h2>
        <form action={createAdmin} className="mt-4 space-y-4">
          <Field label="Name">
            <input name="name" required className={inputClass} />
          </Field>
          <Field label="Email">
            <input name="email" type="email" required className={inputClass} />
          </Field>
          <Field label="Password (min. 8 characters)">
            <input name="password" type="password" required minLength={8} className={inputClass} />
          </Field>
          <button type="submit" className="bg-pine px-5 py-2.5 text-sm font-medium text-paper hover:bg-ink">
            Add admin
          </button>
        </form>
      </div>

      <div className="mt-10">
        <h2 className="font-display text-lg text-ink">Current admins</h2>
        <ul className="mt-4 divide-y divide-mist bg-paper">
          {admins.map((admin) => {
            const isYou = session?.user?.email === admin.email;
            return (
              <li key={admin.id} className="flex items-center justify-between px-6 py-4">
                <div>
                  <p className="font-medium text-ink">
                    {admin.name} {isYou && <span className="ml-2 text-xs text-brass">You</span>}
                  </p>
                  <p className="text-sm text-ink/50">
                    {admin.email} · Added {formatDate(admin.createdAt)}
                  </p>
                </div>
                {!isYou && admins.length > 1 && (
                  <form action={deleteAdmin.bind(null, admin.id)}>
                    <button type="submit" className="text-sm text-ink/40 hover:text-red-600">
                      Remove
                    </button>
                  </form>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

const inputClass = "w-full border border-mist bg-white px-3 py-2 text-sm text-ink focus:border-brass";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm text-ink/70">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
