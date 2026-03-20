export interface Campaign {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  image: string;
  gallery: string[];
  video?: string;
  goalAmount: number;
  raisedAmount: number;
  backersCount: number;
  daysLeft: number;
  endDate: string;
  startDate: string;
  category: string;
  location: string;
  creatorId: string;
  creatorName: string;
  creatorAvatar: string;
  status: 'draft' | 'pending' | 'active' | 'funded' | 'expired';
  featured: boolean;
  rewards: Reward[];
  updates: CampaignUpdate[];
  faqs: FAQ[];
  createdAt: string;
  updatedAt: string;
}

export interface Reward {
  id: string;
  campaignId: string;
  title: string;
  description: string;
  amount: number;
  image?: string;
  estimatedDelivery: string;
  shippingType: 'no_shipping' | 'domestic' | 'international';
  limitedQuantity?: number;
  claimedCount: number;
  items: string[];
}

export interface CampaignUpdate {
  id: string;
  campaignId: string;
  title: string;
  content: string;
  createdAt: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export interface Backer {
  id: string;
  campaignId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  amount: number;
  rewardId?: string;
  anonymous: boolean;
  message?: string;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  website?: string;
  location?: string;
  campaigns: string[];
  backedCampaigns: string[];
  totalRaised: number;
  totalBacked: number;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  campaignCount: number;
}
