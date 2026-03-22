import React from 'react';
import { notFound } from 'next/navigation';
import { mockCampaigns } from '@/app/data/mock-campaigns';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import ProjectView from '@/app/components/ProjectView';

interface ProjectPageProps {
  params: {
    slug: string;
  };
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const campaign = mockCampaigns.find((c) => c.slug === params.slug);

  if (!campaign) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1a1a1a] font-serif selection:bg-primary selection:text-white">
      <Navbar />
      <ProjectView campaign={campaign} />
      <Footer />
    </div>
  );
}

export async function generateStaticParams() {
  return mockCampaigns.map((campaign) => ({
    slug: campaign.slug,
  }));
}
