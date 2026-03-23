import { Project } from "../types/project";

export const mockProjects: Project[] = [
  {
    id: "secret-project",
    slug: "secret-project",
    title: "I raise money for my Secret Project",
    description: "This is a secret project that aims to change something big. I cannot reveal all details yet, but your support will help bring this idea to life. Every contribution counts and pushes this project forward.",
    category: "Technology",
    author: "Paweł Polutek",
    views: 124562,
    thumbnail: "https://picsum.photos/900/400",
    story: [
      "This is a secret project that aims to change something big.",
      "I cannot reveal all details yet, but your support will help bring this idea to life. Every contribution counts and pushes this project forward.",
      "Funds will be used for development, research, and execution. Early supporters will get exclusive updates and behind-the-scenes access."
    ],
    updates: [
      {
        id: "upd-1",
        date: "2024-05-15",
        title: "First Prototype Ready!",
        content: "We are happy to announce that our first working prototype successfully passed all laboratory tests. This is a huge step forward!"
      }
    ],
    materials: [
      {
        id: "promo",
        title: "I raise money for my Secret Project - Cover (Official Music Video)",
        thumbnail: "https://picsum.photos/seed/promo/1200/675",
        description: "Oficjalny teledysk do mojego najnowszego projektu. To dopiero początek drogi.",
        likesCount: 15420,
        publishedAt: "21 mar 2025",
        minTier: 0
      },
      {
        id: "briefing",
        title: "Briefing Operacyjny: Tajne dane",
        thumbnail: "https://picsum.photos/seed/secret-0/1200/675",
        description: "Szczegółowe omówienie założeń operacyjnych. Materiał przeznaczony dla zarejestrowanych użytkowników.",
        likesCount: 850,
        publishedAt: "22 mar 2025",
        minTier: 1
      },
      {
        id: "analiza",
        title: "Analiza systemów: Infiltracja",
        thumbnail: "https://picsum.photos/seed/secret-1/1200/675",
        description: "Głęboka analiza systemowa. Dowiedz się jak infiltrujemy zabezpieczenia.",
        likesCount: 3200,
        publishedAt: "23 mar 2025",
        minTier: 2
      },
      {
        id: "raport",
        title: "Pełny Raport Śledczy: Dowody",
        thumbnail: "https://picsum.photos/seed/secret-2/1200/675",
        description: "Kompletna dokumentacja zebranych dowodów. Tylko dla Patronów.",
        likesCount: 1100,
        publishedAt: "24 mar 2025",
        minTier: 2
      },
      {
        id: "monitoring",
        title: "Nagranie z monitoringu: Sektor 7",
        thumbnail: "https://picsum.photos/seed/secret-3/1200/675",
        description: "Przechwycone nagranie z kamer sektora siódmego.",
        likesCount: 450,
        publishedAt: "25 mar 2025",
        minTier: 2
      },
      {
        id: "logi",
        title: "Logi serwera: Przejęcie kontroli",
        thumbnail: "https://picsum.photos/seed/secret-4/1200/675",
        description: "Zapis logów z momentu przejmowania głównego serwera.",
        likesCount: 890,
        publishedAt: "26 mar 2025",
        minTier: 2
      },
      {
        id: "rozmowa",
        title: "Rozmowa przechwycona: Cel X",
        thumbnail: "https://picsum.photos/seed/secret-5/1200/675",
        description: "Zapis audio rozmowy z celem X.",
        likesCount: 120,
        publishedAt: "27 mar 2025",
        minTier: 2
      },
      {
        id: "dokumentacja",
        title: "Dokumentacja techniczna v2.1",
        thumbnail: "https://picsum.photos/seed/secret-6/1200/675",
        description: "Nowe schematy techniczne i plany rozwoju.",
        likesCount: 760,
        publishedAt: "28 mar 2025",
        minTier: 2
      },
      {
        id: "kody",
        title: "Kody źródłowe: Moduł Alpha",
        thumbnail: "https://picsum.photos/seed/secret-7/1200/675",
        description: "Przegląd kodu źródłowego modułu Alpha.",
        likesCount: 2300,
        publishedAt: "29 mar 2025",
        minTier: 2
      },
      {
        id: "wywiad",
        title: "Wywiad terenowy: Operacja Noc",
        thumbnail: "https://picsum.photos/seed/secret-8/1200/675",
        description: "Relacja z wywiadu przeprowadzonego pod osłoną nocy.",
        likesCount: 940,
        publishedAt: "30 mar 2025",
        minTier: 2
      },
      {
        id: "audio",
        title: "Zapisy audio: Świadek Zero",
        thumbnail: "https://picsum.photos/seed/secret-9/1200/675",
        description: "Zeznania świadka zero w formacie audio.",
        likesCount: 560,
        publishedAt: "31 mar 2025",
        minTier: 2
      },
      {
        id: "mapa",
        title: "Mapa powiązań: Architekt",
        thumbnail: "https://picsum.photos/seed/secret-10/1200/675",
        description: "Wizualizacja powiązań tajemniczego Architekta.",
        likesCount: 110,
        publishedAt: "01 kwi 2025",
        minTier: 2
      },
      {
        id: "satelitarne",
        title: "Zdjęcia satelitarne: Baza",
        thumbnail: "https://picsum.photos/seed/secret-11/1200/675",
        description: "Zdjęcia satelitarne wysokiej rozdzielczości głównej bazy.",
        likesCount: 880,
        publishedAt: "02 kwi 2025",
        minTier: 2
      },
      {
        id: "protokol",
        title: "Protokół bezpieczeństwa 99",
        thumbnail: "https://picsum.photos/seed/secret-12/1200/675",
        description: "Wyjaśnienie procedur protokołu 99.",
        likesCount: 1450,
        publishedAt: "03 kwi 2025",
        minTier: 2
      },
      {
        id: "archiwum",
        title: "Archiwum X: Niepublikowane",
        thumbnail: "https://picsum.photos/seed/secret-13/1200/675",
        description: "Materiały które nigdy miały nie ujrzeć światła dziennego.",
        likesCount: 9990,
        publishedAt: "04 kwi 2025",
        minTier: 2
      },
      {
        id: "final",
        title: "Finałowy raport: Rozwiązanie",
        thumbnail: "https://picsum.photos/seed/secret-14/1200/675",
        description: "Wszystko staje się jasne. Finał projektu.",
        likesCount: 25000,
        publishedAt: "05 kwi 2025",
        minTier: 2
      }
    ],
    comments: []
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
    story: [
      "Urbanization is moving fast, but our cities are losing their connection to nature.",
      "Eco City is a mission to bring green back to every balcony and rooftop.",
      "We've designed a modular system that's easy to install and maintain, even for the busiest professionals."
    ],
    materials: [],
    updates: [],
    comments: []
  }
];
