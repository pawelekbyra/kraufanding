import { UserProfile } from "@clerk/nextjs";
import React from 'react';
import TipsList from "@/app/components/profile/TipsList";
import { Coins } from "lucide-react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

export default function CustomUserProfilePage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-12">
        <UserProfile path="/user-profile" routing="path">
          <UserProfile.Page
            label="Wpłaty"
            labelIcon={<Coins size={16} />}
            url="tips"
          >
            <div className="py-8 px-4 max-w-4xl">
               <div className="mb-12">
                  <h1 className="text-5xl font-black uppercase tracking-tighter mb-4 text-[#1a1a1a]">Moje Wpłaty</h1>
                  <p className="text-xl italic opacity-50 font-serif border-b-4 border-double border-[#1a1a1a]/10 pb-8">Pełna historia Twojego wsparcia dla twórców na polutek.pl.</p>
               </div>
               <TipsList />
            </div>
          </UserProfile.Page>
        </UserProfile>
      </main>
      <Footer />
    </div>
  );
}
