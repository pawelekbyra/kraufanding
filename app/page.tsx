import React from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChannelHome from './components/ChannelHome';
import { prisma } from '@/lib/prisma';
import { auth, currentUser } from '@clerk/nextjs/server';
import { Video } from './types/video';
import { mockVideos } from './data/mock-videos';

export const dynamic = 'force-dynamic';

export default async function Home({ searchParams }: { searchParams: { v?: string } }) {
  // 1. Fetch all videos from DB
  let allVideosDb = await prisma.video.findMany({
    include: { creator: true },
    orderBy: { createdAt: 'desc' }
  }).catch(() => []);

  let mainVideo: Video;
  let allVideos: Video[];

  if (allVideosDb.length > 0) {
    // DB Content exists
    const mainVideoDb = allVideosDb.find(v => v.isMainFeatured) || allVideosDb[0];
    mainVideo = mapDbToVideo(mainVideoDb);
    allVideos = allVideosDb.map(mapDbToVideo);
  } else {
    // Fallback to identical mock state
    mainVideo = mockVideos[0];
    allVideos = mockVideos;
  }

  const { userId } = auth();
  const user = await currentUser();

  const userProfile = userId ? {
      id: userId,
      email: user?.primaryEmailAddress?.emailAddress || '',
      imageUrl: user?.imageUrl || null
  } : null;

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
    isMainFeatured: v.isMainFeatured,
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
