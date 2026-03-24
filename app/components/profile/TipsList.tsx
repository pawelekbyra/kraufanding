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
      <div className="flex flex-col items-center justify-center p-12 space-y-4 font-mono">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-[10px] font-black uppercase tracking-widest opacity-40">READING_LEDGER...</p>
      </div>
    );
  }

  if (tips.length === 0) {
    return (
      <div className="p-12 text-center space-y-6 bg-white rounded-none border-2 border-black shadow-brutalist font-mono">
        <div className="flex justify-center">
           <Coins size={48} className="text-black/10" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-black uppercase tracking-tight text-black">NO_DATA_FOUND</h3>
          <p className="text-black/40 font-bold text-xs uppercase">No recorded contributions detected in the local ledger.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-mono">
      <div className="grid grid-cols-1 gap-4">
        {tips.map((tip) => (
          <div key={tip.id} className="bg-white border-2 border-black rounded-none p-6 flex justify-between items-center shadow-brutalist-sm hover:shadow-brutalist hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all group">
            <div className="flex items-center gap-6">
               <div className="w-12 h-12 rounded-none border-2 border-black bg-primary/10 flex items-center justify-center text-black group-hover:bg-primary transition-colors">
                  <Coins size={24} />
               </div>
               <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-black/30 mb-1">
                    TS: {format(new Date(tip.createdAt), 'yyyy-MM-dd HH:mm', { locale: pl })}
                  </p>
                  <h4 className="text-base font-black text-black uppercase tracking-tight">PROTOCOL_UPLINK_CREDIT</h4>
               </div>
            </div>
            <div className="text-right">
               <span className="text-xl font-black text-black bg-primary/20 px-2 py-0.5 border-2 border-black">
                  {(tip.amount / 100).toLocaleString('pl-PL', { style: 'currency', currency: tip.currency })}
               </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
