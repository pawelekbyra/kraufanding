import React from 'react';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import ProjectView from '@/app/components/ProjectView';
import { Campaign } from '@/app/types/campaign';
import { incrementProjectViews } from '@/lib/actions/interactions';

export const dynamic = 'force-dynamic';

interface ProjectPageProps {
  params: {
    slug: string;
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  try {
    const project = await prisma.project.findUnique({
      where: { slug: params.slug },
      include: {
        creator: true,
        tiers: true,
        posts: true,
      },
    });

    if (!project) {
      notFound();
    }

    // Increment views in background
    incrementProjectViews(project.id).catch(err => console.error("[PROJECT_VIEW_INCREMENT_ERROR]", err));

  // Map Prisma project to Campaign interface
  const campaign: Campaign = {
    id: project.id,
    slug: project.slug,
    title: project.title,
    description: project.title, // Use title as description placeholder if not in schema
    category: "Technology", // Placeholder
    author: project.creator.name,
    goal: project.goalAmount / 100, // Convert from cents
    raised: project.collectedAmount / 100, // Convert from cents
    views: project.views,
    thumbnail: "https://picsum.photos/seed/" + project.slug + "/1200/500",
    endDate: project.publishedAt?.toISOString() || "",
    story: [
      project.title + " aims to change something big.",
      "Support this project to help bring this idea to life."
    ],
    rewards: project.tiers.map(t => ({
      id: t.id,
      title: t.name,
      amount: t.priceOneTime / 100,
      description: t.description || "",
      deliveryDate: "March 2025",
      backers: t.slotsTaken
    })),
    updates: project.posts.map(p => ({
      id: p.id,
      date: p.publishedAt.toISOString().split('T')[0],
      title: p.title,
      content: p.contentPublic || ""
    })),
    comments: []
  };

    return (
      <div className="min-h-screen bg-[#FDFBF7] text-[#1a1a1a] font-serif selection:bg-primary selection:text-white">
        <Navbar />
        <ProjectView campaign={campaign} />
        <Footer />
      </div>
    );
  } catch (error) {
    console.error("[PROJECT_PAGE_ERROR]", error);
    return notFound();
  }
}
