import React from 'react';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import Link from 'next/link';

export default function RegulaminPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1a1a1a] font-serif">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-24">
        <h1 className="text-4xl font-black uppercase tracking-tighter mb-12 border-b-2 border-[#1a1a1a]/10 pb-8">Regulamin Serwisu</h1>
        <div className="prose prose-lg prose-neutral leading-relaxed space-y-8">
          <section>
            <h2 className="text-xl font-black uppercase tracking-tight text-[#1a1a1a]">1. Postanowienia ogólne</h2>
            <p>
              Serwis polutek.pl jest prywatną platformą służącą do zbierania środków przez twórcę serwisu, <strong>Pawła Polutka</strong>.
              Korzystanie z serwisu i dokonywanie jakichkolwiek wpłat jest równoznaczne z akceptacją niniejszego regulaminu.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black uppercase tracking-tight text-[#1a1a1a]">2. Charakter wpłat</h2>
            <p>
              Wszelkie wpłaty dokonywane w serwisie (określane jako &quot;Napiwki&quot; lub &quot;Wsparcie&quot;) mają charakter <strong>dobrowolnej darowizny</strong> na rzecz twórcy.
              Wpłata nie jest zapłatą za usługę ani produkt. Użytkownik nie &quot;kupuje&quot; dostępu, lecz dobrowolnie wspiera działalność twórcy,
              który w ramach podziękowania może (lecz nie musi) udostępnić określone materiały cyfrowe.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black uppercase tracking-tight text-[#1a1a1a]">3. Zrzutki i &quot;Secret Project&quot;</h2>
            <p>
              W przypadku kampanii określanych jako &quot;Secret Project&quot; lub podobnych, użytkownik przyjmuje do wiadomości, że <strong>cel zrzutki może nie być w pełni jawny</strong>.
              Dokonując wpłaty, wspierający akceptuje ryzyko związane z brakiem pełnej wiedzy na temat przeznaczenia środków i specyfiki projektu.
              Twórca serwisu nie ponosi żadnej odpowiedzialności za oczekiwania wspierającego względem efektów tych projektów.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black uppercase tracking-tight text-[#1a1a1a]">4. Brak odpowiedzialności i zwrotów</h2>
            <p>
              Z uwagi na darowiznowy charakter wpłat, nie podlegają one zwrotowi. Twórca nie gwarantuje żadnych konkretnych rezultatów działań podejmowanych
              w ramach wspieranych projektów. Wspierasz na własną odpowiedzialność.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black uppercase tracking-tight text-[#1a1a1a]">5. Zmiany regulaminu</h2>
            <p>
              Paweł Polutek zastrzega sobie prawo do zmiany niniejszego regulaminu w dowolnym momencie. Aktualna wersja regulaminu jest zawsze dostępna na tej stronie.
            </p>
          </section>
        </div>

        <div className="mt-24 pt-12 border-t border-[#1a1a1a]/5">
           <Link href="/" className="group flex items-center gap-3 text-sm font-black uppercase tracking-widest hover:text-primary transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4 transition-transform group-hover:-translate-x-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
              </svg>
              Wróć do strony głównej
           </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
