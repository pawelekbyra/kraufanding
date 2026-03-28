'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'pl' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  isInitialized: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en'); // Default to English
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeLanguage = async () => {
      // 1. Check local storage
      const savedLang = localStorage.getItem('app-language') as Language;
      if (savedLang && (savedLang === 'pl' || savedLang === 'en')) {
        setLanguageState(savedLang);
        setIsInitialized(true);
        return;
      }

      // 2. Browser detection if no local preference
      if (typeof window !== 'undefined' && window.navigator) {
        const browserLang = window.navigator.language.toLowerCase();
        if (browserLang.startsWith('pl')) {
          setLanguageState('pl');
        }
      }
      setIsInitialized(true);
    };

    initializeLanguage();
  }, []);

  const setLanguage = async (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('app-language', lang);

    // Sync with database if user is logged in
    try {
      await fetch('/api/user/language', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language: lang })
      });
    } catch (e) {
      console.warn('[LanguageContext] Failed to sync language with DB:', e);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, isInitialized }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const translations = {
  pl: {
    views: 'wyświetleń',
    showMore: '...więcej',
    showLess: 'Pokaż mniej',
    subscribe: 'Subskrajb',
    subscribed: 'Subskrajbd',
    subscribers: 'subskrypcji',
    share: 'Szeruj',
    noDate: 'Świeża sprawa',
    comments: 'Komentarze',
    replying: 'Wchodzisz w dyskusję',
    addComment: 'Zostaw ślad...',
    addReply: 'Odpowiedź...',
    cancel: 'Odpuść',
    comment: 'Wyślij',
    reply: 'Odpowiedz',
    signIn: 'WEJŚCIE',
    deleteComment: 'Wyciąć?',
    showAll: 'Wróć',
    justNow: 'przed chwilą',
    noDescription: 'Cisza w eterze.',
    support: 'Mecenat',
    materials: 'Zasoby',
    donate: 'Bramka Napiwkowa',
    available: 'Odblokowane',
    loginToWatch: 'Pokaż dowód (zaloguj się)',
    loginReq: 'Logowanie',
    patronOnly: 'Dla Patronów',
    becomePatron: 'Zostań Patronem',
    topSecret: 'Ściśle Tajne',
    paywallText: 'Strefa',
    paywallAction: 'zalogowanych',
    supportArtist: 'Wspieraj POLUTEK.PL',
    loginToWatchShort: 'Zaloguj się',
    independencyTitle: 'Nie masz psychy się zalogować',
    independencyTitleLoggedIn: 'WITAJ NA POLUTEK.PL',
    patronZone: 'Strefa Patronów',
    currency: 'PLN',
    loginGatedText: 'Zaloguj się, aby obczaić',
    donationDescription: 'Wpłaty od widzów pomagają rozwijać projekt i tworzyć kolejne materiały. W podziękowaniu za napiwek zapraszam do Strefy Patronów.',
    paywallUnlock: 'Wyślij napiwek, aby dołączyć',
    noMoney: 'Nie mam hajsu',
    noMoneyTitle: 'NIE MASZ HAJSU?',
    noMoneySub: 'Ja też nie, dlatego kombinuję. Ty też kombinuj: zamiast napiwkować poleć stronę 5 znajomym i zdobądź w nagrodę dostęp do Strefy Patronów.',
    noMoneyHowTitle: 'O co w tym chodzi?',
    noMoneyHowText: 'Zasada jest prosta: Jeśli dzięki Twojemu poleceniu zarejestruje się u nas 5 nowych osób, system automatycznie przyzna Ci wejściówkę do Strefy Patronów.',
    noMoneyStepTitle: 'Jak to zrobić?',
    noMoneyStep1: 'Skopiuj swój link: Znajdziesz go na dole tego okna.',
    noMoneyStep2: 'Podaj dalej: Wyślij go znajomym na Discordzie, Messengerze albo wrzuć na jakąś grupę.',
    noMoneyStep3: 'Dopilnuj rejestracji: Ważne, żeby te osoby nie tylko weszły na stronę, ale faktycznie założyły konto (przez e-mail lub Google). Tylko wtedy licznik przeskoczy.',
    noMoneyStep4: 'Ciesz się dostępem: Gdy piąta osoba potwierdzi swoje konto, Strefa Patronów odblokuje się dla Ciebie na stałe.',
    noMoneyLinkLabel: 'Twój unikalny link do polecania:',
    noMoneyCopy: 'SKOPIUJ LINK DO SCHOWKA',
    noMoneyProgress: 'Twoja ekipa (Postęp):',
    noMoneyMissing: 'Brakuje Ci jeszcze {count} osób, by zgarnąć bonus!',
    noMoneyFinePrintTitle: 'Rzetelne info (czyli mały druczek bez ściemy):',
    noMoneyFinePrint1: 'Rejestracja to podstawa: System liczy tylko osoby, które kliknęły w Twój link i przeszły proces logowania/rejestracji przez Clerk.',
    noMoneyFinePrint2: 'Bądź cierpliwy: Czasami licznik potrzebuje minuty lub dwóch, żeby się zaktualizować po tym, jak Twój ziomek założy konto.',
    noMoneyThanks: 'Dzięki, że pomagasz mi budować to miejsce!',
    confirmSubscribeTitle: 'CZY CHCESZ SUBSKRYBOWAĆ?',
    confirmSubscribeText: 'Subskrypcja oznacza zgodę na otrzymywanie powiadomień mailowych o nowościach.',
    yes: 'TAK',
    no: 'NIE'
  },
  en: {
    views: 'views',
    showMore: '...more',
    showLess: 'Show less',
    subscribe: 'Subscribe',
    subscribed: 'Subscribed',
    subscribers: 'subscribers',
    share: 'Share',
    noDate: 'No date',
    comments: 'Comments',
    replying: 'Replying',
    addComment: 'Add a comment...',
    addReply: 'Add a reply...',
    cancel: 'Cancel',
    comment: 'Comment',
    reply: 'Reply',
    signIn: 'ENTER',
    deleteComment: 'Delete comment?',
    showAll: 'Show all',
    justNow: 'just now',
    noDescription: 'No description provided.',
    support: 'Support',
    materials: 'Content',
    donate: 'Support Creator',
    available: 'Available',
    loginToWatch: 'Log in to watch',
    loginReq: 'Login Req',
    patronOnly: 'Patron Only',
    becomePatron: 'Become a Patron',
    topSecret: 'TOP SECRET',
    paywallText: 'Logged in',
    paywallAction: 'zone',
    supportArtist: 'Support POLUTEK.PL',
    loginToWatchShort: 'Log in',
    independencyTitle: "You don't have the guts to log in",
    independencyTitleLoggedIn: 'WELCOME TO POLUTEK.PL',
    patronZone: "Patrons' Zone",
    currency: 'USD',
    loginGatedText: 'Log in to discover additional content',
    donationDescription: "A tip will unlock access to the Patrons' Zone. Support helps in the development of the project.",
    paywallUnlock: 'Send a tip to join',
    noMoney: "I don't have the cash",
    noMoneyTitle: 'NO CASH?',
    noMoneySub: "Me neither, that's why I'm hustling. You hustle too: instead of tipping, refer 5 friends and gain access to the Patrons' Zone as a reward.",
    noMoneyHowTitle: "What's this about?",
    noMoneyHowText: "The rule is simple: if 5 new people register through your referral, the system will automatically grant you access to the Patrons' Zone.",
    noMoneyStepTitle: 'How to do it?',
    noMoneyStep1: 'Copy your link: You can find it at the bottom of this window.',
    noMoneyStep2: 'Pass it on: Send it to friends on Discord, Messenger, or post it in a group.',
    noMoneyStep3: 'Ensure registration: It is important that these people not only visit the site but actually create an account (via email or Google). Only then will the counter increase.',
    noMoneyStep4: "Enjoy access: Once the fifth person confirms their account, the Patrons' Zone will unlock for you permanently.",
    noMoneyLinkLabel: 'Your unique referral link:',
    noMoneyCopy: 'COPY LINK TO CLIPBOARD',
    noMoneyProgress: 'Your crew (Progress):',
    noMoneyMissing: 'You still need {count} more people to get the bonus!',
    noMoneyFinePrintTitle: 'Honest info (no-nonsense fine print):',
    noMoneyFinePrint1: 'Registration is key: The system only counts people who clicked your link and completed the sign-up process via Clerk.',
    noMoneyFinePrint2: 'Be patient: Sometimes the counter needs a minute or two to update after your friend creates an account.',
    noMoneyThanks: 'Thanks for helping me build this place!',
    confirmSubscribeTitle: 'DO YOU WANT TO SUBSCRIBE?',
    confirmSubscribeText: 'Subscribing means you agree to receive email notifications about news.',
    yes: 'YES',
    no: 'NO'
  }
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return {
    ...context,
    t: translations[context.language]
  };
};
