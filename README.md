# POLUTEK.PL - Exclusive Content Platform

A modern, responsive media platform for exclusive content, built with Next.js 14, Tailwind CSS, and DaisyUI. This project is designed with a professional "YouTube-style" aesthetic and features a permanent content locking mechanism for supporters.

## Project Vision
POLUTEK.PL is a private service created by **Paweł Polutek**. It serves as a central hub for exclusive media (covers, research, operational data) where users can gain permanent access to restricted "Materials" by leaving a voluntary tip.

### Model of Operation
1. **Public Discovery**: Users encounter engaging media content (YouTube-style layout).
2. **Interactive Gating**: Some materials are free for registered users, while others are strictly for Patrons.
3. **Permanent Access**: Any one-time voluntary donation (Tip) permanently upgrades the user's account, unlocking high-tier content forever. No recurring subscriptions required.

## Key Features
- **YouTube-style UI**: A familiar media-centric layout with a primary player, meta-data, and a sidebar "playlist" of exclusive materials.
- **Polymorphic Social System**: A robust, professional-grade comment system with optimistic interactions (likes) and threaded replies.
- **Identity & Security**: Secure authentication via **Clerk** and safe payments through **Stripe**.
- **Admin Dashboard**: Full project management suite for creating and editing media campaigns.

## Technology Stack
- **Framework**: [Next.js 14 (App Router)](https://nextjs.org/)
- **Authentication**: [Clerk](https://clerk.com/)
- **Database**: [Postgres (Neon)](https://neon.tech/) with [Prisma](https://www.prisma.io/)
- **Payments**: [Stripe](https://stripe.com/)
- **Storage**: [Vercel Blob](https://vercel.com/docs/storage/vercel-blob)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [DaisyUI](https://daisyui.com/)

## Getting Started

### Prerequisites
- Node.js 18+
- Neon Postgres instance
- Clerk project keys
- Stripe account keys

### Installation
```bash
npm install
npx prisma generate
npm run dev
```

## Legal
The platform operates on a donation basis. All "Tips" or "Supports" are voluntary donations to the creator, not payments for services or products. Detailed terms are available on the /regulamin page.
