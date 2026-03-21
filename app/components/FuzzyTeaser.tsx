import React from 'react';

interface FuzzyTeaserProps {
  children: React.ReactNode;
  teaserContent?: React.ReactNode;
  minTier?: number;
  tierName?: string;
}

export default function FuzzyTeaser({
  children,
  teaserContent,
  minTier = 2,
  tierName = "OBSERVER"
}: FuzzyTeaserProps) {
  return (
    <div className="relative group">
      {/* Blurred Background Content */}
      <div className="blur-md select-none pointer-events-none opacity-40 transition-all duration-700 group-hover:blur-sm">
        {children}
      </div>

      {/* Overlay Paywall */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-cream/30 backdrop-blur-sm border-2 border-white/20 rounded-2xl shadow-2xl">
        <div className="bg-white/90 p-8 rounded-2xl shadow-xl max-w-sm border border-neutral/10">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-primary">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
            </svg>
          </div>
          <h4 className="text-xl font-black uppercase tracking-tight mb-2">Narrative Paywall</h4>
          <p className="font-serif italic text-sm opacity-70 mb-6 leading-relaxed">
            {teaserContent || `This part of the story is hidden. Become a ${tierName} to reveal the evidence.`}
          </p>
          <button className="btn btn-primary btn-sm px-8 font-bold tracking-widest">
            REVEAL NOW
          </button>
        </div>
      </div>
    </div>
  );
}
