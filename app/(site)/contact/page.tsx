import InquiryForm from "@/components/InquiryForm";
import { getSettings } from "@/lib/actions/settings";

export const metadata = { title: "Contact us" };

export default async function ContactPage() {
  const settings = await getSettings();

  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="font-display text-4xl text-ink">Contact us</h1>
      <p className="mt-2 max-w-prose text-ink/60">
        Questions about a dog, a stud, or our breeding program — send us a message and we'll
        reply within a day or two.
      </p>

      <div className="mt-10 grid gap-12 md:grid-cols-[1.3fr,1fr]">
        <div>
          <InquiryForm type="GENERAL" subjectLabel={settings.siteName} />
        </div>

        <div className="space-y-8 border-t border-mist pt-8 md:border-t-0 md:border-l md:pl-12 md:pt-0">
          <div>
            <p className="text-sm font-medium text-ink">Phone</p>
            <a href="tel:+15555550123" className="text-ink/70 hover:text-brass">
              (555) 555-0123
            </a>
          </div>
          <div>
            <p className="text-sm font-medium text-ink">Email</p>
            <a href="mailto:hello@riverbendkennel.com" className="text-ink/70 hover:text-brass">
              hello@riverbendkennel.com
            </a>
          </div>
          <div>
            <p className="text-sm font-medium text-ink">Location</p>
            <p className="text-ink/70">Rural Route 4, Millbrook</p>
            <p className="text-ink/70">Open by appointment</p>
          </div>
          <div>
            <p className="text-sm font-medium text-ink">Follow along</p>
            <div className="mt-1 flex gap-4">
              <a href="#" className="text-ink/70 hover:text-brass">Instagram</a>
              <a href="#" className="text-ink/70 hover:text-brass">Facebook</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
