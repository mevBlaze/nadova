# Nadova QR Product Verification System — Design

**Date:** 2026-02-25
**Status:** Approved
**Context:** Dubai gym owner needs QR codes on peptide bottles to link to product verification pages. QR codes q1-q100 already printed and on bottles. Need admin panel + public display pages.

---

## Problem

QR code labels are printed on peptide bottles pointing to `nadova.vercel.app/q1` through `/q100`. Those routes don't exist yet. The gym owner needs:
1. A way to assign product data to each QR code
2. Beautiful public pages that display when customers scan
3. Ability to generate new QR codes beyond the initial 100

## Architecture

Add to the existing Nadova Next.js 16 + Supabase app. No new services or deployments.

### New Routes
- **`/[code]`** — Public product verification page (SSR, catches q1, q2, q137, etc.)
- **`/admin/qr`** — Admin list view of all QR codes
- **`/admin/qr/[id]`** — Admin edit form for a single QR code
- **`/admin/qr/new`** — Generate new QR codes

### Data Model

One new Supabase table: **`qr_codes`**

| Column | Type | Notes |
|--------|------|-------|
| id | uuid (PK) | Auto-generated |
| code | text (UNIQUE) | "q1", "q2", "q137" |
| status | text | "active", "draft", "expired", "recalled" (default: "draft") |
| product_name | text (nullable) | e.g. "BPC-157" |
| product_image | text (nullable) | Supabase Storage URL |
| batch_number | text (nullable) | e.g. "NAD-2026-A003" |
| expiration_date | date (nullable) | |
| concentration | text (nullable) | e.g. "5mg / 10ml" |
| purity | text (nullable) | e.g. "99.1%" |
| description | text (nullable) | Product description |
| storage_info | text (nullable) | e.g. "Store at 2-8C" |
| coa_url | text (nullable) | Certificate of Analysis PDF URL |
| extra_fields | jsonb (nullable) | Future-proofing |
| created_at | timestamptz | Auto |
| updated_at | timestamptz | Auto |

All product fields nullable = everything optional.

Seed q1-q100 as empty draft rows on migration.

### Admin UI

**List View (`/admin/qr`):**
- Table: code, product name, status, batch, expiry
- Color-coded status badges (green=active, gray=draft, red=expired/recalled)
- Search/filter
- "Generate New QR Codes" button

**Edit View (`/admin/qr/[id]`):**
- Form with all fields (text inputs, date picker, textarea, file uploads)
- Image upload → Supabase Storage (drag & drop)
- COA PDF upload → Supabase Storage
- Status dropdown
- Preview button (shows public page in modal/new tab)
- Save → instantly live if status = Active

**Generate New (`/admin/qr/new`):**
- Input: how many codes to generate (default: 10)
- Creates next available codes (q101, q102...)
- Shows downloadable QR code images (PNG) for each, pointing to `nadova.vercel.app/q{n}`
- Printable format for label sheets

### Public Page (`/[code]`)

Server-side rendered for fast load from phone camera apps.

| Status | Display |
|--------|---------|
| Active | Full product verification page |
| Draft | "This product is being registered" placeholder |
| Expired/Recalled | Warning banner + product info |
| Not found | 404 with Nadova branding |

**Active page layout:**
1. Nadova logo + "Verified Product" shield badge
2. Product image (hero, large)
3. Product name + concentration
4. Batch number + expiration date (prominent, card-style)
5. Purity percentage (with visual indicator)
6. Description
7. Storage instructions
8. "View Certificate of Analysis" button (if COA uploaded)
9. Nadova footer

**Design:** Dark theme matching existing Nadova design system (teal accents, Space Grotesk font, glass-morphism cards).

### Storage

Supabase Storage bucket: `qr-assets`
- `/images/{code}.{ext}` — Product photos
- `/coa/{code}.pdf` — Certificates of Analysis

### What We're NOT Building
- Shopping cart / payments
- Customer accounts
- Scan analytics (can add later via extra_fields)
- Bulk CSV import
- Email notifications

## Tech Stack (Existing)
- Next.js 16.1.6
- Supabase (auth + DB + storage)
- Tailwind CSS 4
- React 19
- Framer Motion 12

## New Dependencies
- `qrcode` (npm) — Generate QR code images for the "Generate New" feature

---

*Approved by Blaze on 2026-02-25. Ready for implementation planning.*
