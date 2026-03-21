import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

interface DisplayProject {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    author: string;
    raised: number;
    goal: number;
    category: string;
}

export default async function Home() {
  let displayProjects: DisplayProject[] = [];

  if (process.env.DATABASE_URL) {
    try {
        const { prisma } = await import('@/lib/prisma');
        const projects = await prisma.project.findMany({
          where: { status: 'ACTIVE' },
          include: { creator: true },
          orderBy: { createdAt: 'desc' }
        });

        if (projects.length > 0) {
          displayProjects = projects.map(p => ({
            id: p.id,
            title: p.title,
            description: "Exclusive project on POLUTEK.PL",
            thumbnail: "https://picsum.photos/seed/" + p.id + "/800/450",
            author: p.creator.name,
            raised: p.collectedAmount / 100,
            goal: p.goalAmount / 100,
            category: "Investigation"
          }));
        }
      } catch (e) {
        console.error("Failed to fetch projects:", e);
      }
  }

  // Fallback to mock data if DB is empty or fails or no DATABASE_URL
  if (displayProjects.length === 0) {
    displayProjects = [
        {
          id: "1",
          title: "The Secret Archive",
          description: "A deep dive into the hidden world of technology and power.",
          thumbnail: "https://picsum.photos/seed/archive/800/450",
          author: "Detective X",
          raised: 5200,
          goal: 10000,
          category: "Journalism"
        },
        {
          id: "2",
          title: "Project Phoenix",
          description: "Rebuilding the foundations of the open web.",
          thumbnail: "https://picsum.photos/seed/phoenix/800/450",
          author: "Architect Alpha",
          raised: 15000,
          goal: 20000,
          category: "Tech"
        }
      ];
  }

  return (
    <div className="min-h-screen bg-cream text-charcoal py-20 font-serif">
      <main className="max-w-6xl mx-auto px-4">
        <header className="mb-20 text-center">
          <h1 className="text-6xl font-black mb-6 tracking-tighter uppercase leading-none">
            POLUTEK<span className="text-primary">.PL</span>
          </h1>
          <p className="text-2xl opacity-60 max-w-2xl mx-auto leading-relaxed italic">
            A hybrid platform combining crowdfunding, subscriptions, and premium content protection.
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {displayProjects.map((campaign) => (
            <Link
              key={campaign.id}
              href={`/campaigns/${campaign.id}`}
              className="group bg-white rounded-3xl shadow-xl overflow-hidden border border-neutral/5 hover:shadow-2xl transition-all duration-500"
            >
              <figure className="aspect-[16/9] relative overflow-hidden">
                <Image
                  src={campaign.thumbnail}
                  alt={campaign.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 bg-primary text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg z-10">
                  {campaign.category}
                </div>
              </figure>
              <div className="p-8">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold uppercase tracking-widest opacity-40">{campaign.author}</span>
                  <span className="text-xs font-bold uppercase tracking-widest text-primary">Active</span>
                </div>
                <h3 className="text-2xl font-black mb-4 tracking-tight uppercase group-hover:text-primary transition-colors line-clamp-2">
                  {campaign.title}
                </h3>
                <p className="text-sm opacity-60 leading-relaxed line-clamp-3 mb-8">
                  {campaign.description}
                </p>

                <div className="space-y-4">
                  <div className="flex justify-between text-xs font-black uppercase tracking-widest mb-1">
                    <span>{Math.round((campaign.raised / campaign.goal) * 100)}% Funded</span>
                    <span className="opacity-40">€{campaign.raised.toLocaleString()} / €{campaign.goal.toLocaleString()}</span>
                  </div>
                  <progress
                    className="progress progress-primary w-full h-2"
                    value={(campaign.raised / campaign.goal) * 100}
                    max="100"
                  ></progress>
                </div>
              </div>
            </Link>
          ))}

          <div className="bg-neutral/5 rounded-3xl border-2 border-dashed border-neutral/10 flex flex-col items-center justify-center p-12 text-center group cursor-pointer hover:bg-neutral/10 transition-colors">
            <div className="w-16 h-16 bg-neutral/5 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 opacity-40">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </div>
            <h3 className="text-xl font-bold uppercase tracking-tight mb-2">Start a Project</h3>
            <p className="text-sm opacity-40 max-w-[200px]">Bring your ambitious idea to life with POLUTEK.PL</p>
          </div>
        </section>
      </main>
    </div>
  );
}
