# Filmmaker Personal-Brand Site — Digital Asset Sales

A premium, minimal personal-brand website for a filmmaker / content creator, with a built-in digital storefront. Visitors browse the creator's work and buy downloadable digital assets — things like LUTs, presets, project files, and stock footage — paying once and receiving a secure, time-limited download link by email. There are no buyer accounts: a purchase is identified by the buyer's email and their payment, and delivery happens through a private, expiring link rather than a login.

The site is intentionally small and self-contained, built and maintained, as a single client deliverable. Everything runs on a serverless, edge-first footprint so there are no servers to patch and hosting cost stays close to zero at low volume.

---

## What it is

The public site presents the creator's brand: a hero, an about section, a portfolio of work, a contact / "let's connect" section, and the Digital Products storefront. The storefront is the commercial heart of the project — each product is a single downloadable asset with a price, and buying it triggers an automated payment-and-delivery pipeline.

Behind the public site sits a private admin area, used only by the creator, where products are added, edited, reordered, and removed, and where access to a purchase can be granted manually if something goes wrong with the automated flow.

A future phase may add online courses. That is explicitly out of scope for the current build and is treated as a separate problem, because courses imply real buyer accounts and a learning experience rather than a one-off download.

---

## Architecture overview

The system is organised into a small number of clearly separated responsibilities:

**The edge** is the front door. All traffic arrives through Cloudflare, which terminates TLS, caches static content close to the visitor, filters malicious traffic, and rate-limits the sensitive actions (placing an order, requesting a download, requesting a fresh link).

**The frontend** renders the marketing site, the storefront, and the admin area. It is a modern server-rendered web application running at the edge.

**The backend** is the commercial and security boundary. It owns the logic that must never live in the browser: creating orders at a trusted price, receiving and verifying payment notifications, issuing download links, and sending email. Keeping this separate from the rendering layer means payment secrets and fulfilment logic stay in one controlled place.

**The data layer** is a managed Postgres database holding the catalogue of products, the record of orders, and the download links that have been issued. It is the source of truth for what exists, what was sold, and who is entitled to what.

**The storage layer** is a private object store holding the actual asset files. These files are never publicly reachable. They can only be served through the backend after it has confirmed the request is legitimate, or through a very short-lived signed link.

**External services** complete the picture: a payment provider handles checkout and notifies the system when money is captured; a transactional email service delivers download links and one-time verification codes; and an identity gate protects the admin area so only the creator can reach it.

The guiding principle throughout is that nothing the buyer's browser says is trusted on its own. Prices are decided by the backend, payment is confirmed by the payment provider directly to the backend, and delivery is gated on that confirmation — not on anything the browser reports.

---

## Technology stack

- **Next.js (App Router)** — the public site and admin frontend, server-rendered and deployed to Cloudflare's edge runtime via the OpenNext adapter.
- **Hono on Cloudflare Workers** — the backend API: orders, payment webhooks, download / token handling, and email dispatch.
- **Neon Postgres** — managed, serverless Postgres for catalogue, orders, and download-link records.
- **Cloudflare R2** — private object storage for the asset files.
- **Razorpay** — payment checkout and payment-captured webhooks.
- **Resend** — transactional email for download links and verification codes.
- **Cloudflare Access** — identity gate in front of the admin area and admin API.

This is a TypeScript-first, edge-first stack with no always-on server and no separate infrastructure to operate. It matches standard tooling and deployment model.

---

## Where it lives

Everything is hosted on Cloudflare's network. The frontend and the backend each run as edge workloads on Cloudflare Workers, deployed close to the end user worldwide rather than in a single region. The database is hosted on Neon's managed Postgres service. The asset files live in a private Cloudflare R2 bucket in the same account. Payment processing is hosted by Razorpay, and email delivery by Resend.

The site is served from the creator's own domain. The public marketing pages and storefront are reachable to anyone; the admin area lives at a protected path on the same domain and is only reachable after passing the Cloudflare Access identity check. The backend API is bound to a protected hostname so it cannot be reached directly, bypassing the edge protections.

