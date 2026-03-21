# POLUTEK.PL - Crowdfunding with Patron Content

A modern, responsive crowdfunding platform for a "Secret Project", built with Next.js 14, Tailwind CSS, and DaisyUI. This project is designed with a premium, serif-heavy aesthetic (cream and charcoal colors) and features an "OnlyFans/Patreon-style" content locking mechanism.
KRAUFANDING
Platforma hybrydowa: Crowdfunding + Subskrypcje + Premium Content
Specyfikacja Techniczna i Produktowa — wersja 2.0
1. Koncepcja i Cel Projektu
Kraufanding to własna platforma hybrydowa łącząca trzy modele: klasyczny crowdfunding zbiorek, sprzedaż permanentnego dostępu do treści oraz opcjonalne subskrypcje patronackie. Platforma buduje lejek konwersji oparty na narracji i ciekawości — publiczna historia przyciąga użytkowników, ukryte materiały wywołują chęć dostępu, a system poziomów wtajemniczenia nagradza zaangażowanie.

Kluczowa przewaga
Wszystko jest Twoje: baza użytkowników, płatności, zasady publikacji. Żadnych algorytmów zasięgu, żadnej prowizji platformy (poza standardowymi opłatami Stripe), żadnego ryzyka blokady konta.

1.1. Model działania — lejek konwersji
1. Publiczna historia przyciąga użytkownika organicznie.
2. Użytkownik czyta wciągającą narrację i napotyka fragmenty ukrytych materiałów.
3. Rejestracja za darmo daje małą próbkę — Twój email ląduje w bazie.
4. Jakakolwiek wpłata permanentnie odblokowuje dostęp do poziomu 2 (Obserwator).
5. Wyższe jednorazowe wpłaty odblokują poziomy 3, 4, 5 na zawsze.
6. Subskrypcja jest opcjonalna — daje dodatkowe perŃi lub wcześniejszy dostęp.

Zasada konta
Wpłata to upgrade konta, nie subskrypcja. Konto nigdy nie traci raz zdobytego poziomu — jednorazowa wpłata = permanentny dostęp. Subskrypcja to osobna, opcjonalna Şcieżka.

2. Pięć Poziomów Wtajemniczenia
Platforma wykorzystuje pięć poziomów dostępu opartych na narracyjnych nazwach spójnych z filozofią projektu. Każdy wyższy poziom zawiera wszystko z niższych (model kumulatywny).

Poziom
Nazwa
Co otrzymuje / warunek dostępu
0
Niezalogowany
Widzi publiczną historię, teaser i paywall. Brak konta.
1
Zalogowany
Darmowa rejestracja przez Clerka. Mała próbka premium. Email w Twojej bazie.
2
Obserwator
Jakakolwiek minimalna wpłata jednorazowa. Permanentny dostęp do core contentu.
3
Swiadek
Wyższa wpłata jednorazowa. Pogłębione materiały + wcześniejszy dostęp.
4
Insider
Jeszcze wyższa wpłata jednorazowa. Ekskluzywne materiały + kontakt bezpośredni / Q&A.
5
Architekt
Najwyższa wpłata jednorazowa. Pełny dostęp + fizyczne nagrody / podziękowania.

2.1. Szczegóły każdego poziomu
Poziom 0 — Niezalogowany
Widzi: pełną publiczną narrację / historię projektu
Widzi: teaser fragmentów premium (zamazany/urwany tekst, miniatura z rozmyciem)
Widzi: elegancki paywall jako część opowieści, nie blokadę techniczną
Nie widzi: niczego premium

Poziom 1 — Zalogowany (darmowy)
Warunek: rejestracja przez Clerka (Magic Link, Google, Apple)
Otrzymuje: małą, darmową próbkę sekretnego kontentu (np. 1 zdjęcie, fragment dokumentu)
Cel: zmniejszyć barierę wejścia, zebrać email do bazy
Konto nigdy nie traci tego poziomu

Poziom 2 — Obserwator (pierwsza wpłata)
Warunek: jakakolwiek minimalna wpłata jednorazowa (np. od 5€)
Dostęp permanentny — expires_at = NULL w bazie
Otrzymuje: core content — pełne artykuły, galeria bazowa
To jest próg „vejścia do wewnątrz“ — najważniejsza konwersja

