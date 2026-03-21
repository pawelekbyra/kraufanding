import React from 'react';
import ClientHome from './ClientHome';
import RestrictedContent from './components/RestrictedContent';
import { Campaign, Reward } from './types/campaign';

const mockCampaign: Campaign = {
  id: 'polutek-1',
  title: 'POLUTEK.PL - The Campaign',
  description: 'This is a secret project with global ambitions. By supporting us now, you are claiming your stake in the next big revolution.',
  category: 'Technology',
  author: 'POLUTEK Team',
  goal: 10000,
  raised: 6500,
  thumbnail: 'https://picsum.photos/seed/polutek/1200/600',
  endDate: '2025-12-31',
};

const mockRewards: Reward[] = [
  {
    id: 'r1',
    amount: 10,
    title: 'Support Tier',
    description: 'A personal thank you and digital badge.',
    deliveryDate: 'Jan 2025',
    backers: 120
  },
  {
    id: 'r2',
    amount: 50,
    title: 'Patron Tier',
    description: 'Early access to project insights and updates.',
    deliveryDate: 'Feb 2025',
    backers: 85
  },
  {
    id: 'r3',
    amount: 100,
    title: 'VIP Founder',
    description: 'Exclusive voting rights and lifetime status.',
    deliveryDate: 'Mar 2025',
    backers: 42
  }
];

export default function Home() {
  const restrictedContent = (
    <RestrictedContent
      freeSample={
        <div className="p-6 bg-neutral/5 rounded-2xl border border-neutral/10">
          <p className="italic opacity-70 text-charcoal">
            &quot;The first step was the hardest. We didn&apos;t know if the transmission would hold,
            but the signal from the Janov sector was unmistakable...&quot;
          </p>
          <div className="mt-4 aspect-video bg-neutral/10 rounded-xl overflow-hidden grayscale">
            <img src="https://picsum.photos/seed/sample/600/400" alt="Free Sample" className="object-cover w-full h-full opacity-50" />
          </div>
        </div>
      }
      premiumContent={
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="aspect-video bg-neutral/10 rounded-xl flex items-center justify-center relative overflow-hidden group">
            <img src="https://picsum.photos/seed/secret1/600/400" alt="Secret Video 1" className="object-cover w-full h-full group-hover:scale-105 transition-transform" />
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
              <div className="bg-primary text-white p-3 rounded-full shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="aspect-video bg-neutral/10 rounded-xl flex items-center justify-center relative overflow-hidden group">
            <img src="https://picsum.photos/seed/secret2/600/400" alt="Secret Video 2" className="object-cover w-full h-full group-hover:scale-105 transition-transform" />
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
              <div className="bg-primary text-white p-3 rounded-full shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      }
    />
  );

  return (
    <ClientHome
      restrictedContent={restrictedContent}
      initialCampaign={mockCampaign}
      initialRewards={mockRewards}
    />
  );
}
