import { prisma } from '@/lib/prisma';
import { mockVideos } from '@/app/data/mock-videos';
import { AccessTier } from '@prisma/client';

export class ContentService {
  static async getVideoById(videoId: string) {
    try {
      let video = await prisma.video.findUnique({
        where: { id: videoId },
        include: { creator: true }
      });

      if (!video) {
        const mock = mockVideos.find(v => v.id === videoId);
        if (mock) {
          return mock;
        }
      }

      return video;
    } catch (e: any) {
      console.error("[GET_VIDEO_BY_ID_ERROR]", e);
      const mock = mockVideos.find(v => v.id === videoId);
      return mock || null;
    }
  }

  static async getCreatorBySlug(slug: string) {
    try {
        const creator = await prisma.creator.findUnique({
            where: { slug },
            include: {
                videos: {
                    orderBy: { createdAt: 'desc' }
                }
            }
        });

        if (!creator && slug === 'polutek') {
            const mainMock = mockVideos[0];
            return {
                id: mainMock.creator?.id || 'c1',
                name: mainMock.creator?.name || 'Paweł Polutek',
                slug: 'polutek',
                bio: mainMock.creator?.bio || 'Twórca platformy polutek.pl.',
                subscribersCount: mainMock.creator?.subscribersCount || 1200000,
                videos: mockVideos.map(v => ({
                    ...v,
                    creator: undefined
                }))
            };
        }

        return creator;
    } catch (e: any) {
        console.error("[GET_CREATOR_BY_SLUG_ERROR]", e);
        if (slug === 'polutek' || e.code === 'P2021') {
            const mainMock = mockVideos[0];
            return {
                id: mainMock.creator?.id || 'c1',
                name: mainMock.creator?.name || 'Paweł Polutek',
                slug: 'polutek',
                bio: mainMock.creator?.bio || 'Twórca platformy polutek.pl.',
                subscribersCount: mainMock.creator?.subscribersCount || 1200000,
                videos: mockVideos.map(v => ({
                    ...v,
                    creator: undefined
                }))
            };
        }
        return null;
    }
  }

  static async getVideoAccess(clerkUserId: string | null, videoId: string) {
    try {
      const video = await this.getVideoById(videoId);

      if (!video) return { hasAccess: false, userTotalPaid: 0, requiredTier: AccessTier.PUBLIC, videoUrl: null };

      const videoUrl = video.videoUrl;

      if (video.isMainFeatured) {
        return { hasAccess: true, userTotalPaid: 0, requiredTier: AccessTier.PUBLIC, videoUrl };
      }

      if (video.tier === AccessTier.PUBLIC) {
        return { hasAccess: true, userTotalPaid: 0, requiredTier: video.tier, videoUrl };
      }

      if (!clerkUserId) {
        return { hasAccess: false, userTotalPaid: 0, requiredTier: video.tier, videoUrl: null };
      }

      if (video.tier === AccessTier.LOGGED_IN) {
        return { hasAccess: true, userTotalPaid: 0, requiredTier: video.tier, videoUrl };
      }

      const user = await prisma.user.findUnique({
        where: { clerkUserId },
        select: { totalPaid: true, role: true, email: true }
      });

      if (!user) return { hasAccess: false, userTotalPaid: 0, requiredTier: video.tier };

      if (user.role === 'ADMIN' || user.email === 'pawel.perfect@gmail.com') {
        return { hasAccess: true, userTotalPaid: user.totalPaid, requiredTier: video.tier, videoUrl };
      }

      if (video.tier === AccessTier.VIP1) {
        const hasAccess = user.totalPaid >= 5;
        return { hasAccess, userTotalPaid: user.totalPaid, requiredTier: video.tier, videoUrl: hasAccess ? videoUrl : null };
      }

      if (video.tier === AccessTier.VIP2) {
        const hasAccess = user.totalPaid >= 10;
        return { hasAccess, userTotalPaid: user.totalPaid, requiredTier: video.tier, videoUrl: hasAccess ? videoUrl : null };
      }

      return { hasAccess: false, userTotalPaid: user.totalPaid, requiredTier: video.tier, videoUrl: null };
    } catch (error) {
        console.error("[GET_VIDEO_ACCESS_ERROR]", error);
        // Minimal fallback to public check if DB is down
        const mock = mockVideos.find(v => v.id === videoId);
        const isPublic = mock?.tier === AccessTier.PUBLIC || mock?.isMainFeatured;
        return {
            hasAccess: !!isPublic,
            userTotalPaid: 0,
            requiredTier: mock?.tier || AccessTier.PUBLIC,
            videoUrl: isPublic ? mock?.videoUrl : null
        };
    }
  }

  static async createComment(data: {
    text: string,
    authorId: string,
    videoId: string,
    parentId?: string,
    creatorId?: string,
    imageUrl?: string
  }) {
    return await prisma.comment.create({
      data: {
        text: data.text,
        authorId: data.authorId,
        videoId: data.videoId,
        parentId: data.parentId,
        creatorId: data.creatorId,
        imageUrl: data.imageUrl
      }
    });
  }
}
