import React from 'react';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';

export default function PolitykaPrywatnosciPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1a1a1a] font-serif">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-24">
        <h1 className="text-5xl font-black uppercase tracking-tighter mb-12 border-b-4 border-double border-[#1a1a1a]/10 pb-8">Polityka Prywatności</h1>
        <div className="prose prose-lg prose-neutral italic leading-relaxed opacity-70 space-y-8">
          <section>
            <h2 className="text-2xl font-black uppercase tracking-tight text-[#1a1a1a] opacity-100">1. Dane osobowe i logowanie</h2>
            <p>
              Dla bezpieczeństwa i wygody użytkowników, polutek.pl korzysta z zewnętrznego systemu uwierzytelniania <strong>Clerk</strong>.
              Clerk zarządza procesem rejestracji, logowania oraz danymi profilowymi użytkowników. Rejestrując się, zgadzasz się na
              przetwarzanie danych przez tę platformę zgodnie z jej polityką prywatności.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black uppercase tracking-tight text-[#1a1a1a] opacity-100">2. Płatności i bezpieczeństwo finansowe</h2>
            <p>
              Wszystkie operacje finansowe (darowizny, napiwki) są procesowane wyłącznie przez <strong>Stripe</strong> – światowego lidera
              bezpiecznych płatności online. polutek.pl nie przechowuje ani nie ma bezpośredniego dostępu do danych kart płatniczych
              ani innych poufnych informacji bankowych. Stripe gwarantuje najwyższy poziom bezpieczeństwa transakcji.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black uppercase tracking-tight text-[#1a1a1a] opacity-100">3. Przetwarzanie i wykorzystanie danych</h2>
            <p>
              Twoje dane są wykorzystywane wyłącznie w celu zapewnienia prawidłowego funkcjonowania serwisu, personalizacji dostępu
              do materiałów &quot;premium&quot; oraz ewentualnego kontaktu w sprawach technicznych. Nigdy nie udostępniamy Twoich danych osobom trzecim
              poza wymienionymi dostawcami technologicznymi (Clerk i Stripe).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black uppercase tracking-tight text-[#1a1a1a] opacity-100">4. Pliki Cookies</h2>
            <p>
              Strona polutek.pl wykorzystuje niezbędne pliki cookies do utrzymania sesji użytkownika oraz zapewnienia bezpieczeństwa.
              Wykorzystujemy je również do analizy ruchu, aby stale ulepszać nasz serwis.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black uppercase tracking-tight text-[#1a1a1a] opacity-100">5. Kontakt</h2>
            <p>
              W sprawach dotyczących Twoich danych osobowych, możesz kontaktować się bezpośrednio z twórcą serwisu,
              <strong>Pawła Polutka</strong>, pod adresem email: pawel.perfect@protonmail.com.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
