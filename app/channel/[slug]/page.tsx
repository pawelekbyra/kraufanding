import React from 'react';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import { prisma } from '@/lib/prisma';
import { auth, currentUser } from '@clerk/nextjs/server';
import { Video } from '@/app/types/video';
import Link from 'next/link';
import PremiumWrapper from '@/app/components/PremiumWrapper';
import { cn } from '@/lib/utils';
import { Search, Play, Filter, MoreVertical } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ChannelPage({ params }: { params: { slug: string } }) {
  const creator = await prisma.creator.findUnique({
    where: { slug: params.slug },
    include: {
      videos: {
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!creator) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center font-serif">
        <Navbar />
        <h1 className="text-4xl font-black uppercase">Kanał nie znaleziony</h1>
        <Link href="/" className="mt-4 text-primary hover:underline uppercase font-bold tracking-widest">Wróć na stronę główną</Link>
        <Footer />
      </div>
    );
  }

  const { userId } = auth();
  const user = await currentUser();
  const userDb = userId ? await prisma.user.findUnique({ where: { clerkUserId: userId } }) : null;

  const userProfile = userId ? {
      totalPaid: userDb?.totalPaid || 0
  } : null;

  const allVideos = creator.videos.map(v => ({
    ...v,
    creator: {
      id: creator.id,
      name: creator.name,
      slug: creator.slug,
      subscribersCount: creator.subscribersCount
    }
  })) as any as Video[];

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#0f0f0f] font-serif">
      <Navbar />

      {/* CHANNEL COVER */}
      <div className="w-full h-[16vw] min-h-[120px] max-h-[300px] bg-neutral-200 relative overflow-hidden">
         <div className="absolute inset-0 bg-gradient-to-r from-neutral-300 to-neutral-400 animate-pulse" />
         {/* Placeholder for real banner */}
         <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
            <span className="text-[10vw] font-black uppercase tracking-tighter rotate-2">{creator.name}</span>
         </div>
      </div>

      {/* CHANNEL HEADER */}
      <div className="max-w-[1284px] mx-auto px-4 md:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-sm overflow-hidden bg-white shrink-0">
             <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${creator.name}`} alt={creator.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 text-center md:text-left space-y-2">
            <h1 className="text-[36px] font-black leading-tight tracking-tight uppercase">{creator.name}</h1>
            <div className="text-[14px] text-[#606060] flex flex-wrap justify-center md:justify-start gap-x-2 gap-y-1 font-sans">
               <span className="font-bold text-[#0f0f0f]">@{creator.slug}</span>
               <span>•</span>
               <span>{creator.subscribersCount.toLocaleString('pl-PL')} subskrajberów</span>
               <span>•</span>
               <span>{allVideos.length} filmów</span>
            </div>
            <p className="text-[14px] text-[#606060] line-clamp-2 max-w-2xl font-sans mt-2">
               {creator.bio || "Witamy na oficjalnym kanale. Subskrybuj, aby być na bieżąco z najnowszymi materiałami."}
            </p>
            <div className="pt-4 flex flex-wrap justify-center md:justify-start gap-3 items-center">
               <button className="bg-[#0f0f0f] text-white rounded-full px-6 h-10 font-bold text-[14px] hover:bg-[#272727] transition-all uppercase tracking-widest">Subskrajbuj</button>
               <button className="bg-[#000000]/5 hover:bg-[#000000]/10 rounded-full px-6 h-10 font-bold text-[14px] transition-all uppercase tracking-widest">Wspieraj</button>
            </div>
          </div>
        </div>

        {/* CHANNEL TABS */}
        <div className="flex border-b border-[#1a1a1a]/10 mt-8 overflow-x-auto no-scrollbar gap-8">
           <button className="pb-3 border-b-2 border-[#0f0f0f] text-[14px] font-bold uppercase tracking-widest">Wideo</button>
           <button className="pb-3 text-[#606060] text-[14px] font-bold uppercase tracking-widest hover:text-[#0f0f0f] transition-colors">Playlisty</button>
           <button className="pb-3 text-[#606060] text-[14px] font-bold uppercase tracking-widest hover:text-[#0f0f0f] transition-colors">Społeczność</button>
           <button className="pb-3 text-[#606060] text-[14px] font-bold uppercase tracking-widest hover:text-[#0f0f0f] transition-colors">Informacje</button>
           <div className="ml-auto pb-3 flex items-center gap-4">
              <Search size={20} className="text-[#606060] cursor-pointer" />
           </div>
        </div>

        {/* SEARCH & FILTERS BAR */}
        <div className="py-4 flex items-center gap-4 overflow-x-auto no-scrollbar">
           <button className="bg-[#0f0f0f] text-white rounded-lg px-4 py-1.5 text-[14px] font-bold shrink-0">Najnowsze</button>
           <button className="bg-[#000000]/5 hover:bg-[#000000]/10 rounded-lg px-4 py-1.5 text-[14px] font-bold shrink-0">Popularne</button>
           <button className="bg-[#000000]/5 hover:bg-[#000000]/10 rounded-lg px-4 py-1.5 text-[14px] font-bold shrink-0">Najstarsze</button>
        </div>

        {/* VIDEOS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-10 py-6">
          {allVideos.map((video) => {
            const isLoggedIn = !!userId;
            const hasVIP1 = (userProfile?.totalPaid || 0) >= 5;
            const hasVIP2 = (userProfile?.totalPaid || 0) >= 10;

            const hasAccess = video.tier === 'PUBLIC' ||
                              (video.tier === 'LOGGED_IN' && isLoggedIn) ||
                              (video.tier === 'VIP1' && hasVIP1) ||
                              (video.tier === 'VIP2' && hasVIP2) ||
                              video.isMainFeatured;

            return (
              <div key={video.id} className="group cursor-pointer">
                <Link href={video.isMainFeatured ? "/" : `/?v=${video.id}`} className="block">
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-black mb-3">
                    <PremiumWrapper videoId={video.id} requiredTier={video.tier} isMainFeatured={video.isMainFeatured} variant="thumbnail">
                      {() => (
                         <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      )}
                    </PremiumWrapper>
                    <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[12px] font-bold px-1.5 py-0.5 rounded">
                       12:45
                    </div>
                    {/* Access Indicator Badge on Thumbnail */}
                    {!hasAccess && (
                       <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-white text-[10px] font-black uppercase px-2 py-1 rounded-md border border-white/10 tracking-widest">
                          {video.tier === 'LOGGED_IN' ? 'Login Req' : 'Patron Only'}
                       </div>
                    )}
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[16px] font-bold text-[#0f0f0f] leading-snug line-clamp-2 uppercase tracking-tight mb-1">
                        {video.title}
                      </h3>
                      <div className="text-[14px] text-[#606060] font-sans">
                        <div className="flex items-center gap-1">
                           <span>{video.views.toLocaleString('pl-PL')} wyświetleń</span>
                           <span>•</span>
                           <span>2 tyg. temu</span>
                        </div>
                        <div className="mt-1">
                           {hasAccess ? (
                             <span className="text-[11px] font-black uppercase tracking-widest text-primary">Dostępne</span>
                           ) : (
                             <span className={cn(
                               "text-[11px] font-black uppercase tracking-widest",
                               video.tier === 'LOGGED_IN' ? "text-blue-600" : "text-[#1a1a1a]/40"
                             )}>
                               {video.tier === 'LOGGED_IN' ? 'Zaloguj się' : 'Dla Patronów'}
                             </span>
                           )}
                        </div>
                      </div>
                    </div>
                    <button className="h-fit p-1 hover:bg-[#000000]/5 rounded-full transition-colors opacity-0 group-hover:opacity-100 shrink-0">
                       <MoreVertical size={20} />
                    </button>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
      <Footer />
    </div>
  );
}
