# POLUTEK.PL - Crowdfunding with Patron Content

A modern, responsive crowdfunding platform for a "Secret Project", built with Next.js 14, Tailwind CSS, and DaisyUI. This project is designed with a premium, serif-heavy aesthetic (cream and charcoal colors) and features an "OnlyFans/Patreon-style" content locking mechanism.

## Project Vision
POLUTEK.PL is a community-driven initiative that provides supporters with exclusive, behind-the-scenes content (videos, graphics, and updates) hosted securely on **Vercel Blob**. Using **Clerk Authentication**, we manage a two-tier access system:
- **Public**: Basic project information and funding progress.
- **Patrons**: Signed-in supporters gain access to restricted materials and premium updates.

## Key Features
- **Modern Authentication**: Powered by [Clerk](https://clerk.com/) with support for Social (Google) and Magic Link logins.
- **Secure Storage**: Premium content is managed through [Vercel Blob](https://vercel.com/docs/storage/vercel-blob).
- **Responsive UI**: Built with a custom "polutek" DaisyUI theme on a `#FDFBF7` (Cream) background with `#1a1a1a` (Charcoal) serif typography.
- **Interactive Funding**: Real-time progress bar and reward selection tiers.
- **Content Gating**: Built-in paywall and conditional rendering for restricted content.

## Technology Stack
- **Framework**: [Next.js 14 (App Router)](https://nextjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [DaisyUI](https://daisyui.com/)
- **Authentication**: [Clerk](https://clerk.com/)
- **Database**: [Postgres (Neon)](https://neon.tech/)
- **Storage**: [Vercel Blob](https://vercel.com/docs/storage/vercel-blob)
- **Deployment**: [Vercel](https://vercel.com/)

## Getting Started

### Prerequisites
- Node.js 18+
- A Neon account (Postgres)
- A Clerk project
- A Vercel Blob store

### Environment Setup
Create a `.env.local` file in the root directory and add the following:

```env
# Clerk Keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
CLERK_SECRET_KEY=your_secret_key

# Vercel Blob
BLOB_READ_WRITE_TOKEN=your_blob_token

# Database (Neon)
DATABASE_URL="postgresql://user:pass@ep-host.aws.neon.tech/neondb?sslmode=require"
```

### Installation
```bash
npm install
npm run dev
```

## Development
This project follows the Next.js App Router architecture. Key components and logic are located in the `app/` directory.

- `app/layout.tsx`: Global configuration and Clerk provider.
- `app/page.tsx`: Main landing page with content gating.
- `middleware.ts`: Clerk route protection.
- `tailwind.config.ts`: Custom theme and color definitions.
