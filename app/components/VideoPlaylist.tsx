"use client";

import React, { useState } from 'react';
import { useAuth, useClerk } from '@clerk/nextjs';

interface VideoPlaylistProps {
  projectId: string;
}

const VideoPlaylist: React.FC<VideoPlaylistProps> = ({ projectId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState(10);
  const { userId } = useAuth();
  const { openSignIn } = useClerk();

  const onSupport = async () => {
    if (!userId) {
      openSignIn();
      return;
    }

    if (amount < 10) {
      alert("Minimalna kwota wsparcia to 10 €");
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch('/api/checkout', {
        method: 'POST',
        body: JSON.stringify({
          amount: amount,
          projectId: projectId,
          tierLevel: 2, // Patron level
          title: "Zostaw Napiwek / Patron"
        }),
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();

      if (data.url) {
        window.location.assign(data.url);
      }
    } catch (error) {
      console.error("Payment error", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4 font-sans px-2" id="donations">
        <div
          className="bg-gradient-to-br from-white to-cream border border-neutral/10 rounded-[2.5rem] p-8 shadow-sm hover:shadow-glow hover:border-primary/20 transition-all duration-700 group relative overflow-hidden"
        >
          <div className="space-y-6 relative z-10">
            <div className="space-y-2">
              <h3 className="text-3xl font-serif font-black text-neutral tracking-tight uppercase group-hover:text-primary transition-colors">
                Zostaw Napiwek
              </h3>
              <p className="text-muted text-sm leading-relaxed max-w-[240px]">
                Wpłać dowolną kwotę i uzyskaj dożywotni dostęp do treści dla Patronów.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <label className="block text-[10px] font-bold uppercase tracking-[0.25em] text-neutral/40">
                Kwota wsparcia (min. 10 €)
              </label>
              <div className="relative group/input">
                <div className="absolute inset-y-0 left-0 pl-1 flex items-center pointer-events-none">
                  <span className="text-2xl font-serif font-black text-neutral/10 group-focus-within/input:text-primary/30 transition-colors">€</span>
                </div>
                <input
                  type="number"
                  min="10"
                  step="1"
                  value={amount}
                  onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
                  className="w-full bg-transparent border-b-2 border-neutral/10 py-4 pl-8 pr-4 font-serif font-black text-4xl text-neutral focus:border-primary outline-none transition-all"
                />
              </div>
              {amount < 10 && (
                <p className="text-error text-[9px] font-bold uppercase tracking-widest animate-pulse">Minimalna kwota to 10 €</p>
              )}
            </div>

            <button
              onClick={onSupport}
              disabled={isLoading || amount < 10}
              className={`btn h-14 bg-neutral text-cream hover:bg-primary border-none btn-block rounded-2xl font-bold tracking-[0.2em] transition-all duration-500 shadow-xl hover:shadow-primary/20 ${isLoading ? 'loading' : ''} ${amount < 10 ? 'opacity-30 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'ŁADOWANIE...' : 'WESPRZYJ PROJEKT'}
            </button>
          </div>

          {/* Artistic background element */}
          <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-700"></div>
        </div>
    </div>
  );
};

export default VideoPlaylist;
