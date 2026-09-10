import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="border-t border-mist bg-ink text-paper">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-3">
        <div>
          <p className="font-display text-lg">Riverbend Kennel</p>
          <p className="mt-3 max-w-prose text-sm text-paper/70">
            Breeding for health, temperament, and pedigree, one litter at a time.
          </p>
        </div>

        <div className="text-sm text-paper/70">
          <p className="font-medium text-paper">Visit</p>
          <p className="mt-3">Rural Route 4, Millbrook</p>
          <p>Open by appointment</p>
        </div>

        <div className="text-sm text-paper/70">
          <p className="font-medium text-paper">Reach us</p>
          <p className="mt-3">
            <a href="tel:+15555550123" className="hover:text-brasslight">
              (555) 555-0123
            </a>
          </p>
          <p>
            <a href="mailto:hello@riverbendkennel.com" className="hover:text-brasslight">
              hello@riverbendkennel.com
            </a>
          </p>
          <div className="mt-3 flex gap-4">
            <a href="#" className="hover:text-brasslight">Instagram</a>
            <a href="#" className="hover:text-brasslight">Facebook</a>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-2 border-t border-paper/10 px-6 py-5 text-center text-xs text-paper/50 sm:flex-row sm:justify-between">
        <p>© {new Date().getFullYear()} Riverbend Kennel. All rights reserved.</p>
        <Link href="/admin/login" className="hover:text-brasslight">
          Admin sign in
        </Link>
      </div>
    </footer>
  );
}
