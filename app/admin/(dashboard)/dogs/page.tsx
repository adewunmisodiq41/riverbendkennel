import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice, formatAge } from "@/lib/format";
import { deleteDog } from "@/lib/actions/dogs";
import DogStatusSelect from "@/components/DogStatusSelect";

export default async function AdminDogsPage() {
  const dogs = await prisma.dog.findMany({
    orderBy: { createdAt: "desc" },
    include: { images: { take: 1, orderBy: { sortOrder: "asc" } } }
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl text-ink">Dogs for sale</h1>
        <Link
          href="/admin/dogs/new"
          className="bg-pine px-5 py-2.5 text-sm font-medium text-paper hover:bg-ink"
        >
          Add a dog
        </Link>
      </div>

      {dogs.length === 0 ? (
        <div className="mt-8 border border-dashed border-mist bg-paper p-10 text-center text-sm text-ink/60">
          No dogs yet.{" "}
          <Link href="/admin/dogs/new" className="text-brass hover:text-brasslight">
            Add your first one
          </Link>
          .
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto bg-paper">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-mist text-ink/50">
              <tr>
                <th className="py-3 pl-4">Dog</th>
                <th className="py-3">Breed</th>
                <th className="py-3">Age</th>
                <th className="py-3">Price</th>
                <th className="py-3">Status</th>
                <th className="py-3 pr-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {dogs.map((dog) => (
                <tr key={dog.id} className="border-b border-mist last:border-0">
                  <td className="flex items-center gap-3 py-3 pl-4">
                    <div className="h-10 w-10 shrink-0 overflow-hidden bg-paperdim">
                      {dog.images[0] && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={dog.images[0].url} alt="" className="h-full w-full object-cover" />
                      )}
                    </div>
                    <span className="font-medium text-ink">{dog.name}</span>
                  </td>
                  <td className="py-3 text-ink/70">{dog.breed}</td>
                  <td className="py-3 text-ink/70">{formatAge(dog.birthDate)}</td>
                  <td className="py-3 text-ink/70">{formatPrice(dog.priceCents)}</td>
                  <td className="py-3">
                    <DogStatusSelect id={dog.id} status={dog.status} />
                  </td>
                  <td className="py-3 pr-4 text-right">
                    <div className="flex items-center justify-end gap-4">
                      <Link href={`/admin/dogs/${dog.id}/edit`} className="text-brass hover:text-brasslight">
                        Edit
                      </Link>
                      <form action={deleteDog.bind(null, dog.id)}>
                        <button type="submit" className="text-ink/40 hover:text-red-600">
                          Delete
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
