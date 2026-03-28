import React from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChannelHome from './components/ChannelHome';
import { prisma } from '@/lib/prisma';
import { auth, currentUser } from '@clerk/nextjs/server';
import { Video } from './types/video';
import { INITIAL_VIDEOS, DEFAULT_CREATOR } from '@/lib/data/initial-content';
import { UserService } from '@/lib/services/user.service';

export const dynamic = 'force-dynamic';

export default async function Home({ searchParams }: { searchParams: { v?: string, q?: string } }) {
  const query = searchParams.q?.trim().toLowerCase();

  // 0. Try to fetch the admin user to get the latest avatar for 'polutek' fallback
  const adminUser = await prisma.user.findFirst({
    where: { role: 'ADMIN' },
    select: { imageUrl: true }
  }).catch(() => null);

  // 1. Fetch all videos from DB
  let allVideosDb = await prisma.video.findMany({
    include: {
      creator: {
        include: {
          user: {
            select: { imageUrl: true }
          }
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  }).catch(() => []);

  let mainVideo: Video;
  let allVideos: Video[];

  if (allVideosDb.length > 0) {
    // DB Content exists
    const mainVideoDb = allVideosDb.find(v => v.isMainFeatured) || allVideosDb[0];
    mainVideo = mapWithAdminFallback(mapDbToVideo(mainVideoDb), adminUser?.imageUrl);
    allVideos = allVideosDb.map(mapDbToVideo).map(vid => mapWithAdminFallback(vid, adminUser?.imageUrl));
  } else {
    // Fallback to professional initial data if DB is empty
    const fallbackCreator = {
        ...DEFAULT_CREATOR,
        imageUrl: adminUser?.imageUrl || null
    };

    allVideos = INITIAL_VIDEOS.map(v => ({
        ...v,
        creator: v.creatorId === DEFAULT_CREATOR.id ? fallbackCreator : v.creator
    }));
    mainVideo = allVideos.find(v => v.isMainFeatured) || allVideos[0];
  }

  // 2. Implement Search Logic
  let filteredVideos = allVideos.map(vid => mapWithAdminFallback(vid, adminUser?.imageUrl));
  if (query) {
    filteredVideos = filteredVideos.filter(v =>
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
      name: userDb?.name || (user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : null),
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

function mapWithAdminFallback(v: Video, adminImageUrl?: string | null): Video {
    const isPlaceholder = !v.creator?.imageUrl || v.creator.imageUrl.includes('dicebear.com');
    if (v.creator?.slug === 'polutek' && isPlaceholder && adminImageUrl) {
        return {
            ...v,
            creator: {
                ...v.creator,
                imageUrl: adminImageUrl
            }
        };
    }
    return v;
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
      name: v.creator.slug === 'polutek' ? 'POLUTEK.PL' : v.creator.name,
      slug: v.creator.slug,
      bio: v.creator.bio,
      imageUrl: v.creator.user?.imageUrl || v.creator.imageUrl || null,
      bannerUrl: v.creator.bannerUrl,
      subscribersCount: v.creator.subscribersCount
    } : undefined
  };
}
