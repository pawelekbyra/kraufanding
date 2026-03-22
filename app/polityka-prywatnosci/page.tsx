import React from 'react';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';

export default function PolitykaPrywatnosciPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1a1a1a] font-serif">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-24">
        <h1 className="text-5xl font-black uppercase tracking-tighter mb-12 border-b-4 border-double border-[#1a1a1a]/10 pb-8">Polityka Prywatności</h1>
        <div className="prose prose-lg prose-neutral italic leading-relaxed opacity-70">
          <p>Witaj w polityce prywatności polutek.pl. To jest prowizoryczna treść.</p>
          <h2>Ochrona Danych</h2>
          <p>Twoje dane są u nas bezpieczne i chronione zgodnie z najwyższymi standardami poufności materiałów operacyjnych.</p>
          <p>Korzystamy z Clerk do uwierzytelniania oraz Stripe do obsługi bezpiecznych płatności.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
