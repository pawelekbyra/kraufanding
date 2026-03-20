import { Campaign, Category, Reward, User } from './types';

export const categories: Category[] = [
  { id: '1', name: 'Technologia', slug: 'technologia', icon: 'Cpu', campaignCount: 24 },
  { id: '2', name: 'Muzyka', slug: 'muzyka', icon: 'Music', campaignCount: 18 },
  { id: '3', name: 'Film i Video', slug: 'film-video', icon: 'Film', campaignCount: 32 },
  { id: '4', name: 'Sztuka', slug: 'sztuka', icon: 'Palette', campaignCount: 15 },
  { id: '5', name: 'Gry', slug: 'gry', icon: 'Gamepad2', campaignCount: 28 },
  { id: '6', name: 'Design', slug: 'design', icon: 'PenTool', campaignCount: 21 },
  { id: '7', name: 'Moda', slug: 'moda', icon: 'Shirt', campaignCount: 12 },
  { id: '8', name: 'Jedzenie', slug: 'jedzenie', icon: 'UtensilsCrossed', campaignCount: 9 },
  { id: '9', name: 'Społeczność', slug: 'spolecznosc', icon: 'Users', campaignCount: 45 },
  { id: '10', name: 'Środowisko', slug: 'srodowisko', icon: 'Leaf', campaignCount: 16 },
];

