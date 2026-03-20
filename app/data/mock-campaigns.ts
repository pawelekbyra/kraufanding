import { Campaign } from "./types/campaign";

export const SECRET_PROJECT: Campaign = {
  id: "secret-project-01",
  title: "Secret Project",
  tagline: "The future of decentralized collaboration is here.",
  description: "Secret Project is a revolutionary platform designed to empower creators through secure, decentralized infrastructure. We are building a workspace where privacy meets productivity, allowing teams to collaborate across borders without compromising their intellectual property. Our mission is to democratize access to advanced cryptographic tools, making them accessible to every artist, developer, and visionary.",
  goal: 500000,
  raised: 342600,
  backers: 1240,
  daysRemaining: 14,
  image: "https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=2000&auto=format&fit=crop",
  category: "Technology",
  author: {
    name: "Aether Labs",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aether",
    bio: "Aether Labs is a collective of engineers and designers dedicated to building the next generation of privacy-preserving tools."
  },
  rewards: [
    {
      id: "reward-01",
      title: "Early Access",
      amount: 25,
      description: "Get early access to the Secret Project beta and a digital badge of honor.",
      estimatedDelivery: "September 2024",
      backers: 450,
      items: ["Beta Access", "Digital Badge"]
    },
    {
      id: "reward-02",
      title: "The Visionary Pack",
      amount: 100,
      description: "Full access to all premium features for one year, plus exclusive community access.",
      estimatedDelivery: "October 2024",
      backers: 320,
      items: ["1 Year Premium", "Exclusive Discord Access", "Beta Access"]
    },
    {
      id: "reward-03",
      title: "Founding Member",
      amount: 500,
      description: "Lifetime access to the platform and your name in the 'Founders' credits.",
      estimatedDelivery: "October 2024",
      backers: 85,
      items: ["Lifetime Premium", "Founder Credits", "Exclusive Discord Access", "Beta Access"]
    }
  ],
  updates: [
    {
      date: "2024-05-15",
      title: "Core Infrastructure Complete",
      content: "We have successfully deployed the first iteration of our decentralized storage engine."
    },
    {
      date: "2024-05-01",
      title: "Kickoff!",
      content: "Thank you to all our early supporters. We are officially 50% funded!"
    }
  ]
};
