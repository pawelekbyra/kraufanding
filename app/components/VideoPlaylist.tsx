"use client";

import React, { useState } from 'react';
import { useAuth, useClerk } from '@clerk/nextjs';
import { Heart, ArrowRight, Loader2 } from 'lucide-react';

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
      alert("Minimalna kwota wsparcia to 10 EUR");
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch('/api/checkout', {
        method: 'POST',
        body: JSON.stringify({
          amount: amount,
          projectId: projectId,
          tierLevel: 2,
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
    <div className="px-1" id="donations">
      <div className="bg-card border border-border rounded-xl p-5 transition-all duration-300 hover:shadow-md hover:border-border/80 group">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
              <Heart className="w-5 h-5 text-accent" />
            </div>
            <div className="space-y-1">
              <h3 className="font-serif text-lg font-semibold text-foreground group-hover:text-accent transition-colors">
                Zostaw Napiwek
              </h3>
              <p className="font-sans text-sm text-muted-foreground leading-relaxed">
                Wplac dowolna kwote i uzyskaj dozywotni dostep do tresci dla Patronow.
              </p>
            </div>
          </div>

          {/* Input */}
          <div className="space-y-2">
            <label className="font-sans text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Kwota wsparcia (min. 10 EUR)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="font-serif text-xl font-semibold text-muted-foreground/50 group-focus-within:text-accent transition-colors">
                  EUR
                </span>
              </div>
              <input
                type="number"
                min="10"
                step="1"
                value={amount}
                onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
                className="w-full bg-secondary/50 border border-border rounded-lg py-3 pl-14 pr-4 font-serif text-2xl font-semibold text-foreground focus:border-accent focus:ring-2 focus:ring-accent/10 focus:bg-card outline-none transition-all"
              />
            </div>
            {amount < 10 && (
              <p className="font-sans text-xs font-medium text-red-500 animate-pulse">
                Minimalna kwota to 10 EUR
              </p>
            )}
          </div>

          {/* Button */}
          <button
            onClick={onSupport}
            disabled={isLoading || amount < 10}
            className={`
              w-full flex items-center justify-center gap-2 
              bg-foreground text-background 
              font-sans text-sm font-semibold uppercase tracking-wider
              py-3 px-6 rounded-lg
              hover:bg-accent transition-all duration-300
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Ladowanie...
              </>
            ) : (
              <>
                Wesprzyj
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoPlaylist;
