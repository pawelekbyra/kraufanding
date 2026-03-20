export interface Campaign {
  id: string;
  title: string;
  description: string;
  category: string;
  author: string;
  goal: number;
  raised: number;
  thumbnail: string;
  endDate: string;
  story?: string[];
  rewards?: Reward[];
}

export interface Reward {
  id: string;
  title: string;
  amount: number;
  description: string;
  deliveryDate: string;
  backers: number;
}
