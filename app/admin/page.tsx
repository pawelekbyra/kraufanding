import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import React from 'react';
import Link from 'next/link';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';

export const dynamic = 'force-dynamic';

export default async function AdminPanel() {
  const { userId: clerkUserId } = auth();
  if (!clerkUserId) redirect('/sign-in');

  const user = await prisma.user.findUnique({
    where: { clerkUserId },
    select: { role: true, email: true }
  });

  // Authorization: Only CREATOR, ADMIN, or specific email
  const isAuthorized = user?.role === 'ADMIN' || user?.role === 'CREATOR' || user?.email === 'pawel.perfect@protonmail.com' || user?.email === 'pawel.perfect@gmail.com';

  if (!isAuthorized) {
    notFound();
  }

  const projects = await prisma.project.findMany({
    include: {
      creator: true,
      _count: {
        select: { payments: true, projectAccess: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1a1a1a] font-serif">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="flex justify-between items-end mb-16 border-b-4 border-double border-[#1a1a1a]/10 pb-12">
          <div>
            <h1 className="text-6xl font-black uppercase tracking-tighter mb-4">Panel Zarządzania</h1>
            <p className="text-xl italic opacity-50 font-serif">Witaj, {user?.email}. Masz pełny dostęp do zrzutek.</p>
          </div>
          <Link href="/admin/projects/new" className="btn btn-primary btn-lg rounded-2xl font-black tracking-widest px-12 shadow-xl">
             DODAJ NOWĄ ZRZUTKĘ
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {projects.map((project) => (
            <div key={project.id} className="bg-white border-2 border-[#1a1a1a]/10 rounded-[2.5rem] p-10 shadow-lg hover:shadow-2xl transition-all duration-500 flex flex-col lg:flex-row gap-12 items-center">
               <div className="w-full lg:w-1/4 aspect-video rounded-3xl overflow-hidden bg-[#1a1a1a]/5 border border-[#1a1a1a]/5">
                  <img src={`https://picsum.photos/seed/${project.slug}/800/450`} alt={project.title} className="w-full h-full object-cover grayscale" />
               </div>

               <div className="flex-1 space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                       <span className={`badge ${project.status === 'active' ? 'badge-success' : 'badge-ghost'} badge-sm font-black uppercase tracking-widest`}>
                          {project.status === 'active' ? 'Aktywna' : 'Draft'}
                       </span>
                       <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-30 italic">ID: {project.id}</span>
                    </div>
                    <h3 className="text-3xl font-black uppercase tracking-tight">{project.title}</h3>
                    <p className="text-[#1a1a1a]/50 italic font-serif text-lg leading-relaxed line-clamp-2">/{project.slug}</p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    <div>
                       <span className="block text-[10px] font-black uppercase tracking-widest opacity-30 mb-1 italic">Cel</span>
                       <span className="text-xl font-black">€{(project.goalAmount / 100).toLocaleString('pl-PL')}</span>
                    </div>
                    <div>
                       <span className="block text-[10px] font-black uppercase tracking-widest opacity-30 mb-1 italic">Zebrane</span>
                       <span className="text-xl font-black">€{(project.collectedAmount / 100).toLocaleString('pl-PL')}</span>
                    </div>
                    <div>
                       <span className="block text-[10px] font-black uppercase tracking-widest opacity-30 mb-1 italic">Wpłaty</span>
                       <span className="text-xl font-black">{project._count.payments}</span>
                    </div>
                    <div>
                       <span className="block text-[10px] font-black uppercase tracking-widest opacity-30 mb-1 italic">Patroni</span>
                       <span className="text-xl font-black">{project._count.projectAccess}</span>
                    </div>
                  </div>
               </div>

               <div className="flex flex-col gap-3 w-full lg:w-48">
                  <Link href={`/projects/${project.slug}`} className="btn btn-ghost border-2 border-[#1a1a1a]/5 rounded-xl font-black tracking-widest uppercase text-xs btn-sm">Podgląd</Link>
                  <Link href={`/admin/projects/${project.id}`} className="btn bg-[#1a1a1a] text-white hover:bg-primary border-none rounded-xl font-black tracking-widest uppercase text-xs btn-sm flex items-center justify-center">Edytuj</Link>
                  <button className="btn btn-ghost text-error hover:bg-error/10 border-none rounded-xl font-black tracking-widest uppercase text-xs btn-sm">Usuń</button>
               </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
