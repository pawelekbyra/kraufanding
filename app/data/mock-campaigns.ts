import { Campaign } from "../types/campaign";

export const mockCampaigns: Campaign[] = [
  {
    id: "secret-project",
    title: "I rise money for my Secret Project",
    description: "Rewolucyjny projekt, który zmieni sposób, w jaki myślimy o przyszłości. Dołącz do nas i stań się częścią czegoś wielkiego.",
    category: "Technologia",
    author: "Innowatorzy Przyszłości",
    goal: 500000,
    raised: 350000,
    thumbnail: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=800",
    endDate: "2024-12-31",
    story: [
      "Secret Project to nasza wizja przyszłości, nad którą pracowaliśmy w tajemnicy przez ostatnie trzy lata. Naszym celem jest stworzenie urządzenia, które zrewolucjonizuje sposób, w jaki wchodzimy w interakcję z technologią cyfrową.",
      "Wykorzystując zaawansowane algorytmy AI oraz nowatorskie podejście do interfejsu mózg-komputer, udało nam się stworzyć prototyp, który przekracza wszelkie dotychczasowe granice. Projekt ten nie tylko ułatwi codzienne życie, ale otworzy nowe możliwości dla osób z niepełnosprawnościami.",
      "Potrzebujemy Twojego wsparcia, aby przenieść ten projekt z fazy prototypu do masowej produkcji. Każda wpłata przybliża nas do świata, w którym technologia jest naturalnym przedłużeniem naszych myśli.",
      "Dołącz do nas już dziś i stań się pionierem nowej ery. Twoje wsparcie to nie tylko inwestycja w produkt, to inwestycja w lepszą, bardziej dostępną przyszłość dla nas wszystkich."
    ],
    rewards: [
      {
        id: "reward-1",
        title: "Wczesny Ptak (Early Bird)",
        amount: 250,
        description: "Otrzymaj Secret Project w najniższej cenie przed wszystkimi innymi. Limitowana edycja z grawerem.",
        deliveryDate: "Marzec 2025",
        backers: 120
      },
      {
        id: "reward-2",
        title: "Pakiet Deweloperski",
        amount: 750,
        description: "Urządzenie plus dostęp do pełnego SDK i zamkniętej społeczności twórców. Twórz własne aplikacje!",
        deliveryDate: "Luty 2025",
        backers: 45
      },
      {
        id: "reward-3",
        title: "Wizjoner",
        amount: 2500,
        description: "Dwa urządzenia, spotkanie z zespołem projektowym oraz dożywotnia subskrypcja na wszystkie przyszłe aktualizacje.",
        deliveryDate: "Styczeń 2025",
        backers: 12
      }
    ],
    updates: [
      {
        id: "upd-1",
        date: "2024-05-15",
        title: "Pierwszy Prototyp Gotowy!",
        content: "Z radością ogłaszamy, że nasz pierwszy działający prototyp przeszedł pomyślnie wszystkie testy laboratoryjne. To ogromny krok naprzód!"
      },
      {
        id: "upd-2",
        date: "2024-06-01",
        title: "Nowy partner technologiczny",
        content: "Nawiązaliśmy współpracę z wiodącym producentem mikroprocesorów, co pozwoli nam jeszcze bardziej zoptymalizować wydajność Secret Project."
      }
    ],
    comments: [
      {
        id: "com-1",
        author: "Michał K.",
        avatar: "https://i.pravatar.cc/150?u=michal",
        date: "2024-06-10",
        content: "To wygląda niesamowicie! Nie mogę się doczekać, aż dostanę to w swoje ręce."
      },
      {
        id: "com-2",
        author: "Anna W.",
        avatar: "https://i.pravatar.cc/150?u=anna",
        date: "2024-06-12",
        content: "Wspieram całym sercem. Potrzebujemy więcej takich innowacji."
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
  {
    id: "gra-rpg",
    title: "Mityczne Krainy",
    description: "Nowa gra RPG z otwartym światem, inspirowana słowiańską mitologią.",
    category: "Gry",
    author: "Studio Pixel",
    goal: 250000,
    raised: 180000,
    thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800",
    endDate: "2024-11-20",
  },
  {
    id: "drukarka-3d",
    title: "Pocket 3D",
    description: "Kieszonkowa drukarka 3D o wysokiej precyzji dla każdego hobbysty.",
    category: "Hardware",
    author: "TechSolutions",
    goal: 50000,
    raised: 65000,
    thumbnail: "https://images.unsplash.com/photo-1631011048644-839358249673?auto=format&fit=crop&q=80&w=800",
    endDate: "2024-09-30",
  },
];