Poziom 3 — Świadek
Warunek: wyższa jednorazowa wpłata (np. od 25€)
Dostęp permanentny
Otrzymuje: pogłębione materiały dowodowe, wcześniejszy dostęp (early access do nowych postów)
Widzi treści oznaczone min_tier_level = 3 i niższe

Poziom 4 — Insider
Warunek: wyższa jednorazowa wpłata (np. od 75€)
Dostęp permanentny
Otrzymuje: ekskluzywne materiały, dostęp do zamkniętych sesji Q&A, bezpośredni kontakt z twcórca
Widzi treści oznaczone min_tier_level = 4 i niższe

Poziom 5 — Architekt
Warunek: najwyższa jednorazowa wpłata (np. od 200€)
Dostęp permanentny
Otrzymuje: całość + fizyczne nagrody / podziękowania (imienne, listy, paczki)
Widzi wszystkie treści platformy
Ograniczona liczba miejsc (np. max 20 Architektów) — efekt niedoboru

2.2. Subskrypcja jako opcja
Subskrypcja nie jest wymagana do żadnego poziomu. Jest opcjonalną ścieżką dającą perŃi dodatkowe w ramach już posiadanego poziomu:
Wcześniejszy dostęp do nowych materiałów niż ich jednorazowy odpowiednik
Dostęp do live sesji / livestreamów
Miesięczny newsletter z zakulisowymi informacjami
Odznaka subskrybenta przy profilu

Logika techniczna subskrypcji
Użytkownik na poziomie 3 (Swiadek) może opłacić subskrypcję dającą perŃi subskrypcyjne. Jeśli anuluje — traci perŃi, ale pozostaje na poziomie 3. Jego konto nigdy nie spada.

3. Typy Użytkowników i Role
Platforma rozróżnia dwa osobne wymiary: rolę systemową (co możesz robić w panelu) oraz poziom dostępu do treści (co widzisz jako czytelnik). To są niezależne od siebie.

3.1. Role systemowe
Rola
Uprawnienia
admin
Pełna kontrola: zarządzanie użytkownikami, zatwierdzanie twcórców, wszystkie projekty, finanse, ustawienia platformy
moderator
Moderowanie treści i komentarzy: ukrywanie, usuwanie, blokowanie użytkowników. Brak dostępu do finansów i ustawień
creator
Własny panel twcórcy: tworzenie projektów, upload plików, publikowanie postów. Wymaga zatwierdzenia przez admina (is_approved = true)
user
Czytanie, płacenie, komentowanie. Domyślna rola po rejestracji

3.2. Implementacja ról w Clerk
Role trzymane są w Clerk publicMetadata jako pole role. Edge Middleware odczytuje rolę z JWT bez żadnego zapytania do bazy — każde żądanie do chronionych ścieżek jest weryfikowane w ulamku sekundy na brzegu sieci.
→ { role: 'admin' | 'moderator' | 'creator' | 'user' }

3.3. Warstwowość: rola vs poziom treści
Moderator może mieć rolę moderatora i jednocześnie poziom Insider jako czytelnik. Creator może być na poziomie Obserwator w innych projektach. Rola i poziom treści są niezależne.

4. Architektura Techniczna
4.1. Stack technologiczny
Warstwa
Technologia
Framework
Next.js (App Router + Server Components)
Hosting
Vercel — Edge Network, Serverless Functions, CI/CD
Baza danych
Neon Postgres (natywna integracja Vercel)
Autentykacja
Clerk — logowanie, rejestracja, role w JWT
Płatności
Stripe — jednorazowe wpłaty + opcjonalne subskrypcje
Storage plików
Vercel Blob — zdjęcia, wideo, dokumenty premium
Ochrona tras
Vercel Edge Middleware — sprawdzenie przed serwerem
Email
Resend — transakcyjne i newsletter
Push notifications
OneSignal — przeglądarka, telefon, PWA
SEO
noindex globalnie (X-Robots-Tag: noindex) do momentu launchu

4.2. Ochrona treści — trzy warstwy
Warstwa 1: Edge Middleware
Działa na serwerach CDN zanim żądanie dotrze do aplikacji. Sprawdza sesję Clerka i tier_level użytkownika. Jeśli nie ma dostępu — paywall natychmiast, bez obciążania bazy.
→ user → Edge CDN → weryfikacja JWT + tier → aplikacja lub paywall
Warstwa 2: Server Components
Treść generowana wyłącznie na serwerze. Niezalogowany użytkownik dostaje HTML bez żadnej ukrytej treści — nie istnieje w źródle strony, nie można jej wyciągnąć z inspektora przeglądarki.
Warstwa 3: Vercel Blob — podpisane URL-e
Pliki premium serwowane przez czasowe, podpisane URL-e. Link wygasa po kilku minutach i jest unikalny dla sesji. Przechwycony link jest bezwartościowy.

