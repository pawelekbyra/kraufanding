import { AccessTier } from "@prisma/client";

export interface Creator {
  id: string;
  name: string;
  slug: string;
  bio?: string | null;
  bannerUrl?: string | null;
  subscribersCount: number;
}

export interface Video {
  id: string;
  creatorId: string;
  title: string;
  slug: string;
  description?: string | null;
  videoUrl: string;
  thumbnailUrl: string;
  duration?: string | null;
  tier: AccessTier;
  views: number;
  likesCount: number;
  dislikesCount: number;
  isMainFeatured: boolean;
  publishedAt?: Date | string | null;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  creator?: Creator;
}
