import React from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChannelHome from './components/ChannelHome';
import { prisma } from '@/lib/prisma';
import { auth, currentUser } from '@clerk/nextjs/server';
import { Video } from './types/video';

export const dynamic = 'force-dynamic';

export default async function Home({ searchParams }: { searchParams: { v?: string } }) {
  // 1. Fetch all videos for the playlist/sidebar
  const allVideosDb = await prisma.video.findMany({
    include: { creator: true },
    orderBy: { createdAt: 'desc' }
  }).catch(() => []);

  // 2. Identify the main featured video
  const mainVideoDb = allVideosDb.find(v => v.isMain) || allVideosDb[0];

  if (!mainVideoDb) {
    // If no videos in DB at all, show a placeholder/empty state
    return <EmptyHome />;
  }

  const { userId } = auth();
  const user = await currentUser();

  const userProfile = userId ? {
      id: userId,
      email: user?.primaryEmailAddress?.emailAddress || '',
      imageUrl: user?.imageUrl || null
  } : null;

  // Map to the Video type
  const mainVideo: Video = mapDbToVideo(mainVideoDb);
  const allVideos: Video[] = allVideosDb.map(mapDbToVideo);

  return (
      <div className="min-h-screen bg-[#FDFBF7] text-[#1a1a1a] font-serif">
          <Navbar />
          <ChannelHome
            mainVideo={mainVideo}
            allVideos={allVideos}
            currentVideoId={searchParams.v}
            userProfile={userProfile}
          />
          <Footer />
      </div>
  );
}

function mapDbToVideo(v: any): Video {
  return {
    id: v.id,
    creatorId: v.creatorId,
    title: v.title,
    slug: v.slug,
    description: v.description,
    videoUrl: v.videoUrl,
    thumbnailUrl: v.thumbnailUrl,
    tier: v.tier,
    views: v.views,
    likesCount: v.likesCount,
    isMain: v.isMain,
    publishedAt: v.publishedAt,
    creator: v.creator ? {
      id: v.creator.id,
      name: v.creator.name,
      slug: v.creator.slug,
      bio: v.creator.bio,
      subscribersCount: v.creator.subscribersCount
    } : undefined
  };
}

function EmptyHome() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1a1a1a] font-serif flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-8">
         <div className="text-center space-y-6 max-w-xl border-2 border-dashed border-[#1a1a1a]/10 p-12 rounded-[3rem]">
            <div className="space-y-2">
               <h1 className="text-5xl font-black uppercase tracking-tighter italic">Polutek Archive</h1>
               <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#1a1a1a]/40 italic">Waiting for content to be unlocked...</p>
            </div>
            <p className="text-[#1a1a1a]/60 leading-relaxed text-lg italic">
               Ten system jest obecnie pusty. Administrator nie opublikował jeszcze żadnych materiałów operacyjnych.
            </p>
         </div>
      </main>
      <Footer />
    </div>
  );
}