4.3. noindex — tryb ukryty
Na czas developmentu i mikkiej premiery platforma jest niewidoczna dla wyszukiwarek. Implementacja w jednej linii w app/layout.tsx:
→ export const metadata = { robots: { index: false, follow: false } }
Alternatywnie middleware dorzucający nagłówek X-Robots-Tag: noindex do każdej odpowiedzi. Usunięcie jednej linii włącza indeksowanie.

5. Schemat Bazy Danych — Neon Postgres
5.1. Tabela: users
Kolumna
Opis
id
UUID — klucz główny
clerk_id
ID z systemu Clerk — klucz łączący
email
Adres email
role
admin | moderator | creator | user
stripe_customer_id
ID klienta w Stripe
created_at
Data rejestracji

5.2. Tabela: creators
Kolumna
Opis
id
UUID
user_id
FK → users.id
slug
Unikalny identyfikator URL (np. /jan-kowalski)
name
Nazwa publiczna twcórcy
bio
Krótki opis
is_approved
Boolean — domyślnie false, admin zatwierdza
stripe_connect_id
Do przyszłej integracji Stripe Connect

5.3. Tabela: projects
Kolumna
Opis
id
UUID
creator_id
FK → creators.id
title
Tytuł projektu
slug
URL slug
goal_amount
Cel finansowy w groszach/centach
collected_amount
Zebrana kwota (aktualizowana przez webhooks)
status
draft | active | funded | closed
published_at
Data publikacji

5.4. Tabela: tiers (poziomy projektów)
Każdy projekt definiuje własne poziomy dostępu z własnymi cenami i opisami. To daje elastyczność — twcórca może nazwać poziomy inaczej i ustawić inne ceny niż inny projekt.
Kolumna
Opis
id
UUID
project_id
FK → projects.id
level
INT: 2, 3, 4, 5 (mapuje na globalny poziom dostępu)
name
Nazwa narracyjna: Obserwator, Swiadek, Insider, Architekt
description
Co zawiera ten poziom
price_one_time
Cena jednorazowa w groszach/centach
stripe_price_id
ID ceny w Stripe dla jednorazowej wpłaty
max_slots
Maksymalna liczba miejsc (NULL = bez limitu)
slots_taken
Ile miejsc zajętych (dla Architekta: np. 20/20)

5.5. Tabela: user_project_access (kluczowa tabela dostępu)
To jest serce systemu — każdy wiersz mówi: ten użytkownik, w tym projekcie, ma ten poziom, na zawsze lub do daty.
Kolumna
Opis
id
UUID
user_id
FK → users.id
project_id
FK → projects.id
tier_level
INT: 1, 2, 3, 4, 5
access_type
one_time_payment | subscription | free_sample | admin_grant
granted_at
Data przyznania dostępu
expires_at
NULL = permanentny, data = wygasa (tylko subskrypcja)
stripe_payment_id
Referencja do płatności w Stripe

Logika sprawdzania dostępu
SELECT * FROM user_project_access WHERE user_id = $1 AND project_id = $2 AND tier_level >= $3 AND (expires_at IS NULL OR expires_at > NOW())

5.6. Tabela: posts
Kolumna
Opis
id
UUID
project_id
FK → projects.id
title
Tytuł
slug
URL slug
content_public
Treść dla wszystkich (poziom 0)
content_teaser
Zamazany teaser dla niezalogowanych
content_level1
Darmowa próbka dla poziomu 1
content_premium
Pełna treść dla poziomu 2+
min_tier_level
INT: minimalny poziom wymagany do pełnego dostępu
is_early_access
Boolean — oznacza early access dla Swiadków+
published_at
Data publikacji

5.7. Tabela: payments
Kolumna
Opis
id
UUID
user_id
FK → users.id
project_id
FK → projects.id
tier_id
FK → tiers.id
amount
Kwota w groszach/centach
currency
EUR, PLN, USD
type
one_time | subscription
stripe_payment_id
ID transakcji Stripe
status
succeeded | pending | failed
created_at
Data transakcji

