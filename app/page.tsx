import React from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChannelHome from './components/ChannelHome';
import { prisma } from '@/lib/prisma';
import { auth, currentUser } from '@clerk/nextjs/server';
import { Video } from './types/video';
import { INITIAL_VIDEOS, DEFAULT_CREATOR } from '@/lib/data/initial-content';
import { UserService } from '@/lib/services/user.service';
import { ContentService } from '@/lib/services/content.service';

export const dynamic = 'force-dynamic';

export default async function Home({ searchParams }: { searchParams: { v?: string, q?: string } }) {
  const query = searchParams.q?.trim().toLowerCase();
  const { userId } = auth();

  // 0. Trigger user sync immediately if logged in.
  // This ensures that if the admin is visiting, their Clerk profile (avatar) is synced BEFORE we fetch adminData.
  let userDb = null;
  if (userId) {
      userDb = await UserService.getOrCreateUser(userId).catch(() => null);
  }

  // 1. Try to fetch the admin user to get the latest data for 'polutek' fallback
  const adminData = await ContentService.getAdminData();

  // 2. Fetch all videos from DB
  let allVideosDb = await prisma.video.findMany({
    include: {
      creator: {
        include: {
          user: {
            select: { imageUrl: true, email: true }
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
    mainVideo = mapDbToVideo(mainVideoDb, adminData);
    allVideos = allVideosDb.map(v => mapDbToVideo(v, adminData));
  } else {
    // Fallback to professional initial data if DB is empty
    const fallbackCreator = {
        ...DEFAULT_CREATOR,
        imageUrl: adminData?.imageUrl || null,
        email: adminData?.email || null
    };

    allVideos = INITIAL_VIDEOS.map(v => ({
        ...v,
        creator: v.creatorId === DEFAULT_CREATOR.id ? fallbackCreator : v.creator
    }));
    mainVideo = allVideos.find(v => v.isMainFeatured) || allVideos[0];
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

  const user = await currentUser();

  let initialInteraction = { liked: false, disliked: false };
  let initialIsSubscribed = false;

  try {
      if (userId) {
          // Fetch interaction status and subscription in parallel
          const [interaction, subscribed] = await Promise.all([
              UserService.getVideoInteraction(userId, selectedVideo.id),
              UserService.isSubscribed(userId, selectedVideo.creatorId)
          ]);
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
      <div className="min-h-screen bg-[#FDFBF7] text-[#1a1a1a] font-sans">
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

function mapDbToVideo(v: any, adminData?: { imageUrl?: string | null, email?: string | null } | null): Video {
  const isPolutek = v.creator?.slug?.toLowerCase() === 'polutek';

  // For 'polutek' channel, prioritize the fetched admin data (image and email)
  // Ensure we at least have the admin email for Dicebear fallback if image is null
  const resolvedEmail = (isPolutek && adminData?.email) ? adminData.email : (v.creator?.user?.email || null);
  const resolvedImageUrl = (isPolutek && adminData?.imageUrl) ? adminData.imageUrl : (v.creator?.user?.imageUrl || v.creator?.imageUrl || null);

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
      name: isPolutek ? 'Paweł Polutek' : v.creator.name,
      slug: v.creator.slug,
      bio: v.creator.bio,
      imageUrl: resolvedImageUrl,
      email: resolvedEmail,
      bannerUrl: v.creator.bannerUrl,
      subscribersCount: v.creator.subscribersCount
    } : undefined
  };
}
