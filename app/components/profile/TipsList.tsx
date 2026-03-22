'use client';

import React, { useEffect, useState } from 'react';
import { getUserTips } from '@/lib/actions/tips';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import { Loader2, Coins } from 'lucide-react';

export default function TipsList() {
  const [tips, setTips] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchTips() {
      try {
        const data = await getUserTips();
        setTips(data);
      } catch (error) {
        console.error("Error fetching tips:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchTips();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm font-black uppercase tracking-widest opacity-30 italic">Ładowanie historii wpłat...</p>
      </div>
    );
  }

  if (tips.length === 0) {
    return (
      <div className="p-12 text-center space-y-6 bg-[#1a1a1a]/5 rounded-[2.5rem] border-2 border-dashed border-[#1a1a1a]/10">
        <div className="flex justify-center">
           <Coins size={48} className="text-[#1a1a1a]/20" />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-black uppercase tracking-tight text-[#1a1a1a]">Brak wpłat</h3>
          <p className="text-[#1a1a1a]/50 font-serif italic text-lg leading-relaxed">Nie masz jeszcze żadnych zarejestrowanych wpłat w naszym serwisie.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-serif">
      <div className="grid grid-cols-1 gap-4">
        {tips.map((tip) => (
          <div key={tip.id} className="bg-white border-2 border-[#1a1a1a]/5 rounded-3xl p-6 flex justify-between items-center shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center gap-6">
               <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <Coins size={24} />
               </div>
               <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#1a1a1a]/30 mb-1 italic">
                    {format(new Date(tip.createdAt), 'd MMMM yyyy, HH:mm', { locale: pl })}
                  </p>
                  <h4 className="text-xl font-black text-[#1a1a1a] uppercase tracking-tight">Wsparcie Projektu</h4>
               </div>
            </div>
            <div className="text-right">
               <span className="text-2xl font-black text-primary">
                  {(tip.amount / 100).toLocaleString('pl-PL', { style: 'currency', currency: tip.currency })}
               </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