5.8. Tabela: subscriptions (opcjonalna ścieżka)
Kolumna
Opis
id
UUID
user_id
FK → users.id
project_id
FK → projects.id
stripe_subscription_id
ID subskrypcji w Stripe
perks_tier_level
Poziom perków subskrypcji (nie zmienia tier_level konta)
status
active | canceled | past_due
current_period_end
Koniec bieżącego okresu

6. System Płatności — Stripe
6.1. Jednorazowe wpłaty — główna ścieżka
Każdy poziom (2–5) ma zdefiniowane stripe_price_id dla jednorazowej płatności. Użytkownik płaci raz i ma dostęp na zawsze.
7. Użytkownik wybiera poziom (np. Swiadek za 25€).
8. Stripe Checkout — gotowy, bezpieczny formularz: karty, Apple Pay, Google Pay.
9. Stripe wysyła webhook do Vercel Serverless Function.
10. Funkcja weryfikuje sygnaturę HMAC webhooka.
11. Tworzy wiersz w user_project_access z expires_at = NULL.
12. Użytkownik ma dostęp natychmiast i na zawsze.

6.2. Subskrypcja — opcjonalna ścieżka
Subskrypcja nie nadpisuje tier_level konta — daje osobne perki subskrypcyjne. Po anulowaniu użytkownik traci perki, ale pozostaje na swoim permanentnym poziomie.
Stripe Billing — automatyczne odnawianie
Stripe Customer Portal — użytkownik sam zarządza bez kontaktu z Tobą
Webhook payment_failed — status past_due, perki zawieszone
Webhook customer.subscription.deleted — perki usunięte, konto nienaruszone

6.3. Ograniczone miejsca (Architekt)
Poziom Architekt ma pole max_slots i slots_taken. Przed wyświetleniem przycisku kupna, aplikacja sprawdza slots_taken < max_slots. Jeśli miejsca są pełne — przycisk nieaktywny z komunikatem Lista pełna.

7. System Autentykacji — Clerk
Metoda
Opis
Magic Link
Email → link → klik → zalogowany. Bez hasła.
Google Login
Jedno kliknięcie
Apple Login
Dla użytkowników iPhone / iPad
2FA
Opcjonalne dla kont o wysokim poziomie

Clerk integruje się bezpośrednio z Vercel Edge Middleware. Rola i tier_level użytkownika są zakodowane w JWT — weryfikacja bez zapytań do bazy przy każdym request.

8. Doświadczenie Użytkownika
8.1. Ścieżka konwersji
13. Użytkownik trafia na stronę (organicznie, z udostępnienia).
14. Czyta wciągającą publiczną narrację.
15. Napotyka elegancki paywall jako część opowieści.
16. Rejestruje się za darmo — dostaje próbkę poziomu 1.
17. Klika Zostań Obserwatorem — panel Stripe, Apple Pay w sekundy.
18. Dostęp odblokowany natychmiast i na zawsze.
19. Może upgrade do Swiadka/Insidera/Architekta w dowolnym momencie.

8.2. Elementy psychologiczne
Story-driven paywall: paywall jako część narracji, nie blokada
Darmowa próbka poziomu 1: zmniejsza barierę pierwszego kroku
Licznik postXpu zbiórki: pasek ile zebrano — presja społeczna
Lista wspierających z kwotami: social proof
Countdown timer: presja czasowa
Limitowane miejsca dla Architekta: efekt niedoboru
Viral share: udostępniony link pokazuje teaser + paywall
Narracyjne nazwy poziomów: Architekt brzmi lepiej niż Pakiet VIP

9. Identyfikacja Wizualna
Element
Wartość
Tło główne
#FDFBF7 — delikatny krem
Tekst główny
#1A1A1A — ciemny grafit
Rodzina czcionek
Szeryfowa (font-serif) — estetyka magazynu
Rozmiar treści
prose-lg
Interlinia
leading-relaxed
Styl
Minimalizm premium — reportaż, dziennikarstwo śledcze

10. Bezpieczeństwo
Zagrożenie
Zabezpieczenie
Dostęp do treści bez uprawnień
Edge Middleware + Server Components — treść nie istnieje w HTML
Kradzież plików premium
Podpisane URL-e Vercel Blob z czasem wygaśania
Fałszywe webhooki Stripe
Weryfikacja sygnatury HMAC przy każdym evencie
Przełączenie konta
2FA przez Clerk, Magic Links zamiast haseł
Ataki DDoS
Vercel Edge Network z wbudowaną ochroną
SQL Injection
Parametryzowane zapytania Neon/Prisma
Indeksowanie przed launchemm
X-Robots-Tag: noindex na wszystkich odpowiedziach

