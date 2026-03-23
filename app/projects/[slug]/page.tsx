import React from 'react';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { auth, currentUser } from '@clerk/nextjs/server';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import ProjectView from '@/app/components/ProjectView';
import { Project } from '@/app/types/project';
import { incrementProjectViews } from '@/lib/actions/interactions';
import { mockProjects } from '@/app/data/mock-projects';

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
  const projectFromDb = await prisma.project.findUnique({
    where: { slug: params.slug },
    include: {
      creator: true,
      posts: true,
      files: true,
    },
  }).catch(() => null);

  if (projectFromDb) {
    incrementProjectViews(projectFromDb.id).catch(() => {});
    const project = mapDbToProject(projectFromDb);
    return renderPage(project, searchParams.v);
  }

  // 2. Try Mock Data
  const mock = mockProjects.find(c => c.slug === params.slug);
  if (mock) {
    return renderPage(mock, searchParams.v);
  }

  return notFound();
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

async function renderPage(project: Project, videoId?: string) {
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
          project={project}
          videoId={videoId}
          userProfile={userProfile}
        />
        <Footer />
      </div>
    );
}
