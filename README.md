# BUCC Event Registration System — Frontend

The public-facing and organizer-facing Next.js frontend for the BUCC Event Registration System. All data is served by a separate NestJS backend; this project contains no database logic.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| Carousel | Embla Carousel |
| QR Code | `qrcode` (generation) · `qr-scanner` (scanning) |
| Validation | Zod |
| Icons | Lucide React |

---

## Project Structure

```
src/
├── app/
│   ├── (public)/           # All public routes
│   │   ├── events/         # Event list, detail, register
│   │   ├── tickets/[code]/ # Ticket page with QR code
│   │   ├── log-in/         # User log in (future)
│   │   ├── register/       # User register (future)
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
│   ├── home/               # All homepage sections
│   ├── layout/             # Navbar, footer, mobile menu
│   ├── motion/             # SlideIn animation
│   ├── shared/             # CtaLink, FormField, HashScroll, Splash
│   └── tickets/            # QR code canvas component
│
└── lib/
    ├── api.ts              # All API functions and TypeScript types
    ├── constants.ts        # Site name, nav links, event categories
    ├── events.ts           # Shared helpers: formatDate, canRegister, categoryLabel, isAllowedImageHost
    ├── members.ts          # BUCC member photo data for the Why Join carousel
    └── site-config.ts      # Email, location, social URLs — single source of truth
```

---

## Pages

### Public
| Route | Description |
|---|---|
| `/` | Homepage — event carousel, about, impact stats, activities, why join, contact |
| `/events` | Event listing with category filter |
| `/events/[slug]` | Event detail with register CTA |
| `/events/[slug]/register` | Registration form (name, email, phone) |
| `/tickets/[code]` | Ticket page with QR code and event details |
| `/log-in` | User log in — coming soon |
| `/register` | User register — coming soon |

### Organizer Auth
| Route | Description |
|---|---|
| `/organizer/log-in` | Organizer login with role-based redirect |
| `/organizer/register` | Two-step organizer register (email verification) |
| `/organizer/forgot-password` | Password reset via email code |

### Dashboard (requires ORGANIZER session)
| Route | Description |
|---|---|
| `/dashboard` | Event list with counters |
| `/dashboard/events/new` | Create event |
| `/dashboard/events/[id]` | Manage event — counters, publish/unpublish/cancel |
| `/dashboard/events/[id]/edit` | Edit event details |
| `/dashboard/events/[id]/registrations` | Registrations table, search, CSV export |
| `/dashboard/events/[id]/check-in` | QR scanner + manual search check-in |

### Admin (requires ADMIN session)
| Route | Description |
|---|---|
| `/admin/users` | All users with delete |
| `/admin/events` | All events with cancel |

---

## Getting Started

### Prerequisites

- Node.js 20+
- The NestJS backend running on port 4000 (or configured via `API_URL`)

### Setup

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

| Variable | Default | Description |
|---|---|---|
| `API_URL` | `http://localhost:4000` | NestJS backend base URL |

---

## How the API Proxy Works

All `/api/*` requests from the browser are proxied to the NestJS backend via Next.js rewrites (`next.config.ts`). Server components call the backend directly using `API_URL` with the session cookie forwarded via `next/headers`.

```
Browser  →  /api/events  →  Next.js rewrite  →  http://localhost:4000/api/events
Server   →  API_URL/api/events  (direct, with cookie forwarded)
```

---

## Availability Chip Logic

Computed on the frontend from event data (no backend field):

1. **Closed** — `status === "CANCELLED"` or `endsAt < now`
2. **Full** — `spotsLeft === 0`
3. **Almost full** — `spotsLeft <= capacity * 0.2`
4. **Open** — everything else

---

## Check-in Flow

1. Organizer opens `/dashboard/events/[id]/check-in` on a phone
2. Camera scans the attendee QR code (encodes the ticket page URL)
3. Frontend extracts the ticket code from the URL path
4. Calls `POST /api/organizer/events/:id/check-in` with `{ ticketCode }`
5. Shows green (checked in) or red (already scanned / invalid) result
6. Manual search fallback for cases where camera is unavailable

---

## Adding Member Photos

Edit `src/lib/members.ts` — add, remove, or reorder entries in the `MEMBER_PHOTOS` array. Each entry needs `src` (Cloudinary URL), `alt`, and `caption`.

---

## Scripts

```bash
npm run dev      # Development server with Turbopack
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint
```

---

## Notes

- The camera check-in scanner requires HTTPS in production (browser security restriction). On localhost it works in Chrome and Edge.
- Organizer and admin routes are server-side auth guarded — unauthenticated requests redirect to `/organizer/log-in`.
- User accounts (attendee login) are a future feature — the pages exist as placeholders.