11. Fazy Wdrożenia
Faza 1 — MVP
20. Next.js + Vercel + Neon Postgres + Clerk
21. noindex globalny
22. Strona publiczna projektu z historią i teaserami
23. Pięć poziomów dostępu w pełni działających
24. Stripe — jednorazowe wpłaty dla poziomów 2–5
25. Edge Middleware — ochrona chronionych stron
26. Vercel Blob — pliki premium
27. Ty jako jedyny admin z projektami

Faza 2 — Konwersja i wzrost
28. Subskrypcja jako opcjonalna ścieżka perkowa
29. Lista wspierających, countdown, stretch goals
30. Resend — emaile transakcyjne
31. OneSignal — push notifications
32. Viral share
33. Ograniczone miejsca dla Architekta

Faza 3 — Otwarta platforma
34. Panel twcórcy (wniosek o konto, zatwierdzenie przez admina)
35. Moderatorzy — panel moderacji
36. Stripe Connect — wielotwcórcowy model płatności
37. Usunięcie noindex — launch publiczny
38. Wielojęzyczność i multi-currency

12. Podsumowanie
Kraufanding to pełnoprawna, niezależna platforma z pięcioma poziomami wtajemniczenia, modelem permanentnego dostępu i opcjonalną subskrypcją. Oparta na Vercel/Next.js/Neon/Clerk/Stripe, gotowa na wzrost od MVP do platformy wielotwcórczej bez migracji architektury.

Pięć poziomów: Niezalogowany → Zalogowany → Obserwator → Swiadek → Insider → Architekt
Permanentny dostęp — jednorazowa wpłata, nigdy nie wygasa
Subskrypcja opcjonalna — perki, nie blokada
Cztery role systemowe: admin, moderator, creator, user
noindex do czasu launchu
Pełna własność — baza użytkowników, płatności, treści

— Koniec specyfikacji v2.0 —

## Project Vision
POLUTEK.PL is a community-driven initiative that provides supporters with exclusive, behind-the-scenes content (videos, graphics, and updates) hosted securely on **Vercel Blob**. Using **Clerk Authentication**, we manage a two-tier access system:
- **Public**: Basic project information and funding progress.
- **Patrons**: Signed-in supporters gain access to restricted materials and premium updates.

## Key Features
- **Modern Authentication**: Powered by [Clerk](https://clerk.com/) with support for Social (Google) and Magic Link logins.
- **Secure Storage**: Premium content is managed through [Vercel Blob](https://vercel.com/docs/storage/vercel-blob).
- **Responsive UI**: Built with a custom "polutek" DaisyUI theme on a `#FDFBF7` (Cream) background with `#1a1a1a` (Charcoal) serif typography.
- **Interactive Funding**: Real-time progress bar and reward selection tiers.
- **Content Gating**: Built-in paywall and conditional rendering for restricted content.

## Technology Stack
- **Framework**: [Next.js 14 (App Router)](https://nextjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [DaisyUI](https://daisyui.com/)
- **Authentication**: [Clerk](https://clerk.com/)
- **Database**: [Postgres (Neon)](https://neon.tech/)
- **Storage**: [Vercel Blob](https://vercel.com/docs/storage/vercel-blob)
- **Deployment**: [Vercel](https://vercel.com/)

## Getting Started

### Prerequisites
- Node.js 18+
- A Neon account (Postgres)
- A Clerk project
- A Vercel Blob store

### Environment Setup
Create a `.env.local` file in the root directory and add the following:

```env
# Clerk Keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
CLERK_SECRET_KEY=your_secret_key

# Vercel Blob
BLOB_READ_WRITE_TOKEN=your_blob_token

# Database (Neon)
DATABASE_URL="postgresql://user:pass@ep-host.aws.neon.tech/neondb?sslmode=require"
```

### Installation
```bash
npm install
npm run dev
```

## Development
This project follows the Next.js App Router architecture. Key components and logic are located in the `app/` directory.

- `app/layout.tsx`: Global configuration and Clerk provider.
- `app/page.tsx`: Main landing page with content gating.
- `middleware.ts`: Clerk route protection.
- `tailwind.config.ts`: Custom theme and color definitions.
