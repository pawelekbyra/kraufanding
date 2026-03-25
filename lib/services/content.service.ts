import { prisma } from '@/lib/prisma';
import { mockVideos } from '@/app/data/mock-videos';
import { AccessTier } from '@prisma/client';

export class ContentService {
  static async getVideoById(videoId: string) {
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
  }

  static async getVideoAccess(clerkUserId: string | null, videoId: string) {
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
