# Nadova Labs — Project Progress

**Last updated:** 2026-02-26
**Status:** Live on nadova.vercel.app
**Repo:** github.com/mevBlaze/nadova (main + master branches)

---

## What's Built & Working

### Public Site
- Landing page, About, Contact, Products, Quiz pages (hardcoded content)
- QR product verification pages at `/q1` through `/q100+` (SSR, fetches from Supabase)
- Dark theme, Space Grotesk + Syne + JetBrains Mono fonts
- Nadova branded favicon (teal-to-purple gradient "N")
- Full-screen QR overlay with Nadova logo linking back to main site

### Admin Panel (`/admin`)
- **Auth**: Supabase Auth, session persistence via middleware + singleton client
- **Login**: nadovalabsjapan@nadova.com / andheriwest
- **Password reset**: "Forgot password?" flow with email reset link
- **Dashboard**: Stats cards (products, categories, content blocks, QR codes)
- **QR Code Manager** (`/admin/qr`): List view with search, filter by status, stats, delete
- **QR Code Editor** (`/admin/qr/[id]`):
  - Product info: name, batch, expiry, concentration, purity, description, storage
  - Status: Draft/Active/Expired/Recalled (4 buttons)
  - Image upload (drag & drop) + COA PDF upload
  - Custom key-value fields (extra_fields jsonb) — add any metadata
  - Section dividers (Product Details, Media, Custom Data)
  - Sticky save button on mobile
  - Preview link always visible
- **QR Code Generator** (`/admin/qr/new`):
  - 3 modes: Next Available, Custom Range (q101-q200), Specific Codes
  - 8 color style presets (Classic, Nadova, Teal, Purple, Ocean, Midnight, Ember, Forest)
  - 3 sizes (256/512/1024px)
  - 3 download formats: PNG (digital), JPEG (small), SVG (printing/vector)
  - ZIP download for all generated codes
- **Content Blocks** (`/admin/content`): CRUD with delete button, info banner about CMS
- **Products** (`/admin/products`): List + edit pages
- **Categories** (`/admin/categories`): Management page
- **Settings** (`/admin/settings`): Site settings
- **Guide** (`/admin/guide`): 8-step admin guide for non-tech users

### Database (Supabase)
- Project: tvunoqicydlsvdchwrar.supabase.co
- Tables: products, categories, content_blocks, qr_codes, goals, quiz_questions, quiz_options, site_settings
- Storage bucket: qr-assets (images + COA PDFs)
- RLS policies enabled
- q1-q100 seeded as draft rows
- Auth user created via Admin API

### Infrastructure
- Next.js 16.1.6, React 19, Tailwind CSS 4, Framer Motion 12
- Supabase SSR (@supabase/ssr)
- qrcode npm package (QR generation)
- jszip (ZIP downloads)
- Deployed on Vercel (auto-deploy on push to master)
- Middleware: session refresh on /admin/* routes only
- No redeploy needed for admin content changes (all dynamic from Supabase)

---

## Deployment Config

### Vercel
- Framework: Next.js (MUST be set — was incorrectly detecting as static)
- Root Directory: . (repo root)
- Production Branch: master (main also pushed)
- Auto-deploy: on push

### Environment Variables (Vercel)
```
NEXT_PUBLIC_SUPABASE_URL=https://tvunoqicydlsvdchwrar.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<set in Vercel dashboard>
SUPABASE_SERVICE_ROLE_KEY=<set in Vercel dashboard>
NEXT_PUBLIC_SITE_URL=https://nadova.vercel.app
```

### Supabase
- DB Password: stored in Supabase dashboard
- New key format: sb_publishable_... and sb_secret_... (not old JWT eyJ... format)

---

## Known Issues / TODO

### High Priority
- [ ] Test all admin flows end-to-end (login, QR edit, image upload, COA upload, custom fields, generator)
- [ ] Test QR generator ZIP download with all 3 formats (PNG, JPEG, SVG)
- [ ] Test custom fields save + display on public QR page
- [ ] Verify auth persistence (login → navigate away → come back → still logged in)

### Medium Priority
- [ ] Make site pages CMS-driven (currently hardcoded — content_blocks saves to DB but pages don't read from it)
- [ ] Products page should fetch from Supabase products table (currently hardcoded)
- [ ] Add user management page in admin (currently only via Supabase dashboard/API)
- [ ] Add scan analytics (track when QR codes are scanned — can use extra_fields or new table)

### Low Priority / Nice to Have
- [ ] Bulk CSV import for QR codes
- [ ] Email notifications on product status changes
- [ ] QR code logo overlay option (Nadova logo in center of QR)
- [ ] Dark/light theme toggle for public QR pages
- [ ] Custom domain (nadovalabs.com instead of nadova.vercel.app)
- [ ] OG image generation for QR pages (social sharing)

### Resolved Issues
- [x] Vercel 500 MIDDLEWARE_INVOCATION_FAILED — fixed by setting Framework to Next.js
- [x] Vercel NOT_FOUND — was detecting as static site (39s build), fixed with vercel.json + framework preset
- [x] Invalid UUID hex in seed data (g→a, p→b, q→d, o→e)
- [x] Header overlapping QR page — fixed with fixed inset-0 z-50 overlay
- [x] Auth not persisting — fixed with singleton client + middleware + getUser()
- [x] Content blocks missing delete button — added
- [x] QR generator only sequential — added range + custom modes
- [x] QR download only PNG one-at-a-time — added JPEG/SVG + ZIP

---

## File Structure (Key Files)

```
nadova/
├── middleware.ts              # Auth session refresh (admin/* only)
├── vercel.json                # Force Next.js framework detection
├── src/
│   ├── app/
│   │   ├── [code]/page.tsx    # Public QR verification (SSR)
│   │   ├── admin/
│   │   │   ├── layout.tsx     # Admin shell (sidebar, auth check)
│   │   │   ├── page.tsx       # Dashboard
│   │   │   ├── login/         # Login + password reset
│   │   │   ├── qr/            # QR code management
│   │   │   │   ├── page.tsx   # List view
│   │   │   │   ├── [id]/      # Edit page
│   │   │   │   └── new/       # Generator
│   │   │   ├── guide/         # Admin guide
│   │   │   ├── content/       # Content blocks
│   │   │   ├── products/      # Products CRUD
│   │   │   ├── categories/    # Categories
│   │   │   └── settings/      # Site settings
│   │   ├── icon.svg           # Favicon
│   │   └── apple-icon.svg     # iOS icon
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts      # Browser client (singleton)
│   │   │   ├── server.ts      # Server client
│   │   │   └── middleware.ts   # Session refresh helper
│   │   └── utils/upload.ts    # Supabase storage upload
│   └── types/index.ts         # All TypeScript types
├── supabase/migrations/
│   ├── 001_initial_schema.sql
│   ├── 002_seed_data.sql
│   ├── 003_site_settings.sql
│   ├── 004_qr_codes.sql
│   └── 005_qr_storage.sql
└── docs/plans/
    ├── 2026-02-25-qr-product-verification-design.md
    └── 2026-02-25-qr-product-verification-plan.md
```

---

## Adding New Admin Users

Via Supabase Dashboard: Authentication → Users → Add User

Via API:
```bash
curl -X POST 'https://tvunoqicydlsvdchwrar.supabase.co/auth/v1/admin/users' \
  -H 'Authorization: Bearer <SUPABASE_SERVICE_ROLE_KEY>' \
  -H 'Content-Type: application/json' \
  -d '{"email":"new@nadova.com","password":"securepassword","email_confirm":true}'
```
