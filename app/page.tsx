import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Stats from './components/Stats';
import ProjectTabs from './components/ProjectTabs';
import Rewards from './components/Rewards';
import Footer from './components/Footer';
import { mockCampaigns } from './data/mock-campaigns';

export default function Home() {
  const campaign = mockCampaigns.find(c => c.id === 'secret-project') || mockCampaigns[0];

  return (
    <div className="min-h-screen">
      <Navbar />

      <main>
        <Hero campaign={campaign} />
        <Stats />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">

            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-12">
              <section id="story">
                <ProjectTabs campaign={campaign} />
              </section>
            </div>

            {/* Sidebar */}
            <aside className="space-y-8 lg:sticky lg:top-28">
              <section id="rewards">
                <Rewards rewards={campaign.rewards || []} />
              </section>

              <div className="glass-card p-8 rounded-3xl border-white/5 space-y-6">
                <h3 className="text-xl font-bold text-white">O Autorze</h3>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-xl font-black">
                    IP
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-lg">{campaign.author}</h4>
                    <p className="text-sm text-gray-500 font-medium">12 zrealizowanych projektów</p>
                  </div>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Jesteśmy grupą inżynierów i projektantów, których misją jest tworzenie technologii jutra dostępnej już dziś.
                </p>
                <button className="w-full py-3 bg-white/5 hover:bg-white/10 text-white font-bold text-sm rounded-xl border border-white/10 transition-all">
                  Kontakt z Autorem
                </button>
              </div>
            </aside>

          </div>
        </div>

        {/* FAQ Section - although not in initial tabs, it's good practice for landing pages */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-t border-white/5">
          <h2 className="text-3xl font-black text-white text-center mb-16">Często Zadawane Pytania</h2>
          <div className="space-y-6">
            {[
              { q: "Kiedy otrzymam swój produkt?", a: "Pierwsze wysyłki planowane są na początek 2025 roku." },
              { q: "Czy wysyłka jest darmowa?", a: "Tak, dla wszystkich wspierających na poziomie 'Wczesny Ptak' i wyższym." },
              { q: "Czy mogę zrezygnować ze wsparcia?", a: "Możesz zrezygnować w dowolnym momencie przed zakończeniem kampanii." }
            ].map((faq, i) => (
              <div key={i} className="glass-card p-6 rounded-2xl border-white/5">
                <h4 className="font-bold text-white mb-2">{faq.q}</h4>
                <p className="text-gray-400 text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
