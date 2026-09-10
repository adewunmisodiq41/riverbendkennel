import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/format";
import { deleteInquiry } from "@/lib/actions/inquiries";
import InquiryStatusSelect from "@/components/InquiryStatusSelect";

const TYPE_LABEL: Record<string, string> = {
  DOG: "Dog",
  STUD: "Stud",
  BREEDING: "Breeding",
  GENERAL: "General"
};

export default async function AdminInquiriesPage() {
  const inquiries = await prisma.inquiry.findMany({
    orderBy: { createdAt: "desc" },
    include: { dog: { select: { name: true, slug: true } }, stud: { select: { name: true, slug: true } } }
  });

  return (
    <div>
      <h1 className="font-display text-3xl text-ink">Inquiries</h1>

      {inquiries.length === 0 ? (
        <div className="mt-8 border border-dashed border-mist bg-paper p-10 text-center text-sm text-ink/60">
          No inquiries yet — they'll show up here as visitors reach out about a dog, stud, or
          breeding program, or through the contact form.
        </div>
      ) : (
        <ul className="mt-8 divide-y divide-mist bg-paper">
          {inquiries.map((inq) => (
            <li key={inq.id} className="flex items-start justify-between gap-4 px-6 py-4">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium text-ink">{inq.name}</p>
                  <span className="bg-ink/10 px-2 py-0.5 text-xs uppercase tracking-wide text-ink/60">
                    {TYPE_LABEL[inq.type]}
                  </span>
                </div>
                <p className="text-sm text-ink/60">
                  {inq.email}
                  {inq.phone ? ` · ${inq.phone}` : ""}
                </p>
                {(inq.dog || inq.stud) && (
                  <p className="mt-1 text-sm text-ink/50">Re: {inq.dog?.name ?? inq.stud?.name}</p>
                )}
                <p className="mt-2 text-sm text-ink/70">{inq.message}</p>
                <p className="mt-2 text-xs text-ink/40">{formatDate(inq.createdAt)}</p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-3">
                <InquiryStatusSelect id={inq.id} status={inq.status} />
                <form action={deleteInquiry.bind(null, inq.id)}>
                  <button type="submit" className="text-xs text-ink/40 hover:text-red-600">
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
