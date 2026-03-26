import { prisma } from '@/lib/prisma';
import { AccessTier } from '@prisma/client';

const ADMIN_EMAIL = "pawel.perfect@gmail.com";

export class ContentService {
  /**
   * Retrieves a single video by ID, including creator information.
   */
  static async getVideoById(videoId: string) {
    try {
      return await prisma.video.findUnique({
        where: { id: videoId },
        include: { creator: true }
      });
    } catch (e: any) {
      console.error("[GET_VIDEO_BY_ID_ERROR]", e);
      return null;
    }
  }

  /**
   * Retrieves a creator by their unique slug.
   */
  static async getCreatorBySlug(slug: string) {
    try {
      return await prisma.creator.findUnique({
        where: { slug },
        include: {
          videos: {
            orderBy: { createdAt: 'desc' }
          }
        }
      });
    } catch (e: any) {
      console.error("[GET_CREATOR_BY_SLUG_ERROR]", e);
      return null;
    }
  }

  /**
   * Evaluates if a user has access to a specific video based on its access tier
   * and the user's total historical donation value.
   */
  static async getVideoAccess(userId: string | null, videoId: string) {
    try {
      const video = await this.getVideoById(videoId);

      if (!video) {
        return { hasAccess: false, userTotalPaid: 0, requiredTier: AccessTier.PUBLIC, videoUrl: null };
      }

      const videoUrl = video.videoUrl;

      // Rule 1: The designated homepage "Hero" video is always public
      if (video.isMainFeatured) {
        return { hasAccess: true, userTotalPaid: 0, requiredTier: AccessTier.PUBLIC, videoUrl };
      }

      // Rule 2: PUBLIC tier videos are accessible by everyone
      if (video.tier === AccessTier.PUBLIC) {
        return { hasAccess: true, userTotalPaid: 0, requiredTier: video.tier, videoUrl };
      }

      // From here on, a user MUST be logged in
      if (!userId) {
        return { hasAccess: false, userTotalPaid: 0, requiredTier: video.tier, videoUrl: null };
      }

      // Rule 3: LOGGED_IN tier requires only a valid session
      if (video.tier === AccessTier.LOGGED_IN) {
        return { hasAccess: true, userTotalPaid: 0, requiredTier: video.tier, videoUrl };
      }

      // Check user's LTV status for VIP tiers
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { totalPaid: true, role: true, email: true }
      });

      if (!user) {
        return { hasAccess: false, userTotalPaid: 0, requiredTier: video.tier };
      }

      // Rule 4: System Admins have bypass access
      if (user.role === 'ADMIN' || user.email === ADMIN_EMAIL) {
        return { hasAccess: true, userTotalPaid: user.totalPaid, requiredTier: video.tier, videoUrl };
      }

      // Rule 5: VIP1 requires >= 5 EUR historical total
      if (video.tier === AccessTier.VIP1) {
        const hasAccess = user.totalPaid >= 5;
        return { hasAccess, userTotalPaid: user.totalPaid, requiredTier: video.tier, videoUrl: hasAccess ? videoUrl : null };
      }

      // Rule 6: VIP2 requires >= 10 EUR historical total
      if (video.tier === AccessTier.VIP2) {
        const hasAccess = user.totalPaid >= 10;
        return { hasAccess, userTotalPaid: user.totalPaid, requiredTier: video.tier, videoUrl: hasAccess ? videoUrl : null };
      }

      return { hasAccess: false, userTotalPaid: user.totalPaid, requiredTier: video.tier, videoUrl: null };
    } catch (error: any) {
      console.error("[GET_VIDEO_ACCESS_ERROR]", error);
      return { hasAccess: false, userTotalPaid: 0, requiredTier: AccessTier.PUBLIC, videoUrl: null };
    }
  }

  /**
   * Standardized method for creating comments.
   */
  static async createComment(data: {
    text: string,
    authorId: string,
    videoId: string,
    parentId?: string,
    creatorId?: string,
    imageUrl?: string
  }) {
    try {
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
    } catch (e: any) {
      console.error("[CREATE_COMMENT_ERROR]", e);
      throw new Error(`Failed to create comment: ${e.message}`);
    }
  }
}
