import React from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProjectView from './components/ProjectView';
import { prisma } from '@/lib/prisma';
import { auth, currentUser } from '@clerk/nextjs/server';
import { Project } from './types/project';
import { incrementProjectViews } from '@/lib/actions/interactions';
import { mockProjects } from './data/mock-projects';

export const dynamic = 'force-dynamic';

export default async function Home({ searchParams }: { searchParams: { v?: string } }) {
  // 1. Try to fetch from DB
  const secretProjectDb = await prisma.project.findUnique({
    where: { slug: 'secret-project' },
    include: {
      creator: true,
      posts: true,
      files: true,
    },
  }).catch(() => null);

  if (secretProjectDb) {
    incrementProjectViews(secretProjectDb.id).catch(() => {});
    const project = mapDbToProject(secretProjectDb);
    return <FeaturedHome project={project} searchParams={searchParams} />;
  }

  // 2. Try latest from DB
  const latestDb = await prisma.project.findFirst({
    include: { creator: true, posts: true, files: true },
    orderBy: { createdAt: 'desc' }
  }).catch(() => null);

  if (latestDb) {
    incrementProjectViews(latestDb.id).catch(() => {});
    const project = mapDbToProject(latestDb);
    return <FeaturedHome project={project} searchParams={searchParams} />;
  }

  // 3. Fallback to Mock Data
  const mock = mockProjects.find(c => c.slug === 'secret-project') || mockProjects[0];
  return <FeaturedHome project={mock} searchParams={searchParams} />;
}

function mapDbToProject(project: any): Project {
    return {
        id: project.id,
        slug: project.slug,
        title: project.title,
        description: project.title,
        category: "Technology",
        author: project.creator.name,
        views: (project as any).views || 0,
        thumbnail: "https://picsum.photos/seed/" + project.slug + "/1200/500",
        publishedAt: project.publishedAt?.toISOString() || "",
        story: [
          project.title + " aims to change something big.",
          "Support this project to help bring this idea to life."
        ],
        updates: project.posts.map((p: any) => ({
          id: p.id,
          date: p.publishedAt.toISOString().split('T')[0],
          title: p.title,
          content: p.contentPublic || ""
        })),
        materials: project.files.map((f: any) => ({
          id: f.id,
          title: f.path.split('/').pop() || "Material",
          thumbnail: "https://picsum.photos/seed/" + f.id + "/400/225",
          description: "Materiał wideo z archiwum Polutka.",
          minTier: f.minTier,
          publishedAt: f.createdAt.toISOString().split('T')[0]
        })),
        comments: []
    };
}

async function FeaturedHome({ project, searchParams }: { project: Project, searchParams: { v?: string } }) {
    const { userId } = auth();
    const user = await currentUser();

    const userProfile = userId ? {
        id: userId,
        email: user?.primaryEmailAddress?.emailAddress || ''
    } : null;

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Navbar />
            <ProjectView
              project={project}
              videoId={searchParams.v}
              userProfile={userProfile}
            />
            <Footer />
        </div>
    );
}
