import React from 'react';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { auth, currentUser } from '@clerk/nextjs/server';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import ProjectView from '@/app/components/ProjectView';
import { Campaign } from '@/app/types/campaign';
import { incrementProjectViews } from '@/lib/actions/interactions';
import { mockCampaigns } from '@/app/data/mock-campaigns';

export const dynamic = 'force-dynamic';

interface ProjectPageProps {
  params: {
    slug: string;
  };
  searchParams: {
    v?: string;
  };
}

export default async function ProjectPage({ params, searchParams }: ProjectPageProps) {
  // 1. Try DB
  const project = await prisma.project.findUnique({
    where: { slug: params.slug },
    include: {
      creator: true,
      tiers: true,
      posts: true,
    },
  }).catch(() => null);

  if (project) {
    incrementProjectViews(project.id).catch(() => {});
    const campaign = mapDbToCampaign(project);
    return renderPage(campaign, searchParams.v);
  }

  // 2. Try Mock Data
  const mock = mockCampaigns.find(c => c.slug === params.slug);
  if (mock) {
    return renderPage(mock, searchParams.v);
  }

  return notFound();
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

async function renderPage(campaign: Campaign, videoId?: string) {
    const { userId } = auth();
    const user = await currentUser();

    const userProfile = userId ? {
        id: userId,
        email: user?.primaryEmailAddress?.emailAddress || ''
    } : null;

    return (
      <div className="min-h-screen bg-[#FDFBF7] text-[#1a1a1a] font-serif selection:bg-primary selection:text-white">
        <Navbar />
        <ProjectView
          campaign={campaign}
          videoId={videoId}
          userProfile={userProfile}
        />
        <Footer />
      </div>
    );
}
