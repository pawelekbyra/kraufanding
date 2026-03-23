import React from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProjectView from './components/ProjectView';
import { prisma } from '@/lib/prisma';
import { Campaign } from './types/campaign';
import { notFound } from 'next/navigation';
import { incrementProjectViews } from '@/lib/actions/interactions';
import { mockCampaigns } from './data/mock-campaigns';

export const dynamic = 'force-dynamic';

export default async function Home({ searchParams }: { searchParams: { v?: string } }) {
  // 1. Try to fetch from DB
  const secretProject = await prisma.project.findUnique({
    where: { slug: 'secret-project' },
    include: {
      creator: true,
      tiers: true,
      posts: true,
    },
  }).catch(() => null);

  if (secretProject) {
    incrementProjectViews(secretProject.id).catch(() => {});
    const campaign = mapDbToCampaign(secretProject);
    return <FeaturedHome campaign={campaign} searchParams={searchParams} />;
  }

  // 2. Try latest from DB
  const latest = await prisma.project.findFirst({
    include: { creator: true, tiers: true, posts: true },
    orderBy: { createdAt: 'desc' }
  }).catch(() => null);

  if (latest) {
    incrementProjectViews(latest.id).catch(() => {});
    const campaign = mapDbToCampaign(latest);
    return <FeaturedHome campaign={campaign} searchParams={searchParams} />;
  }

  // 3. Fallback to Mock Data (User requirement: always show content)
  const mock = mockCampaigns.find(c => c.slug === 'secret-project') || mockCampaigns[0];
  return <FeaturedHome campaign={mock} searchParams={searchParams} />;
}

function mapDbToCampaign(project: any): Campaign {
    return {
        id: project.id,
        slug: project.slug,
        title: project.title,
        description: project.title,
        category: "Technology",
        author: project.creator.name,
        goal: project.goalAmount / 100,
        raised: project.collectedAmount / 100,
        views: (project as any).views || 0,
        thumbnail: "https://picsum.photos/seed/" + project.slug + "/1200/500",
        endDate: project.publishedAt?.toISOString() || "",
        story: [
          project.title + " aims to change something big.",
          "Support this project to help bring this idea to life."
        ],
        rewards: project.tiers.map((t: any) => ({
          id: t.id,
          title: t.name,
          amount: t.priceOneTime / 100,
          description: t.description || "",
          deliveryDate: "March 2025",
          backers: t.slotsTaken
        })),
        updates: project.posts.map((p: any) => ({
          id: p.id,
          date: p.publishedAt.toISOString().split('T')[0],
          title: p.title,
          content: p.contentPublic || ""
        })),
        comments: []
    };
}

async function FeaturedHome({ campaign, searchParams }: { campaign: Campaign, searchParams: { v?: string } }) {
    return (
        <div className="min-h-screen bg-[#FDFBF7] text-[#1a1a1a] font-serif">
            <Navbar />
            <ProjectView campaign={campaign} videoId={searchParams.v} />
            <Footer />
        </div>
    );
}