Domain ownership and DNS sit with the client — confirming who holds the domain and registrar access is one of the open items below.

---

## How it runs

In day-to-day operation the system is fully automated and unattended. A buyer completes a purchase, the payment provider notifies the backend, and the backend issues and emails a secure download link without any human involvement. The creator only steps in to manage the catalogue or to handle an exception manually.

For development, the project runs locally against the same managed services in test mode — test-mode payments, a development database, and a development storage bucket — so the full purchase-to-delivery flow can be exercised end to end before anything is published.

Deployment is a publish step that pushes the latest frontend and backend to Cloudflare's edge. Because the runtime is serverless, there is no capacity to provision, no servers to keep alive, and scaling is handled by the platform.

---

## Core flows

**Buying an asset.** A visitor opens the storefront and chooses a product. Their email is captured before payment so it can serve as the canonical contact for delivery. The backend creates the order at a price it looks up itself, the buyer pays through the payment provider's checkout, and is taken to a confirmation screen that waits for the payment to be confirmed. The payment provider notifies the backend directly that the payment was captured; the backend verifies that notification is authentic, marks the order paid, issues a secure download link, and emails it. The confirmation screen updates to show the purchase is complete.

**Reliability of delivery.** Delivery does not depend on a single notification arriving. If the payment provider's notification is delayed or lost, the system actively re-checks the payment status while the buyer waits, and a periodic background check sweeps up any order that was paid but not yet fulfilled. The buyer always ends up with their link.

**Publishing a product.** The creator signs in to the admin area through the identity gate, enters the product's details and price, and uploads the asset file directly into private storage. Once saved, the product appears in the storefront. The creator can edit, reorder, or remove products at any time, and can manually grant access to a purchase if needed — and that manual grant runs through exactly the same issue-and-email path as a normal sale, so there is no separate, untested route to keep in sync.

**Downloading and link lifecycle.** When a buyer clicks their link, the backend checks that it is valid, unexpired, and tied to a paid order before serving the file from private storage. Links are time-limited (a 24-hour window) and intended to deliver the asset, not to be a permanent public URL. If a link has expired, the buyer can request a fresh one: a one-time code is sent only to the email already on record for that purchase, which prevents anyone else from claiming access, and the request is rate-limited to prevent abuse.

---

## Security posture

- Prices and entitlements are decided server-side; nothing the browser claims is trusted on its own.
- Payment confirmation comes directly from the payment provider to the backend and is cryptographically verified before any delivery happens.
- Repeated or duplicate payment notifications are recognised and ignored, so a buyer is never charged-and-delivered twice or emailed twice.
- The admin area and admin API are both protected by the identity gate, and the backend independently verifies that protection on every admin request rather than assuming it.
- Asset files are never publicly accessible; they are only ever served after a legitimacy check, or via a very short-lived signed link.
- Download links are short-lived, tied to a specific paid order, and limited in how often they can be used.
- All credentials for payment, email, storage, and the database are held as platform secrets, never embedded in the application.

---

## Open items and decisions

These are the points still to be confirmed with the client or settled during the build:

- **Buyer accounts.** The current build is deliberately account-free. The future courses idea would require real accounts and should be designed as a separate phase rather than bolted on.
- **Download limits.** A 24-hour link with a small reuse allowance is the default. The exact window and reuse count should be confirmed with the client, since a forwarded link is otherwise usable by whoever receives it within that window.
- **Domain and DNS ownership.** Confirm who holds the domain and registrar access, and how DNS is managed.
- **Hosting account ownership.** Confirm whether the Cloudflare, database, payment, and email accounts sit under the client. and how that is handled at handover.
- **Email of record.** The email captured before checkout is treated as the authoritative contact for delivery, in preference to anything the payment provider returns.
- **Support window.** One month of support is included after completion; anything beyond that is a separate engagement.