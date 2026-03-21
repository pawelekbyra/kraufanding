# KRAUFANDING
### Platforma hybrydowa: Crowdfunding + Subskrypcje + Premium Content
**Specyfikacja Techniczna i Produktowa — wersja 2.0**

## 1. Koncepcja i Cel Projektu
Kraufanding to własna platforma hybrydowa łącząca trzy modele: klasyczny crowdfunding zbiórek, sprzedaż permanentnego dostępu do treści oraz opcjonalne subskrypcje patronackie. Platforma buduje lejek konwersji oparty na narracji i ciekawości — publiczna historia przyciąga użytkowników, ukryte materiały wywołują chęć dostępu, a system poziomów wtajemniczenia nagradza zaangażowanie.

### Kluczowa przewaga
Wszystko jest Twoje: baza użytkowników, płatności, zasady publikacji. Żadnych algorytmów zasięgu, żadnej prowizji platformy (poza standardowymi opłatami Stripe), żadnego ryzyka blokady konta.

### 1.1. Model działania — lejek konwersji
1. **Publiczna historia** przyciąga użytkownika organicznie.
2. Użytkownik czyta wciągającą narrację i napotyka fragmenty **ukrytych materiałów**.
3. **Rejestracja za darmo** daje małą próbkę — Twój email ląduje w bazie.
4. **Jakakolwiek wpłata** permanentnie odblokowuje dostęp do poziomu 2 (Obserwator).
5. Wyższe jednorazowe wpłaty odblokują poziomy 3, 4, 5 na zawsze.
6. **Subskrypcja** jest opcjonalna — daje dodatkowe perki lub wcześniejszy dostęp.

**Zasada konta:** Wpłata to upgrade konta, nie subskrypcja. Konto nigdy nie traci raz zdobytego poziomu — jednorazowa wpłata = permanentny dostęp. Subskrypcja to osobna, opcjonalna ścieżka.

## 2. Pięć Poziomów Wtajemniczenia
Platforma wykorzystuje pięć poziomów dostępu opartych na narracyjnych nazwach spójnych z filozofią projektu. Każdy wyższy poziom zawiera wszystko z niższych (model kumulatywny).

| Poziom | Nazwa | Co otrzymuje / warunek dostępu |
| :--- | :--- | :--- |
| **0** | **Niezalogowany** | Widzi publiczną historię, teaser i paywall. Brak konta. |
| **1** | **Zalogowany** | Darmowa rejestracja przez Clerka. Mała próbka premium. Email w Twojej bazie. |
| **2** | **Obserwator** | Jakakolwiek minimalna wpłata jednorazowa. Permanentny dostęp do core contentu. |
| **3** | **Świadek** | Wyższa wpłata jednorazowa. Pogłębione materiały + wcześniejszy dostęp. |
| **4** | **Insider** | Jeszcze wyższa wpłata jednorazowa. Ekskluzywne materiały + kontakt bezpośredni / Q&A. |
| **5** | **Architekt** | Najwyższa wpłata jednorazowa. Pełny dostęp + fizyczne nagrody / podziękowania. |

### 2.1. Szczegóły każdego poziomu
- **Poziom 0 — Niezalogowany:** Widzi publiczną historię projektu, teaser fragmentów premium i paywall jako część opowieści.
- **Poziom 1 — Zalogowany (darmowy):** Rejestracja przez Clerka (Magic Link, Google). Otrzymuje małą, darmową próbkę sekretnego kontentu (np. 1 zdjęcie).
- **Poziom 2 — Obserwator (pierwsza wpłata):** Jakakolwiek minimalna wpłata (np. od 5€). Dostęp permanentny do core contentu i galerii bazowej.
- **Poziom 3 — Świadek:** Wyższa jednorazowa wpłata (np. od 25€). Dostęp permanentny do pogłębionych materiałów dowodowych i early access do nowych postów.
- **Poziom 4 — Insider:** Wyższa jednorazowa wpłata (np. od 75€). Ekskluzywne materiały i dostęp do zamkniętych sesji Q&A.
- **Poziom 5 — Architekt:** Najwyższa jednorazowa wpłata (np. od 200€). Pełny dostęp i fizyczne nagrody (imienne listy, paczki). Ograniczona liczba miejsc.

### 2.2. Subskrypcja jako opcja
Subskrypcja daje dodatkowe perki (wcześniejszy dostęp, live sesje, newsletter) w ramach już posiadanego poziomu. Anulowanie subskrypcji odbiera perki, ale konto nigdy nie spada na niższy poziom.

## 3. Typy Użytkowników i Role
- **admin:** Pełna kontrola nad platformą i finansami.
- **moderator:** Moderowanie treści i komentarzy.
- **creator:** Własny panel twórcy, tworzenie projektów i publikacja postów.
- **user:** Czytanie, płacenie, komentowanie (domyślna rola).

## 4. Architektura Techniczna
- **Framework:** Next.js 14 (App Router + Server Components)
- **Autentykacja:** Clerk — logowanie, rejestracja, role w JWT
- **Płatności:** Stripe — jednorazowe wpłaty + opcjonalne subskrypcje
- **Baza danych:** Neon Postgres (natywna integracja Vercel) + Prisma ORM
- **Storage:** Vercel Blob — premium media assety
- **Edge Network:** Vercel Edge Middleware — błyskawiczna weryfikacja sesji i paywall na brzegu sieci

## 5. Bezpieczeństwo — Trzy Warstwy
1. **Edge Middleware:** Sprawdza sesję Clerka i tier_level przed serwerem. Jeśli brak dostępu — paywall natychmiast.
2. **Server Components:** Treść generowana wyłącznie na serwerze. Niezalogowany nie widzi ukrytej treści w HTML.
3. **Vercel Blob — Podpisane URL-e:** Pliki premium serwowane przez czasowe, unikalne dla sesji linki.

## 6. Fazy Wdrożenia
- **Faza 1 — MVP:** Next.js + Neon + Clerk + Stripe (one-time) + Vercel Blob + Edge Middleware.
- **Faza 2 — Konwersja:** Subskrypcje, lista wspierających, countdown, Resend emails.
- **Faza 3 — Otwarta platforma:** Panel twórcy, moderatorzy, Stripe Connect.

---
**Specyfikacja v2.0 — Crowdfunding + Subscriptions + Premium Content**
