import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import React from 'react';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import NewProjectForm from './NewProjectForm';

export const dynamic = 'force-dynamic';

export default async function NewProjectPage() {
  const { userId: clerkUserId } = auth();
  if (!clerkUserId) redirect('/sign-in');

  const user = await prisma.user.findUnique({
    where: { clerkUserId },
    select: { role: true, email: true }
  });

  const isAuthorized = user?.role === 'ADMIN' || user?.role === 'CREATOR' || user?.email === 'pawel.perfect@protonmail.com' || user?.email === 'pawel.perfect@gmail.com';

  if (!isAuthorized) {
    notFound();
  }

  const creators = await prisma.creator.findMany();

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1a1a1a] font-serif">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-24">
        <h1 className="text-5xl font-black uppercase tracking-tighter mb-12 border-b-4 border-double border-[#1a1a1a]/10 pb-8">Nowa Zrzutka</h1>
        <div className="bg-white p-12 rounded-[2.5rem] border border-[#1a1a1a]/10 shadow-xl">
           <NewProjectForm creators={creators} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
