import React from 'react';
import Link from 'next/link';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { prisma } from '@/lib/prisma';
import { Campaign } from './types/campaign';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const projects = await prisma.project.findMany({
    include: {
      creator: true,
      tiers: true,
    },
    take: 6,
    orderBy: { createdAt: 'desc' },
  });

  const campaigns: Campaign[] = projects.map(project => ({
    id: project.id,
    slug: project.slug,
    title: project.title,
    description: project.title,
    category: "Technology",
    author: project.creator.name,
    goal: project.goalAmount / 100,
    raised: project.collectedAmount / 100,
    thumbnail: "https://picsum.photos/seed/" + project.slug + "/800/450",
    endDate: project.publishedAt?.toISOString() || "",
  }));

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1a1a1a] font-serif selection:bg-primary selection:text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-24">
          <h1 className="text-7xl font-black uppercase tracking-tighter mb-6 text-[#1a1a1a]">Discover Secret Projects</h1>
          <p className="text-2xl italic opacity-50 font-serif">Empowering confidential innovation and research.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
          {campaigns.map((campaign) => (
            <Link key={campaign.id} href={`/projects/${campaign.slug}`} className="group">
              <div className="bg-white border-2 border-[#1a1a1a]/5 rounded-[3rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-700 hover:-translate-y-4">
                <div className="aspect-[16/9] relative overflow-hidden">
                  <img
                    src={campaign.thumbnail}
                    alt={campaign.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                  />
                  <div className="absolute top-6 left-6 bg-primary text-[#FDFBF7] text-[10px] font-black uppercase tracking-[0.3em] px-4 py-2 rounded-full shadow-2xl">
                    {campaign.category}
                  </div>
                </div>
                <div className="p-10 space-y-8">
                  <div className="space-y-3">
                    <h3 className="text-3xl font-black mb-3 uppercase tracking-tighter group-hover:text-primary transition-colors leading-none">{campaign.title}</h3>
                    <p className="text-[#1a1a1a]/50 line-clamp-2 italic font-serif text-lg">{campaign.description}</p>
                  </div>

                  <div className="space-y-6">
                    <div className="h-2 bg-[#1a1a1a]/5 rounded-full overflow-hidden border border-[#1a1a1a]/5">
                      <div
                        className="h-full bg-primary transition-all duration-1000"
                        style={{ width: `${Math.min((campaign.raised / campaign.goal) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between items-end">
                      <div>
                        <span className="block text-[10px] font-black uppercase tracking-[0.2em] opacity-30 mb-1 italic">Raised</span>
                        <span className="text-2xl font-black text-[#1a1a1a]">€{campaign.raised.toLocaleString()}</span>
                      </div>
                      <div className="text-right">
                        <span className="block text-[10px] font-black uppercase tracking-[0.2em] opacity-30 mb-1 italic">Goal</span>
                        <span className="text-2xl font-black text-[#1a1a1a]">€{campaign.goal.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
