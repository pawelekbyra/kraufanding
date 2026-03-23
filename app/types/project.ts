export interface Project {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  author: string;
  views: number;
  thumbnail: string;
  publishedAt?: string;
  story?: string[];
  donations?: Donation[];
  updates?: Update[];
  comments?: Comment[];
  materials?: Material[];
}

export interface Material {
  id: string;
  title: string;
  thumbnail: string;
  description?: string;
  likesCount?: number;
  publishedAt?: string;
  minTier: number; // 0: Public, 1: Logged-in, 2: Patron
}

export interface Donation {
  id: string;
  amount: number;
  currency: string;
  createdAt: string;
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
