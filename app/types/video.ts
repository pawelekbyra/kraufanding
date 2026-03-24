import { AccessTier } from "@prisma/client";

export interface Creator {
  id: string;
  name: string;
  slug: string;
  bio?: string | null;
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
  tier: AccessTier;
  views: number;
  likesCount: number;
  isMain: boolean;
  publishedAt?: Date | string | null;
  creator?: Creator;
}
