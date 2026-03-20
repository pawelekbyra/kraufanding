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

              <div className="card bg-base-100/40 backdrop-blur-md border border-white/10 shadow-2xl p-8 space-y-6">
                <h3 className="card-title text-xl font-black text-base-content">O Autorze</h3>
                <div className="flex items-center gap-4">
                  <div className="avatar placeholder">
                    <div className="bg-primary text-primary-content rounded-full w-14 h-14">
                      <span className="text-xl font-black">IP</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-black text-base-content text-lg">{campaign.author}</h4>
                    <p className="text-xs text-base-content/50 font-bold uppercase tracking-widest">12 zrealizowanych projektów</p>
                  </div>
                </div>
                <p className="text-base-content/70 text-sm font-medium leading-relaxed">
                  Jesteśmy grupą inżynierów i projektantów, których misją jest tworzenie technologii jutra dostępnej już dziś.
                </p>
                <button className="btn btn-outline btn-block rounded-xl font-black">
                  Kontakt z Autorem
                </button>
              </div>
            </aside>

          </div>
        </div>

        {/* FAQ Section */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-t border-base-200">
          <h2 className="text-3xl font-black text-base-content text-center mb-16">Często Zadawane Pytania</h2>
          <div className="space-y-4">
            {[
              { q: "Kiedy otrzymam swój produkt?", a: "Pierwsze wysyłki planowane są na początek 2025 roku." },
              { q: "Czy wysyłka jest darmowa?", a: "Tak, dla wszystkich wspierających na poziomie 'Wczesny Ptak' i wyższym." },
              { q: "Czy mogę zrezygnować ze wsparcia?", a: "Możesz zrezygnować w dowolnym momencie przed zakończeniem kampanii." }
            ].map((faq, i) => (
              <div key={i} className="collapse collapse-plus bg-base-100/20 backdrop-blur-sm border border-white/5">
                <input type="radio" name="my-accordion-3" defaultChecked={i === 0} />
                <div className="collapse-title text-xl font-black">
                  {faq.q}
                </div>
                <div className="collapse-content">
                  <p className="text-base-content/70 font-medium">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