export const campaigns: Campaign[] = [
  {
    id: '1',
    title: 'Innowacyjny Smartwatch dla Aktywnych',
    slug: 'innowacyjny-smartwatch-dla-aktywnych',
    description: `
      <h2>O projekcie</h2>
      <p>Tworzymy smartwatch nowej generacji, który łączy w sobie najnowsze technologie z eleganckim designem. Nasz zespół pracuje nad tym projektem od 2 lat, a teraz jesteśmy gotowi wprowadzić go na rynek.</p>
      
      <h3>Kluczowe funkcje:</h3>
      <ul>
        <li>Monitorowanie tętna 24/7 z dokładnością medyczną</li>
        <li>GPS z mapami offline</li>
        <li>Wodoodporność do 100m</li>
        <li>Bateria na 14 dni</li>
        <li>Ekran AMOLED 1.4"</li>
      </ul>
      
      <h3>Dlaczego potrzebujemy Twojego wsparcia?</h3>
      <p>Zebrane środki pozwolą nam rozpocząć masową produkcję i dostarczyć zegarki do pierwszych klientów już w przyszłym kwartale.</p>
    `,
    shortDescription: 'Smartwatch z 14-dniową baterią, GPS i wodoodpornością do 100m. Stworzony przez pasjonatów dla aktywnych ludzi.',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
      'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=800&q=80',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&q=80',
    ],
    video: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    goalAmount: 250000,
    raisedAmount: 187500,
    backersCount: 423,
    daysLeft: 18,
    endDate: '2026-04-15',
    startDate: '2026-02-15',
    category: 'technologia',
    location: 'Warszawa, Polska',
    creatorId: '1',
    creatorName: 'TechStart Studio',
    creatorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80',
    status: 'active',
    featured: true,
    rewards: [
      {
        id: 'r1',
        campaignId: '1',
        title: 'Wczesny Ptak',
        description: 'Bądź jednym z pierwszych posiadaczy naszego smartwatcha! Otrzymasz zegarek w limitowanej edycji z grawerunkiem.',
        amount: 499,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80',
        estimatedDelivery: 'Czerwiec 2026',
        shippingType: 'domestic',
        limitedQuantity: 100,
        claimedCount: 78,
        items: ['Smartwatch', 'Dodatkowy pasek', 'Ładowarka', 'Pudełko prezentowe'],
      },
      {
        id: 'r2',
        campaignId: '1',
        title: 'Standard',
        description: 'Kompletny zestaw smartwatcha z wszystkimi akcesoriami.',
        amount: 599,
        estimatedDelivery: 'Lipiec 2026',
        shippingType: 'international',
        claimedCount: 245,
        items: ['Smartwatch', 'Pasek silikonowy', 'Ładowarka'],
      },
      {
        id: 'r3',
        campaignId: '1',
        title: 'Premium Pack',
        description: 'Zestaw dla wymagających - zegarek plus ekskluzywne dodatki.',
        amount: 899,
        estimatedDelivery: 'Lipiec 2026',
        shippingType: 'international',
        limitedQuantity: 50,
        claimedCount: 32,
        items: ['Smartwatch', '3 paski premium', 'Stacja dokująca', 'Etui podróżne', 'Rok premium w aplikacji'],
      },
    ],
    updates: [
      {
        id: 'u1',
        campaignId: '1',
        title: 'Osiągnęliśmy 75% celu!',
        content: 'Dziękujemy wszystkim wspierającym! Wasza wiara w nasz projekt motywuje nas do jeszcze cięższej pracy.',
        createdAt: '2026-03-15',
      },
      {
        id: 'u2',
        campaignId: '1',
        title: 'Nowy kolor w ofercie',
        content: 'Dzięki Waszym sugestiom dodajemy nowy kolor - Midnight Blue!',
        createdAt: '2026-03-10',
      },
    ],
    faqs: [
      { id: 'f1', question: 'Czy zegarek jest kompatybilny z iOS?', answer: 'Tak, nasz smartwatch działa zarówno z iOS jak i Android.' },
      { id: 'f2', question: 'Jaka jest gwarancja?', answer: 'Oferujemy 2-letnią gwarancję producenta na wszystkie urządzenia.' },
    ],
    createdAt: '2026-02-15',
    updatedAt: '2026-03-15',
  },
  {
    id: '2',
    title: 'Album Debiutancki - Echoes of Tomorrow',
    slug: 'album-debiutancki-echoes-of-tomorrow',
    description: `
      <h2>Nasza muzyka, Wasza historia</h2>
      <p>Po 5 latach grania po klubach w całej Polsce, jesteśmy gotowi nagrać nasz pierwszy profesjonalny album. "Echoes of Tomorrow" to 12 utworów, które opowiadają o marzeniach, miłości i nadziei.</p>
    `,
    shortDescription: 'Debiutancki album zespołu indie-rock z Krakowa. 12 utworów pełnych emocji i energii.',
    image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&q=80',
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80',
    ],
    goalAmount: 35000,
    raisedAmount: 28750,
    backersCount: 312,
    daysLeft: 12,
    endDate: '2026-04-02',
    startDate: '2026-02-01',
    category: 'muzyka',
    location: 'Kraków, Polska',
    creatorId: '2',
    creatorName: 'The Midnight Echo',
    creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
    status: 'active',
    featured: true,
    rewards: [
      {
        id: 'r4',
        campaignId: '2',
        title: 'Album Cyfrowy',
        description: 'Pobierz album w formacie FLAC + MP3',
        amount: 29,
        estimatedDelivery: 'Wrzesień 2026',
        shippingType: 'no_shipping',
        claimedCount: 156,
        items: ['Album cyfrowy (FLAC + MP3)', 'Tapety na telefon'],
      },
      {
        id: 'r5',
        campaignId: '2',
        title: 'Album Winylowy',
        description: 'Limitowany winyl + album cyfrowy',
        amount: 99,
        estimatedDelivery: 'Październik 2026',
        shippingType: 'domestic',
        limitedQuantity: 200,
        claimedCount: 134,
        items: ['Winyl 180g', 'Album cyfrowy', 'Plakat A2', 'Naklejki'],
      },
    ],
    updates: [],
    faqs: [],
    createdAt: '2026-02-01',
    updatedAt: '2026-03-01',
  },
  {
    id: '3',
    title: 'Dokumentalny Film o Polskich Rzemieślnikach',
    slug: 'dokumentalny-film-polscy-rzemieslnicy',
    description: `
      <h2>Zanim odejdą</h2>
      <p>Dokument pokazujący ostatnich mistrzów tradycyjnego rzemiosła w Polsce. Kowalstwo, bednarstwo, kaletnictwo - zawody, które zanikają wraz z ich praktykami.</p>
    `,
    shortDescription: 'Pełnometrażowy dokument o ginących zawodach rzemieślniczych w Polsce.',
    image: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=800&q=80',
    gallery: [],
    goalAmount: 120000,
    raisedAmount: 45600,
    backersCount: 189,
    daysLeft: 45,
    endDate: '2026-05-05',
    startDate: '2026-02-20',
    category: 'film-video',
    location: 'Poznań, Polska',
    creatorId: '3',
    creatorName: 'Studio Dokument',
    creatorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80',
    status: 'active',
    featured: false,
    rewards: [
      {
        id: 'r6',
        campaignId: '3',
        title: 'Dostęp do filmu',
        description: 'Oglądaj film online przed premierą',
        amount: 39,
        estimatedDelivery: 'Grudzień 2026',
        shippingType: 'no_shipping',
        claimedCount: 89,
        items: ['Dostęp online', 'Making-of'],
      },
    ],
    updates: [],
    faqs: [],
    createdAt: '2026-02-20',
    updatedAt: '2026-03-10',
  },
  {
    id: '4',
    title: 'Eko-Plecak z Recyklingu',
    slug: 'eko-plecak-z-recyklingu',
    description: `
      <h2>Zero waste w praktyce</h2>
      <p>Każdy plecak powstaje z 25 plastikowych butelek. Wytrzymały, wodoodporny i stylowy.</p>
    `,
    shortDescription: 'Stylowy plecak miejski wykonany w 100% z recyklingu plastiku oceanicznego.',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
    gallery: [],
    goalAmount: 50000,
    raisedAmount: 52500,
    backersCount: 267,
    daysLeft: 5,
    endDate: '2026-03-25',
    startDate: '2026-01-25',
    category: 'design',
    location: 'Gdańsk, Polska',
    creatorId: '4',
    creatorName: 'EcoGear Polska',
    creatorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
    status: 'funded',
    featured: true,
    rewards: [
      {
        id: 'r7',
        campaignId: '4',
        title: 'Plecak Standard',
        description: 'Plecak 25L w wybranym kolorze',
        amount: 189,
        estimatedDelivery: 'Maj 2026',
        shippingType: 'domestic',
        claimedCount: 198,
        items: ['Plecak 25L', 'Worek na buty'],
      },
    ],
    updates: [],
    faqs: [],
    createdAt: '2026-01-25',
    updatedAt: '2026-03-20',
  },
  {
    id: '5',
    title: 'Gra Planszowa - Legendy Słowiańskie',
    slug: 'gra-planszowa-legendy-slowianskie',
    description: `
      <h2>Odkryj świat słowiańskiej mitologii</h2>
      <p>Strategiczna gra planszowa osadzona w świecie słowiańskich legend. Wciel się w postać z mitologii i walcz o władzę nad krainą.</p>
    `,
    shortDescription: 'Strategiczna gra planszowa dla 2-5 graczy osadzona w słowiańskiej mitologii.',
    image: 'https://images.unsplash.com/photo-1611371805429-8b5c1b2c34ba?w=800&q=80',
    gallery: [],
    goalAmount: 80000,
    raisedAmount: 96000,
    backersCount: 534,
    daysLeft: 0,
    endDate: '2026-03-01',
    startDate: '2026-01-01',
    category: 'gry',
    location: 'Wrocław, Polska',
    creatorId: '5',
    creatorName: 'Slavic Games',
    creatorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80',
    status: 'funded',
    featured: false,
    rewards: [],
    updates: [],
    faqs: [],
    createdAt: '2026-01-01',
    updatedAt: '2026-03-01',
  },
  {
    id: '6',
    title: 'Aplikacja do Nauki Języka Polskiego',
    slug: 'aplikacja-nauki-jezyka-polskiego',
    description: `
      <h2>Polski dla obcokrajowców</h2>
      <p>Interaktywna aplikacja mobilna do nauki języka polskiego z wykorzystaniem AI i gamifikacji.</p>
    `,
    shortDescription: 'Nowoczesna aplikacja do nauki polskiego z AI i gamifikacją dla obcokrajowców.',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80',
    gallery: [],
    goalAmount: 150000,
    raisedAmount: 67500,
    backersCount: 412,
    daysLeft: 30,
    endDate: '2026-04-20',
    startDate: '2026-02-20',
    category: 'technologia',
    location: 'Łódź, Polska',
    creatorId: '6',
    creatorName: 'PolyglotTech',
    creatorAvatar: 'https://images.unsplash.com/photo-1599566150163-29194dcabd36?w=100&q=80',
    status: 'active',
    featured: false,
    rewards: [],
    updates: [],
    faqs: [],
    createdAt: '2026-02-20',
    updatedAt: '2026-03-15',
  },
];

export const users: User[] = [
  {
    id: '1',
    name: 'TechStart Studio',
    email: 'contact@techstart.pl',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80',
    bio: 'Zespół pasjonatów technologii tworzący innowacyjne urządzenia.',
    website: 'https://techstart.pl',
    location: 'Warszawa, Polska',
    campaigns: ['1'],
    backedCampaigns: [],
    totalRaised: 187500,
    totalBacked: 0,
    createdAt: '2025-01-15',
  },
];

export function getCampaignBySlug(slug: string): Campaign | undefined {
  return campaigns.find(c => c.slug === slug);
}

export function getFeaturedCampaigns(): Campaign[] {
  return campaigns.filter(c => c.featured && c.status === 'active');
}

export function getCampaignsByCategory(categorySlug: string): Campaign[] {
  return campaigns.filter(c => c.category === categorySlug);
}

export function getActiveCampaigns(): Campaign[] {
  return campaigns.filter(c => c.status === 'active' || c.status === 'funded');
}
