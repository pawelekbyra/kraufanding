export interface Reward {
  id: string;
  title: string;
  amount: number;
  description: string;
  estimatedDelivery: string;
  backers: number;
  items: string[];
}

export interface Campaign {
  id: string;
  title: string;
  tagline: string;
  description: string;
  goal: number;
  raised: number;
  backers: number;
  daysRemaining: number;
  image: string;
  category: string;
  author: {
    name: string;
    avatar: string;
    bio: string;
  };
  rewards: Reward[];
  updates: {
    date: string;
    title: string;
    content: string;
  }[];
}
