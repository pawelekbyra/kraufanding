import { AccessTier } from "@prisma/client";
import { Video } from "../types/video";

export const mockVideos: Video[] = [
  {
    id: "v1",
    creatorId: "c1",
    title: "I raise money for my Secret Project",
    slug: "secret-project",
    description: "Zapraszam do obczajenia moich nowych materiałów wideo. Zostając Patronem, zyskujesz stały dostęp do tajnych materiałów operacyjnych.",
    videoUrl: "https://vimeo.com/placeholder1",
    thumbnailUrl: "https://picsum.photos/seed/secret/1200/675",
    tier: "PUBLIC" as AccessTier,
    views: 124562,
    likesCount: 12400,
    isMain: true,
    publishedAt: new Date("2024-03-24"),
    creator: {
      id: "c1",
      name: "Paweł Polutek",
      slug: "polutek",
      subscribersCount: 1200000,
      bio: "Twórca platformy polutek.pl."
    }
  },
  {
    id: "v2",
    creatorId: "c1",
    title: "Operacja Strefa Zero",
    slug: "strefa-zero",
    description: "Analiza terenu i pierwsze nagrania z miejsca zdarzenia.",
    videoUrl: "https://vimeo.com/placeholder2",
    thumbnailUrl: "https://picsum.photos/seed/zero/400/225",
    tier: "LOGGED_IN" as AccessTier,
    views: 45000,
    likesCount: 3200,
    isMain: false,
    publishedAt: new Date("2024-03-20"),
    creator: {
      id: "c1",
      name: "Paweł Polutek",
      slug: "polutek",
      subscribersCount: 1200000,
      bio: "Twórca platformy polutek.pl."
    }
  },
  {
    id: "v3",
    creatorId: "c1",
    title: "Raport: Systemy Kontroli",
    slug: "raport-systemy",
    description: "Jak działają mechanizmy, o których nikt nie mówi.",
    videoUrl: "https://vimeo.com/placeholder3",
    thumbnailUrl: "https://picsum.photos/seed/raport/400/225",
    tier: "VIP1" as AccessTier,
    views: 28000,
    likesCount: 1500,
    isMain: false,
    publishedAt: new Date("2024-03-15"),
    creator: {
      id: "c1",
      name: "Paweł Polutek",
      slug: "polutek",
      subscribersCount: 1200000,
      bio: "Twórca platformy polutek.pl."
    }
  },
  {
    id: "v4",
    creatorId: "c1",
    title: "Archiwum X: Niepublikowane",
    slug: "archiwum-x",
    description: "Materiały, które miały nigdy nie ujrzeć światła dziennego.",
    videoUrl: "https://vimeo.com/placeholder4",
    thumbnailUrl: "https://picsum.photos/seed/x/400/225",
    tier: "VIP2" as AccessTier,
    views: 12000,
    likesCount: 900,
    isMain: false,
    publishedAt: new Date("2024-03-10"),
    creator: {
      id: "c1",
      name: "Paweł Polutek",
      slug: "polutek",
      subscribersCount: 1200000,
      bio: "Twórca platformy polutek.pl."
    }
  }
];
