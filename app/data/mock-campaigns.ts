import { Campaign } from "../types/campaign";

export const mockCampaigns: Campaign[] = [
  {
    id: "secret-project",
    slug: "secret-project",
    title: "I raise money for my Secret Project",
    description: "This is a secret project that aims to change something big. I cannot reveal all details yet, but your support will help bring this idea to life. Every contribution counts and pushes this project forward.",
    category: "Technology",
    author: "Paweł Polutek",
    views: 124562,
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
    videos: [
      {
        id: "promo",
        title: "I raise money for my Secret Project - Cover (Official Music Video)",
        thumbnail: "https://picsum.photos/seed/promo/1200/675",
        minTier: 0
      },
      {
        id: "briefing",
        title: "Briefing Operacyjny: Tajne dane",
        thumbnail: "https://picsum.photos/seed/secret-0/1200/675",
        minTier: 1
      },
      {
        id: "analiza",
        title: "Analiza systemów: Infiltracja",
        thumbnail: "https://picsum.photos/seed/secret-1/1200/675",
        minTier: 2
      },
      {
        id: "raport",
        title: "Pełny Raport Śledczy: Dowody",
        thumbnail: "https://picsum.photos/seed/secret-2/1200/675",
        minTier: 2
      },
      {
        id: "monitoring",
        title: "Nagranie z monitoringu: Sektor 7",
        thumbnail: "https://picsum.photos/seed/secret-3/1200/675",
        minTier: 2
      },
      {
        id: "logi",
        title: "Logi serwera: Przejęcie kontroli",
        thumbnail: "https://picsum.photos/seed/secret-4/1200/675",
        minTier: 2
      },
      {
        id: "rozmowa",
        title: "Rozmowa przechwycona: Cel X",
        thumbnail: "https://picsum.photos/seed/secret-5/1200/675",
        minTier: 2
      },
      {
        id: "dokumentacja",
        title: "Dokumentacja techniczna v2.1",
        thumbnail: "https://picsum.photos/seed/secret-6/1200/675",
        minTier: 2
      },
      {
        id: "kody",
        title: "Kody źródłowe: Moduł Alpha",
        thumbnail: "https://picsum.photos/seed/secret-7/1200/675",
        minTier: 2
      },
      {
        id: "wywiad",
        title: "Wywiad terenowy: Operacja Noc",
        thumbnail: "https://picsum.photos/seed/secret-8/1200/675",
        minTier: 2
      },
      {
        id: "audio",
        title: "Zapisy audio: Świadek Zero",
        thumbnail: "https://picsum.photos/seed/secret-9/1200/675",
        minTier: 2
      },
      {
        id: "mapa",
        title: "Mapa powiązań: Architekt",
        thumbnail: "https://picsum.photos/seed/secret-10/1200/675",
        minTier: 2
      },
      {
        id: "satelitarne",
        title: "Zdjęcia satelitarne: Baza",
        thumbnail: "https://picsum.photos/seed/secret-11/1200/675",
        minTier: 2
      },
      {
        id: "protokol",
        title: "Protokół bezpieczeństwa 99",
        thumbnail: "https://picsum.photos/seed/secret-12/1200/675",
        minTier: 2
      },
      {
        id: "archiwum",
        title: "Archiwum X: Niepublikowane",
        thumbnail: "https://picsum.photos/seed/secret-13/1200/675",
        minTier: 2
      },
      {
        id: "final",
        title: "Finałowy raport: Rozwiązanie",
        thumbnail: "https://picsum.photos/seed/secret-14/1200/675",
        minTier: 2
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
  },
  {
    id: "eco-city",
    slug: "eco-city-initiative",
    title: "Eco City: Sustainable Urban Living",
    description: "Help us transform urban spaces into green oases. We are developing modular vertical gardens and automated composting systems for city dwellers.",
    category: "Environment",
    author: "Green Future Team",
    views: 124562,
    thumbnail: "https://picsum.photos/seed/eco/900/400",
    endDate: "2025-06-01",
    story: [
      "Urbanization is moving fast, but our cities are losing their connection to nature.",
      "Eco City is a mission to bring green back to every balcony and rooftop.",
      "We've designed a modular system that's easy to install and maintain, even for the busiest professionals."
    ],
    rewards: [
      {
        id: "eco-1",
        title: "Starter Kit",
        amount: 100,
        description: "One vertical garden module and organic seeds.",
        deliveryDate: "August 2025",
        backers: 45
      },
      {
        id: "eco-2",
        title: "Home Forest",
        amount: 500,
        description: "Five modules plus an automated irrigation system.",
        deliveryDate: "July 2025",
        backers: 12
      }
    ],
    updates: [],
    comments: []
  }
];
