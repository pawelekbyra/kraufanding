import { Campaign } from "../types/campaign";

export const mockCampaigns: Campaign[] = [
  {
    id: "secret-project",
    title: "I rise money for my Secret Project",
    description: "A groundbreaking initiative that will redefine our future. Join us in making this secret a reality for everyone.",
    category: "Technology",
    author: "The Innovator",
    goal: 500000,
    raised: 350000,
    thumbnail: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=1200",
    endDate: "2024-12-31",
    story: [
      "The Secret Project is a culmination of years of research and development in stealth mode. We've been working tirelessly to create something that doesn't just improve lives, but fundamentally changes how we interact with the world around us.",
      "Our approach combines cutting-edge engineering with intuitive design. While we can't reveal every detail just yet (it is a secret project, after all!), we can tell you that it involves pushing the boundaries of what's possible in the digital-physical interface.",
      "The funds raised here will go directly towards final prototype testing and moving into our first production run. By backing us now, you're not just buying a product; you're becoming a part of the secret that will soon take the world by storm.",
      "Thank you for your trust and for being part of this journey. Together, we will rise to the occasion and bring the Secret Project to life."
    ],
    rewards: [
      {
        id: "reward-1",
        title: "The Secret Backer",
        amount: 50,
        description: "Get your name in the secret credits of our project and receive exclusive weekly updates on our progress.",
        deliveryDate: "January 2025",
        backers: 450
      },
      {
        id: "reward-2",
        title: "Early Bird Access",
        amount: 250,
        description: "Be among the first to receive the Secret Project at a significantly reduced price. Limited quantity available.",
        deliveryDate: "March 2025",
        backers: 120
      },
      {
        id: "reward-3",
        title: "The Visionary Kit",
        amount: 1000,
        description: "Receive the limited edition version of the Secret Project, an invitation to our launch party, and a 1-on-1 call with the founder.",
        deliveryDate: "February 2025",
        backers: 15
      }
    ],
    updates: [
      {
        id: "upd-1",
        date: "2024-08-15",
        title: "Prototype v3.4 is stable!",
        content: "We've successfully completed a 48-hour continuous stress test on our latest prototype. The results exceeded our expectations by 15%."
      },
      {
        id: "upd-2",
        date: "2024-08-01",
        title: "Materials secured",
        content: "Great news! We've secured the supply chain for the critical components needed for our first batch of production."
      }
    ],
    faqs: [
      {
        id: "faq-1",
        question: "When will the secret be revealed?",
        answer: "We plan to do a full reveal once we hit 80% of our funding goal. Backers will get a sneak peek even earlier!"
      },
      {
        id: "faq-2",
        question: "Is international shipping available?",
        answer: "Yes, we ship worldwide. Shipping costs will be calculated and charged separately after the campaign ends."
      }
    ]
  },
  {
    id: "eko-miasto",
    title: "Eko Miasto 2025",
    description: "Budujemy zrównoważoną przestrzeń miejską z wykorzystaniem najnowszych technologii recyklingu.",
    category: "Ekologia",
    author: "Zielona Ziemia",
    goal: 100000,
    raised: 45000,
    thumbnail: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&q=80&w=800",
    endDate: "2024-10-15",
  },
];
