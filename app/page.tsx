import React from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProjectView from './components/ProjectView';
import { prisma } from '@/lib/prisma';
import { Campaign } from './types/campaign';
import { notFound } from 'next/navigation';
import { incrementProjectViews } from '@/lib/actions/interactions';

export const dynamic = 'force-dynamic';

export default async function Home() {
  try {
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

    // Increment views in background
    incrementProjectViews(secretProject.id).catch(err => console.error("[HOME_VIEW_INCREMENT_ERROR]", err));

    return <FeaturedHome project={secretProject} />;
  } catch (error) {
    console.error("[HOME_FETCH_ERROR]", error);
    // Fallback to a safe UI if DB is in transition
    return (
        <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-12 text-center">
            <div className="space-y-4">
                <h1 className="text-4xl font-black uppercase">Platforma w trakcie aktualizacji</h1>
                <p className="text-lg italic opacity-50">Wróć za chwilę, przygotowujemy dla Ciebie nowe materiały.</p>
            </div>
        </div>
    );
  }
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
        views: project.views,
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


    return (
        <div className="min-h-screen bg-[#FDFBF7] text-[#1a1a1a] font-serif">
            <Navbar />
            <ProjectView campaign={campaign} />
            <Footer />
        </div>
    );
}
