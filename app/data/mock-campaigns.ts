import { Campaign } from "../types/campaign";

export const mockCampaigns: Campaign[] = [
  {
    id: "secret-project",
    title: "I raise money for my secret projekt",
    description: "This is a secret project that aims to change something big. I cannot reveal all details yet, but your support will help bring this idea to life. Every contribution counts and pushes this project forward.",
    category: "Technology",
    author: "Secret Author",
    goal: 10000,
    raised: 6500,
    thumbnail: "https://picsum.photos/900/400",
    endDate: "2024-12-31",
    story: [
      "This is a secret project that aims to change something big.",
      "I cannot reveal all details yet, but your support will help bring this idea to life. Every contribution counts and pushes this project forward.",
      "Funds will be used for development, research, and execution. Early supporters will get exclusive updates and behind-the-scenes access."
    ],
    rewards: [
      {
        id: "reward-1",
        title: "Early Bird",
        amount: 250,
        description: "Get the Secret Project at the lowest price before anyone else. Limited edition with engraving.",
        deliveryDate: "March 2025",
        backers: 12
      },
      {
        id: "reward-2",
        title: "Developer Pack",
        amount: 750,
        description: "Device plus access to full SDK and closed community of creators. Create your own apps!",
        deliveryDate: "February 2025",
        backers: 8
      },
      {
        id: "reward-3",
        title: "Visionary",
        amount: 2500,
        description: "Two devices, meeting with the project team and lifetime subscription for all future updates.",
        deliveryDate: "January 2025",
        backers: 2
      }
    ],
    updates: [
      {
        id: "upd-1",
        date: "2024-05-15",
        title: "First Prototype Ready!",
        content: "We are happy to announce that our first working prototype successfully passed all laboratory tests. This is a huge step forward!"
      }
    ],
    comments: [
      {
        id: "com-1",
        author: "John D.",
        avatar: "https://i.pravatar.cc/150?u=john",
        date: "2024-06-10",
        content: "This looks amazing! I can't wait to get my hands on it."
      }
    ]
  }
];
