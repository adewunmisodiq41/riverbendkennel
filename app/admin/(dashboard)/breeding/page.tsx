import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteBreedingProgram } from "@/lib/actions/breeding";

export default async function AdminBreedingPage() {
  const programs = await prisma.breedingProgram.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl text-ink">Breeding services</h1>
        <Link href="/admin/breeding/new" className="bg-pine px-5 py-2.5 text-sm font-medium text-paper hover:bg-ink">
          Add a program
        </Link>
      </div>

      {programs.length === 0 ? (
        <div className="mt-8 border border-dashed border-mist bg-paper p-10 text-center text-sm text-ink/60">
          Nothing here yet.{" "}
          <Link href="/admin/breeding/new" className="text-brass hover:text-brasslight">
            Add your first pairing or program
          </Link>
          .
        </div>
      ) : (
        <ul className="mt-8 divide-y divide-mist bg-paper">
          {programs.map((p) => (
            <li key={p.id} className="flex items-center justify-between px-6 py-4">
              <div>
                <p className="font-medium text-ink">
                  {p.title} {p.isFeatured && <span className="ml-2 text-xs text-brass">Featured</span>}
                </p>
                <p className="text-sm text-ink/50">{p.publishedAt ? "Published" : "Draft"}</p>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <Link href={`/admin/breeding/${p.id}/edit`} className="text-brass hover:text-brasslight">
                  Edit
                </Link>
                <form action={deleteBreedingProgram.bind(null, p.id)}>
                  <button type="submit" className="text-ink/40 hover:text-red-600">
                    Delete
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
