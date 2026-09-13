# Riverbend Kennel — Website + Admin Dashboard

Production codebase for a kennel website: Next.js 14 (App Router) + TypeScript,
Tailwind CSS, Prisma + PostgreSQL, and NextAuth for the admin login.

"Riverbend Kennel" is a placeholder name/brand throughout — swap it in
`app/layout.tsx`, `components/SiteHeader.tsx`, and `components/SiteFooter.tsx`
once you have a real kennel name, address, phone, and email.

## What's built so far (Phase 1)

- Full database schema (`prisma/schema.prisma`) covering every section in the
  brief: dogs, studs, pedigrees, breeding programs, litters, waitlist,
  announcements, blog, inquiries, testimonials, and newsletter — so later
  phases don't require schema rewrites.
- Public home page, pulling live (currently empty) data for featured dogs,
  studs, litters, announcements, blog posts, and testimonials, with proper
  empty states.
- Public site shell: header/nav, footer, and placeholder pages for every
  route in the nav (Dogs, Studs, Breeding, Litters, Pedigree, Announcements,
  Blog, About, Contact) so nothing 404s while later phases are built.
- Admin dashboard shell: secure login (NextAuth credentials against the
  `AdminUser` table), a protected layout with sidebar navigation to every
  section, and an overview page with live counts.
- Newsletter signup, wired end-to-end to the database.

## Phase 2 — Dogs for Sale (done)

- Public listing at `/dogs` with filters for gender, breed, age (puppy/adult),
  and availability (available/reserved/sold/all) — implemented as a plain
  `GET` form, so it works without JavaScript.
- Public detail page at `/dogs/[slug]` with a photo gallery, full profile
  (breed, gender, age, color, weight, price, description, health notes), and
  an inquiry form that saves straight to the `Inquiry` table.
- Admin CRUD at `/admin/dogs`: add, edit, delete, and a one-click status
  changer (available/reserved/sold) — all as real Server Actions, no separate
  API routes needed.
