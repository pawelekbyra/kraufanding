import React from 'react';

const StartCampaignCTA = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="relative overflow-hidden rounded-3xl bg-indigo-600 px-6 py-20 text-center shadow-2xl shadow-indigo-500/20 sm:px-12 lg:px-16">
        <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-30">
          <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-white/20 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-0 left-0 w-[30%] h-[30%] bg-blue-400/20 rounded-full blur-[100px]"></div>
        </div>

        <h2 className="mx-auto max-w-2xl text-3xl font-black tracking-tight text-white sm:text-5xl">
          Masz Wielki Pomysł? <br />
          Zacznij Już Dzisiaj.
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-indigo-100 font-medium">
          Dołącz do tysięcy twórców, którzy zrealizowali swoje marzenia dzięki naszej społeczności.
          Zapewniamy narzędzia, których potrzebujesz, aby odnieść sukces.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <button className="rounded-xl bg-white px-8 py-4 text-sm font-black text-indigo-600 shadow-sm hover:scale-105 transition-all">
            Rozpocznij Zbiórkę
          </button>
          <button className="text-sm font-bold leading-6 text-white hover:underline transition-all">
            Dowiedz się więcej <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default StartCampaignCTA;
