"use client";

import React, { useState } from 'react';
import { useAuth, useClerk } from '@clerk/nextjs';
import { createCheckoutSession } from '@/lib/actions/checkout';

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

      const data = await createCheckoutSession({
        amount: amount,
        projectId: projectId,
        tierLevel: 2, // Patron level
        title: "Tip The Guy / Patron"
      });

      if (data?.url) {
        window.location.assign(data.url);
      } else if (data?.error) {
        alert("Błąd: " + data.error);
      } else {
        alert("Błąd: Nie udało się utworzyć sesji płatności.");
      }
    } catch (error: any) {
      console.error("Payment error", error);
      alert("Wystąpił błąd podczas procesowania płatności: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4 font-serif px-2" id="donations">
        <div
          className="bg-white border-2 border-black rounded-sm p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-500 group relative overflow-hidden"
        >
          <div className="space-y-4 relative z-10">
            <div className="space-y-1">
              <h3 className="text-xl font-black text-[#1a1a1a] tracking-tight uppercase group-hover:text-primary transition-colors font-mono">
                Tip The Guy
              </h3>
              <p className="text-[#1a1a1a]/60 text-xs leading-relaxed font-mono italic">
                Donate any amount and get lifetime access to Patron-only content.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-[#1a1a1a]/40 font-mono">
                Support amount (minimum €10)
              </label>
              <div className="relative group/input">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-xl font-black text-[#1a1a1a]/20 group-focus-within/input:text-primary transition-colors font-mono">€</span>
                </div>
                <input
                  type="number"
                  min="10"
                  step="1"
                  value={amount}
                  onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
                  className="w-full bg-[#FDFBF7] border-2 border-black rounded-none py-3 pl-10 pr-4 font-black text-2xl text-[#1a1a1a] focus:bg-primary/10 outline-none transition-all font-mono"
                />
              </div>
              {amount < 10 && (
                <p className="text-error text-[8px] font-black uppercase tracking-widest animate-pulse font-mono">Minimal amount is 10 €</p>
              )}
            </div>

            <button
              onClick={onSupport}
              disabled={isLoading || amount < 10}
              className={`btn bg-black text-white hover:bg-primary border-2 border-black rounded-none btn-block font-black tracking-widest transition-all duration-300 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] ${isLoading ? 'loading' : ''} ${amount < 10 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'LOADING...' : 'SUPPORT'}
            </button>
          </div>
        </div>
    </div>
  );
};

export default VideoPlaylist;
