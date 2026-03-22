import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import React from 'react';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import EditProjectForm from './EditProjectForm';

export const dynamic = 'force-dynamic';

interface EditProjectPageProps {
  params: {
    id: string;
  };
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
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

  const project = await prisma.project.findUnique({
    where: { id: params.id },
    include: {
        creator: true
    }
  });

  if (!project) {
    notFound();
  }

  const creators = await prisma.creator.findMany();

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1a1a1a] font-serif">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-24">
        <h1 className="text-5xl font-black uppercase tracking-tighter mb-12 border-b-4 border-double border-[#1a1a1a]/10 pb-8">Edytuj Zrzutkę</h1>
        <div className="bg-white p-12 rounded-[2.5rem] border border-[#1a1a1a]/10 shadow-xl">
           <EditProjectForm project={project} creators={creators} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
