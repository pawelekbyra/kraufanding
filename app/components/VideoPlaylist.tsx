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
    <div className="space-y-4 font-mono px-2" id="donations">
        <div
          className="bg-white border-2 border-black rounded-none p-6 shadow-brutalist transition-all duration-500 group relative overflow-hidden"
        >
          {/* STAMP EFFECT BACKGROUND */}
          <div className="absolute -top-4 -right-4 w-24 h-24 border-4 border-primary/20 rounded-full flex items-center justify-center rotate-12 pointer-events-none group-hover:scale-110 transition-transform">
             <span className="text-[10px] font-black text-primary/30 text-center leading-none uppercase">AUTHENTIC<br/>PROTOCOL</span>
          </div>

          <div className="space-y-4 relative z-10">
            <div className="space-y-2 border-b-2 border-black border-dashed pb-3">
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 bg-primary animate-pulse"></div>
                 <h3 className="text-lg font-black text-black tracking-tighter uppercase">
                   AUTH_TRANSFER_REQUEST
                 </h3>
              </div>
              <p className="text-black/60 text-[10px] leading-tight font-bold uppercase">
                Submit optional credit to establish permanent uplink and archive access.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex justify-between items-end">
                <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-black/40">
                  CREDIT_AMOUNT (MIN_10_EUR)
                </label>
                <span className="text-[8px] font-mono text-black/20">VERIFIED_SECURE</span>
              </div>
              <div className="relative group/input">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-xl font-black text-black/20 group-focus-within/input:text-primary transition-colors">€</span>
                </div>
                <input
                  type="number"
                  min="10"
                  step="1"
                  value={amount}
                  onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
                  className="w-full bg-[#FDFBF7] border-2 border-black rounded-none py-4 pl-12 pr-4 font-black text-3xl text-black focus:bg-primary/5 outline-none transition-all placeholder:text-black/5"
                />
              </div>
              {amount < 10 && (
                <p className="text-error text-[8px] font-black uppercase tracking-widest animate-pulse">ERR: MIN_REQ_NOT_MET</p>
              )}
            </div>

            <div className="pt-2">
                <button
                onClick={onSupport}
                disabled={isLoading || amount < 10}
                className={`w-full py-4 border-2 border-black font-black tracking-[0.2em] uppercase transition-all duration-300 shadow-brutalist hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] ${isLoading ? 'bg-primary/50 cursor-wait' : 'bg-black text-white hover:bg-primary hover:text-black'} ${amount < 10 ? 'opacity-30 cursor-not-allowed grayscale' : ''}`}
                >
                {isLoading ? 'INITIATING...' : 'EXECUTE_TRANSFER'}
                </button>
                <p className="text-center text-[7px] font-bold text-black/30 mt-3 uppercase tracking-widest">
                    BY EXECUTING YOU AGREE TO OPS_TERMS_AND_PROTOCOLS
                </p>
            </div>
          </div>
        </div>
    </div>
  );
};

export default VideoPlaylist;
