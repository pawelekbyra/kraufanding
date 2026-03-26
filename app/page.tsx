import React from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChannelHome from './components/ChannelHome';
import { prisma } from '@/lib/prisma';
import { auth, currentUser } from '@clerk/nextjs/server';
import { Video } from './types/video';

export const dynamic = 'force-dynamic';

export default async function Home({ searchParams }: { searchParams: { v?: string } }) {
  // 1. Fetch all videos from DB
  let allVideosDb = await prisma.video.findMany({
    include: { creator: true },
    orderBy: { createdAt: 'desc' }
  }).catch(() => []);

  if (allVideosDb.length === 0) {
    return (
        <div className="min-h-screen bg-[#FDFBF7] text-[#1a1a1a] font-serif flex flex-col">
            <Navbar />
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <h1 className="text-4xl font-black uppercase tracking-tighter">Brak materiałów</h1>
                <p className="text-[#606060] mt-2">Baza danych jest pusta lub w trakcie konfiguracji.</p>
            </div>
            <Footer />
        </div>
    );
  }

  const mainVideoDb = allVideosDb.find(v => v.isMainFeatured) || allVideosDb[0];
  const mainVideo = mapDbToVideo(mainVideoDb);
  const allVideos = allVideosDb.map(mapDbToVideo);

  const { userId } = auth();
  const user = await currentUser();
  let userDb = null;
  try {
      userDb = userId ? await prisma.user.findUnique({ where: { id: userId } }) : null;
  } catch (e) {
      console.error("[HOME_PAGE_USER_DB_ERROR]", e);
  }

  const userProfile = userId ? {
      id: userId,
      email: user?.primaryEmailAddress?.emailAddress || '',
      imageUrl: user?.imageUrl || null,
      totalPaid: userDb?.totalPaid || 0
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
    duration: v.duration,
    tier: v.tier,
    views: v.views,
    likesCount: v.likesCount,
    dislikesCount: v.dislikesCount,
    isMainFeatured: v.isMainFeatured,
    publishedAt: v.publishedAt,
    createdAt: v.createdAt,
    updatedAt: v.updatedAt,
    creator: v.creator ? {
      id: v.creator.id,
      name: v.creator.name,
      slug: v.creator.slug,
      bio: v.creator.bio,
      bannerUrl: v.creator.bannerUrl,
      subscribersCount: v.creator.subscribersCount
    } : undefined
  };
}
