# BUCC Event Registration System — Frontend

The public-facing and organizer-facing Next.js frontend for the BUCC Event Registration System. All data is served by a separate NestJS backend; this project contains no database logic.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| Carousel | Embla Carousel |
| QR Code | `qrcode` (generation) · `qr-scanner` (scanning) |
| Validation | Zod 4 |
| Icons | Lucide React |

---

## Project Structure

```
src/
├── app/
│   ├── (public)/           # All public routes
│   │   ├── events/         # Event list, detail, register
│   │   ├── tickets/[code]/ # Ticket page with QR code
│   │   ├── log-in/         # User log in (placeholder)
│   │   ├── register/       # User register (placeholder)
│   │   ├── sys/panel/      # Hidden admin login (noindex)
│   │   └── organizer/      # Organizer log-in, register, forgot-password
│   ├── dashboard/          # Organizer dashboard (auth guarded)
│   │   └── events/[id]/    # Manage, edit, registrations, check-in
│   └── admin/              # Admin panel (ADMIN role only)
│
├── components/
│   ├── auth/               # Login form, signup form, forgot-password, session provider
│   ├── checkin/            # QR scanner, manual search, check-in result
│   ├── dashboard/          # Event form, events table, status actions, registrations table, logout
│   ├── events/             # Event card, grid, availability chip, category filter, registration form
│   ├── home/               # All homepage sections + carousels
│   ├── layout/             # Navbar, footer, mobile menu
│   ├── motion/             # SlideIn animation
│   ├── shared/             # CtaLink, FormField, HashScroll, SectionHeading, Splash, AsteroidBg
│   └── tickets/            # QR code canvas component
│
└── lib/
    ├── api.ts              # All API functions and TypeScript types
    ├── constants.ts        # Site name, nav links
    ├── events.ts           # Helpers: formatDate, canRegister, categoryLabel, isAllowedImageHost
    ├── members.ts          # BUCC member photo data for the Why Join carousel
    └── site-config.ts      # Email, location, social URLs
```

---

## Pages

### Public

| Route | Tab title | Description |
|---|---|---|
| `/` | BUCC | Homepage — event carousel, about, impact stats, activities, why join, contact |
| `/events` | Events \| BUCC | Event listing with category filter |
| `/events/[slug]` | {Event title} \| BUCC | Event detail with register CTA |
| `/events/[slug]/register` | Register — {title} \| BUCC | Registration form |
| `/tickets/[code]` | Your Ticket \| BUCC | Ticket page with QR code |
| `/log-in` | Log In \| BUCC | Coming soon placeholder |
| `/register` | Register \| BUCC | Coming soon placeholder |

### Organizer Auth

| Route | Tab title | Description |
|---|---|---|
| `/organizer/log-in` | Organizer Log In \| BUCC | Login with role-based redirect |
| `/organizer/register` | Organizer Register \| BUCC | Two-step register (email verification) |
| `/organizer/forgot-password` | Forgot Password \| BUCC | Password reset via email code |

### Dashboard (requires ORGANIZER session)

| Route | Tab title | Description |
|---|---|---|
| `/dashboard` | My Events \| BUCC | Event list |
| `/dashboard/events/new` | New Event \| BUCC | Create event |
| `/dashboard/events/[id]` | Manage Event \| BUCC | Counters, publish/unpublish/cancel |
| `/dashboard/events/[id]/edit` | Edit Event \| BUCC | Edit event details |
| `/dashboard/events/[id]/registrations` | Registrations \| BUCC | Table, search, CSV export |
| `/dashboard/events/[id]/check-in` | Check-in \| BUCC | QR scanner + manual search |

### Admin (requires ADMIN session)

| Route | Tab title | Description |
|---|---|---|
| `/admin` | Admin \| BUCC | Overview with stats |
| `/admin/users` | Users \| BUCC | All users with delete |
| `/admin/events` | Events \| BUCC | All events with cancel |

---

## Getting Started

### Prerequisites

- Node.js 20+
- The NestJS backend running (default port 4000)

### Setup

```bash
npm install
cp .env.example .env
# Edit .env with your API_URL and admin route settings
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

| Variable | Required | Description |
|---|---|---|
| `API_URL` | Yes | NestJS backend base URL (e.g. `http://localhost:4000`) |
| `ADMIN_LOGIN_PATH` | Yes | Backend route suffix for the hidden admin login |
| `NEXT_PUBLIC_ADMIN_ROUTE` | Yes | Frontend URL path for the hidden admin login (e.g. `/sys/panel`) |

---

## How the API Proxy Works

All `/api/*` requests from the browser are proxied to the NestJS backend via Next.js rewrites. Server components call the backend directly using `API_URL` with the session cookie forwarded via `next/headers`.

```
Browser  →  /api/events        →  Next.js rewrite  →  {API_URL}/api/events
Server   →  {API_URL}/api/events  (direct, with cookie forwarded)
```

---

## Availability Chip Logic

Computed on the frontend from event data (no extra backend field):

| State | Condition |
|---|---|
| Closed | `status === "CANCELLED"` or `endsAt < now` |
| Full | `spotsLeft === 0` |
| Almost full | `spotsLeft <= capacity × 0.2` |
| Open | everything else |

---

## Check-in Flow

1. Organizer opens `/dashboard/events/[id]/check-in` on a phone
2. Camera scans the attendee QR code (encodes the ticket page URL)
3. Frontend extracts the ticket code from the URL path
4. Calls `POST /api/organizer/events/:id/check-in` with `{ ticketCode }`
5. Shows green (checked in) or red (already scanned / invalid) result
6. Manual search fallback for cases where camera is unavailable

> **Note:** The camera scanner requires HTTPS in production (browser security restriction). On localhost it works in Chrome and Edge.

---

## Adding Member Photos

Edit `src/lib/members.ts` — add, remove, or reorder entries in the `MEMBER_PHOTOS` array. Each entry needs `src` (URL), `alt`, and `caption`.

---

## Scripts

```bash
npm run dev      # Development server (Turbopack)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint
```

---

## Deploying to Vercel

1. Push the repo to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Set the environment variables in Vercel project settings:
   - `API_URL` — your deployed backend URL
   - `ADMIN_LOGIN_PATH`
   - `NEXT_PUBLIC_ADMIN_ROUTE`
4. Deploy — Vercel auto-detects Next.js and handles the build

> The camera check-in scanner requires the Vercel deployment to use HTTPS (it does by default).

---

## Notes

- Organizer and admin routes are server-side auth guarded — unauthenticated requests redirect to `/organizer/log-in`.
- User accounts (attendee login) are a future feature — the pages exist as placeholders.
- The `sys/panel` admin login page is set to `noindex` and uses a configurable hidden route via `NEXT_PUBLIC_ADMIN_ROUTE`.
