export interface Campaign {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  author: string;
  goal?: number;
  raised?: number;
  views: number;
  thumbnail: string;
  endDate: string;
  story?: string[];
  rewards?: Reward[];
  updates?: Update[];
  comments?: Comment[];
  videos?: Video[];
}

export interface Video {
  id: string;
  title: string;
  thumbnail: string;
  description?: string;
  likesCount?: number;
  publishedAt?: string;
  minTier: number; // 0: Public, 1: Logged-in, 2: Patron
}

export interface Reward {
  id: string;
  title: string;
  amount: number;
  description: string;
  deliveryDate: string;
  backers: number;
}

export interface Update {
  id: string;
  date: string;
  title: string;
  content: string;
}

export interface Comment {
  id: string;
  author: string;
  avatar?: string;
  date: string;
  content: string;
}
