import React from 'react';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';

export default function RegulaminPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1a1a1a] font-serif">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-24">
        <h1 className="text-5xl font-black uppercase tracking-tighter mb-12 border-b-4 border-double border-[#1a1a1a]/10 pb-8">Regulamin</h1>
        <div className="prose prose-lg prose-neutral italic leading-relaxed opacity-70">
          <p>Witaj w regulaminie polutek.pl. To jest prowizoryczna treść regulaminu.</p>
          <h2>1. Postanowienia ogólne</h2>
          <p>Serwis polutek.pl służy do wspierania tajnych projektów.</p>
          <h2>2. Zasady korzystania</h2>
          <p>Użytkownik zobowiązuje się do zachowania poufności w zakresie materiałów operacyjnych.</p>
          <h2>3. Płatności</h2>
          <p>Wszystkie wpłaty (napiwki) są dobrowolne i wspierają twórców projektów.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
