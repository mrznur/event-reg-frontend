# BUCC Event Registration System — User Guide

This guide covers how to use the system as an attendee, organizer, or admin.

---

## For Attendees

### Browsing Events

Go to `/events` to see all upcoming events. Use the category filter buttons (Workshop, Hackathon, Talk, Social) to narrow the list.

Click any event card to open the detail page, which shows:
- Date, time, and venue
- Registration capacity and spots remaining
- Full description

### Registering for an Event

On the event detail page, click **Register now**. Fill in your name, email, and phone number, then submit.

You'll receive a confirmation email with a link to your ticket.

### Your Ticket

Your ticket page is at `/tickets/[code]` — the link is in your confirmation email. It shows:
- Event details
- Your registration status (Confirmed / Checked In / Cancelled)
- A QR code that the organizer scans at the door

---

## For Organizers

### Creating an Account

Go to `/organizer/register`. Enter your name, email, and password. A 6-digit verification code is sent to your email — enter it to complete registration.

### Logging In

Go to `/organizer/log-in`. After logging in you're redirected to your dashboard.

### Forgot Password

Go to `/organizer/forgot-password`. Enter your email to receive a reset code, then enter the code and your new password.

### Dashboard Overview

The dashboard at `/dashboard` lists all your events with their status, date, and registration count.

### Creating an Event

Click **New event** on the dashboard. Fill in:

| Field | Notes |
|---|---|
| Title | Public-facing event name |
| Description | What attendees will experience |
| Category | Workshop / Hackathon / Talk / Social |
| Capacity | Total spots available |
| Cover image URL | Must be from an allowed host (Cloudinary, ibb.co, placehold.co, or picsum) |
| Venue | Physical location |
| Timezone | IANA timezone string, e.g. `Asia/Dhaka` |
| Start / End | Date and time |

Events are created as **Draft** and are not publicly visible until published.

### Publishing / Managing an Event

Open an event from the dashboard to:
- **Publish** — make it publicly visible and open for registration
- **Unpublish** — hide it from public listing (keeps existing registrations)
- **Cancel** — permanently close the event

### Viewing Registrations

From the event manage page, click **View registrations**. The table shows all registrants with name, email, phone, and check-in status. Use the search box to find a specific person. Click **Export CSV** to download the full list.

### Check-in

From the event manage page, click **Start check-in**. This opens a two-panel page:

**QR Scanner** — Point the camera at an attendee's QR code. The result shows green (checked in) or red (already scanned / not found).

**Manual search** — Type a name or email to find the attendee and check them in without scanning.

> The QR scanner requires camera permission and HTTPS. It works in Chrome and Edge on Android. On iOS, Safari is recommended.

---

## For Admins

The admin panel is accessible at the hidden route configured via `NEXT_PUBLIC_ADMIN_ROUTE` (e.g. `/sys/panel`). Log in with admin credentials.

### Users

`/admin/users` — view all registered organizer accounts. Use the **Delete** button to remove a user and all their data.

### Events

`/admin/events` — view all events across all organizers. Use **Cancel** to cancel any event regardless of organizer.
