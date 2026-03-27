import React from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChannelHome from './components/ChannelHome';
import { prisma } from '@/lib/prisma';
import { auth, currentUser } from '@clerk/nextjs/server';
import { Video } from './types/video';
import { INITIAL_VIDEOS } from '@/lib/data/initial-content';
import { UserService } from '@/lib/services/user.service';

export const dynamic = 'force-dynamic';

export default async function Home({ searchParams }: { searchParams: { v?: string, q?: string } }) {
  const query = searchParams.q?.trim().toLowerCase();

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
    // Fallback to professional initial data if DB is empty
    mainVideo = INITIAL_VIDEOS.find(v => v.isMainFeatured) || INITIAL_VIDEOS[0];
    allVideos = INITIAL_VIDEOS;
  }

  // 2. Implement Search Logic
  let filteredVideos = allVideos;
  if (query) {
    filteredVideos = allVideos.filter(v =>
      v.title.toLowerCase().includes(query) ||
      (v.description && v.description.toLowerCase().includes(query)) ||
      (v.creator?.name && v.creator.name.toLowerCase().includes(query))
    );
  }

  const selectedVideo = allVideos.find(v => v.id === searchParams.v) || mainVideo;

  const { userId } = auth();
  const user = await currentUser();

  let userDb = null;
  let initialInteraction = { liked: false, disliked: false };
  let initialIsSubscribed = false;

  try {
      if (userId) {
          // Fetch user record and interaction status in parallel
          const [dbUser, interaction, subscribed] = await Promise.all([
              prisma.user.findUnique({ where: { id: userId } }),
              UserService.getVideoInteraction(userId, selectedVideo.id),
              UserService.isSubscribed(userId, selectedVideo.creatorId)
          ]);
          userDb = dbUser;
          initialInteraction = interaction;
          initialIsSubscribed = subscribed;
      }
  } catch (e) {
      console.error("[HOME_PAGE_USER_DATA_ERROR]", e);
  }

  const userProfile = userId ? {
      id: userId,
      email: user?.primaryEmailAddress?.emailAddress || '',
      imageUrl: user?.imageUrl || null,
      totalPaid: userDb?.totalPaid || 0,
      initialInteraction,
      initialIsSubscribed
  } : null;

  return (
      <div className="min-h-screen bg-[#FDFBF7] text-[#1a1a1a] font-serif">
          <Navbar />
          <ChannelHome
            mainVideo={mainVideo}
            allVideos={filteredVideos}
            currentVideoId={searchParams.v}
            userProfile={userProfile as any}
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
