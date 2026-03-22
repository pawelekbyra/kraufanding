import React from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProjectView from './components/ProjectView';
import { prisma } from '@/lib/prisma';
import { Campaign } from './types/campaign';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function Home() {
  // Fetch the "Secret Project" (main featured project)
  const secretProject = await prisma.project.findUnique({
    where: { slug: 'secret-project' },
    include: {
      creator: true,
      tiers: true,
      posts: true,
    },
  });

  if (!secretProject) {
    // If not found by slug, fallback to the latest project or 404
    const latest = await prisma.project.findFirst({
        include: { creator: true, tiers: true, posts: true },
        orderBy: { createdAt: 'desc' }
    });
    if (!latest) return notFound();
    return <FeaturedHome project={latest} />;
  }

  return <FeaturedHome project={secretProject} />;
}

async function FeaturedHome({ project }: { project: any }) {
    // Map to Campaign interface
    const campaign: Campaign = {
        id: project.id,
        slug: project.slug,
        title: project.title,
        description: project.title,
        category: "Technology",
        author: project.creator.name,
        goal: project.goalAmount / 100,
        raised: project.collectedAmount / 100,
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

    // Fetch other projects for the gallery at the bottom
    const otherProjects = await prisma.project.findMany({
        where: { id: { not: project.id } },
        include: { creator: true },
        take: 6,
        orderBy: { createdAt: 'desc' }
    });

    const otherCampaigns: Campaign[] = otherProjects.map(p => ({
        id: p.id,
        slug: p.slug,
        title: p.title,
        description: p.title,
        category: "Technology",
        author: p.creator.name,
        goal: p.goalAmount / 100,
        raised: p.collectedAmount / 100,
        thumbnail: "https://picsum.photos/seed/" + p.slug + "/800/450",
        endDate: p.publishedAt?.toISOString() || "",
    }));

    return (
        <div className="min-h-screen bg-[#FDFBF7] text-[#1a1a1a] font-serif">
            <Navbar />
            <ProjectView campaign={campaign} otherCampaigns={otherCampaigns} />
            <Footer />
        </div>
    );
}