- Photos: drag-and-drop or click-to-browse upload straight from the admin
  form, powered by Vercel Blob (files go directly from the browser to
  storage, so there's no server-side file-size limit to worry about). A
  "paste an image URL instead" fallback is still there for photos already
  hosted elsewhere. Requires `BLOB_READ_WRITE_TOKEN` in `.env` — see setup
  step 4 above.
- Inquiries submitted from a dog's page are saved but not yet visible in the
  admin dashboard — that lands with the Contact/Inquiry Management phase.

## Coming in later phases (in the agreed order)

Studs → Breeding Services → Pedigree → Announcements → Blog → Upcoming
Litters + Waitlist → Contact/Inquiry management.

## Local setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up a database.** Any PostgreSQL works. For a free hosted one:
   - [Neon](https://neon.tech) or [Supabase](https://supabase.com) — create a
     project, copy the connection string.

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Fill in `DATABASE_URL`, and generate `NEXTAUTH_SECRET` with:
   ```bash
   openssl rand -base64 32
   ```

4. **Set up photo uploads (Vercel Blob)**
   - Go to your project on [vercel.com](https://vercel.com) → **Storage** tab →
     **Create Database** → **Blob**.
   - Copy the `BLOB_READ_WRITE_TOKEN` it gives you into `.env`.
   - Don't have a Vercel project yet? You can create just the Blob store on
     its own from the Vercel dashboard (Storage → Create) before deploying
     anything — it works the same locally via `.env`.
   - Without this token, admin photo uploads will fail — everything else
     works fine without it.

5. **Create the database tables**
   ```bash
   npm run db:push
   ```

6. **Create your first admin login**
   ```bash
   npm run db:seed
   ```
   This uses `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` from `.env` (or the
   defaults in `prisma/seed.ts` if unset). Log in at `/admin/login` and note
   there's no "change password" screen yet — that's worth adding before you
   put this live, or reset it directly in the database.

7. **Run the dev server**
   ```bash
   npm run dev
   ```
   Visit `http://localhost:3000` for the site and `/admin/login` for the
   dashboard.

## Deployment

This is a standard Next.js + Prisma app, so it deploys cleanly to
[Vercel](https://vercel.com) (recommended) or any Node host:

1. Push this repo to GitHub.
2. Import it into Vercel.
3. Add the same environment variables from `.env` in the Vercel project
   settings (use your production database's connection string, and set
   `NEXTAUTH_URL` to your real domain).
4. Deploy. Run `npm run db:push` and `npm run db:seed` once against the
   production database (from your machine, pointed at the production
   `DATABASE_URL`, or via a one-off Vercel deploy hook).

## Project structure

```
app/
  (site)/            Public pages — home, dogs, studs, etc. (share header/footer)
  admin/
    (auth)/login/    Admin sign-in (no sidebar)
    (dashboard)/     Admin pages behind auth (sidebar chrome)
  api/               Route handlers (auth, newsletter, and more as phases land)
components/          Shared UI
lib/                 Prisma client, auth config, formatting helpers
prisma/              Database schema + seed script
middleware.ts        Protects all /admin routes except /admin/login
```

## Design notes

Palette: deep pine green (`#2F4030`) and near-black ink (`#1C2418`) against a
warm parchment background (`#F6F2E9`), with a muted brass (`#A9812C`) accent —
built to feel like a kennel club registry rather than a generic SaaS
template. Headlines use Fraunces (serif), body text uses Work Sans. See
`tailwind.config.ts` for the full token set.

## All phases — status

All nine build phases from the brief are implemented:

1. Home + admin dashboard structure
2. Dogs for sale (public + admin, drag-and-drop photo upload)
3. Available studs (public + admin)
4. Breeding services (public + admin, sire/dam pairing)
5. Pedigree (3-generation chart editor + public display)
6. Announcements (public feed + admin)
7. Blog (categories, featured post, search, related articles + admin)
8. Upcoming litters + waitlist (per-litter and general signup + admin)
9. Contact / inquiry management (contact page + admin inbox)

`About Us` is still a simple placeholder page (`app/(site)/about/page.tsx`) —
it wasn't part of the nine build phases, so it's just waiting on real copy
about the kennel. Everything else in the original brief's page list is live.

### Known limitations worth knowing about

- **Pedigree depth**: the editor supports 3 generations (the dog/stud, its
  parents, and grandparents) — the data model supports deeper trees, but the
  admin UI doesn't yet expose editing beyond grandparents.
- **No "forgot password" flow**: if you lose the admin password, reset it
  directly in the database (or re-run the seed script after deleting the
  `AdminUser` row).
- **Single admin role in practice**: the schema has a `role` field
  (`ADMIN`/`EDITOR`) but nothing currently restricts EDITOR permissions —
  every signed-in admin can do everything.
- **Blog cover images** use a plain URL field rather than the drag-and-drop
  uploader Dogs/Studs/Litters have — easy to add later using the same
  `ImageUrlFields` pattern.

## Branding, Admin Management, and About Us (added after initial launch)

- **Branding** (`/admin/settings/branding`): change the business name and
  upload a logo, used site-wide (header, footer, admin sidebar) and as the
  browser tab icon/favicon.
- **Manage admins** (`/admin/settings/admins`): add or remove admin logins
  from the dashboard — no more editing the database by hand. You can't
  remove yourself while signed in, or remove the last remaining admin.
- **About Us** (`/admin/about`): fully editable heading, story text, and an
  optional photo — no longer a static placeholder.

**Deploying these**: these three features added two new database tables
(`Settings` and `AboutPage`). After pushing the code, you must also run
`npm run db:push` against your database once — otherwise these pages will
error even though the code deployed successfully.

## Photo upload — how it actually works (revised)

The original version used Vercel Blob's *direct-to-storage client upload*
flow (browser talks to Blob storage directly using a short-lived token).
That triggered a CORS/400 error in production for reasons that weren't
fully diagnosable without deeper access to the deployed environment.

It's since been switched to a simpler, more reliable pattern: the browser
uploads the file to our own `/api/upload` route as a normal `multipart/form-data`
POST, and the server calls Vercel Blob's `put()` directly. This trades away
one thing — **files are capped at 4MB** (Vercel's serverless function
request body limit) instead of the original 15MB — for something that
actually works reliably. If you need larger uploads later, revisiting the
direct-to-client-storage approach (or compressing images client-side before
upload) are the two paths to explore.

## Homepage animation bug (fixed) + Homepage content editor (new)

The scroll-triggered fade-in animation on homepage sections was causing a
serious visual bug: with little or no real content added yet (no dogs,
studs, litters, etc.), several short sections stacked up while still
"waiting" to fade in, looking like one large blank dead zone on the page.
The animation has been removed from the homepage entirely — all sections
now render immediately and visibly.

Also added: **Homepage content** (`/admin/homepage`) — edit the hero
headline, subtext, and photo without touching code. This adds one more new
database table (`HomepageContent`), so — like the other recent additions —
remember to run `npm run db:push` after deploying this update.

## Featured Videos (new)

A homepage video showcase — a horizontally scrolling row of hover-to-play
video cards ("See Our Kennel"), fully managed from the admin dashboard.

**How it works:**
- Desktop: hovering a card plays it (muted, looping); moving to another
  card pauses the first and plays the new one — only one plays at a time.
- Touch devices: tapping a card plays/pauses it instead (hover doesn't
  exist on touch, so this is detected automatically).
- A video with no thumbnail just shows its title as a placeholder until
  played.

**Uploading a video** (`/admin/videos` → "Add a video"):
1. Enter a title and optional description.
2. Drag in (or click to browse) the video file itself — MP4, WebM, or MOV,
   up to 500MB. This uploads directly from your browser to storage (not
   through the server), which is why it can handle much larger files than
   photo uploads. Duration is detected automatically.
3. Optionally upload a thumbnail image — shown before the video plays.
4. Leave "Show on the homepage" checked (or uncheck to save a draft without
   publishing it yet).
5. Save. It appears at the end of the homepage row immediately.

**Reordering**: on the `/admin/videos` list, use the ▲/▼ arrows next to
each video — the order there is exactly the order visitors see on the
homepage. (Drag-and-drop wasn't added to avoid pulling in an extra
library just for this — the arrows do the same job.)

**Hiding without deleting**: use the "Shown/Hidden" dropdown on each video
to pull it from the homepage without losing the upload.

This adds one more new database table (`Video`) — remember the now-familiar
step: after deploying, run `npm run db:push` once.
