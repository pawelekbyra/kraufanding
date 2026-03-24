"use client";

import { useUser, useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Settings, Video, Edit, Save, BarChart3, Plus, Trash2 } from "lucide-react";

export default function AdminPanel() {
  const { user, isLoaded: userLoaded } = useUser();
  const { isLoaded: authLoaded } = useAuth();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [videos, setVideos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const adminEmail = "pawel.perfect@gmail.com";

  useEffect(() => {
    if (userLoaded && authLoaded) {
      if (user?.primaryEmailAddress?.emailAddress !== adminEmail) {
        router.push("/");
      } else {
        setIsAdmin(true);
        fetchVideos();
      }
    }
  }, [user, userLoaded, authLoaded, router]);

  const fetchVideos = async () => {
    try {
      const res = await fetch("/api/admin/videos");
      const data = await res.json();
      setVideos(data);
    } catch (err) {
      console.error("Failed to fetch videos", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAdmin || isLoading) {
    return <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center font-serif">Verifying Access...</div>;
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1a1a1a] font-serif p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        <header className="flex justify-between items-end border-b-2 border-[#1a1a1a] pb-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-black uppercase tracking-tighter italic">Control Center</h1>
            <p className="text-sm font-bold uppercase tracking-widest text-[#1a1a1a]/40 italic">Restricted Access // Administrator Only</p>
          </div>
          <div className="flex gap-4">
            <button className="btn btn-sm rounded-none border-2 border-[#1a1a1a] bg-white text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white transition-all font-black uppercase tracking-widest px-6 shadow-brutalist-sm">
              <Plus size={16} className="mr-2" /> New Upload
            </button>
          </div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title="Total Videos" value={videos.length.toString()} icon={<Video size={20} />} />
          <StatCard title="Active Patrons" value="124" icon={<BarChart3 size={20} />} />
          <StatCard title="Total Revenue" value="€4,562" icon={<Settings size={20} />} />
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-black uppercase tracking-tight italic">Manage Materials</h2>
          <div className="bg-white border-2 border-[#1a1a1a] shadow-brutalist overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#1a1a1a] text-white uppercase text-[10px] font-black tracking-widest">
                  <th className="p-4">Status</th>
                  <th className="p-4">Title</th>
                  <th className="p-4">Tier</th>
                  <th className="p-4">Likes</th>
                  <th className="p-4">Views</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1a1a1a]/10">
                {videos.map((vid) => (
                  <tr key={vid.id} className="hover:bg-[#1a1a1a]/5 transition-colors group">
                    <td className="p-4">
                       {vid.isMain ? (
                         <span className="bg-primary text-white text-[8px] font-black uppercase px-2 py-1 rounded">Main</span>
                       ) : (
                         <span className="bg-[#1a1a1a]/10 text-[#1a1a1a]/40 text-[8px] font-black uppercase px-2 py-1 rounded">Archived</span>
                       )}
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-sm uppercase tracking-tight">{vid.title}</div>
                      <div className="text-[10px] text-[#1a1a1a]/40 font-mono">/{vid.slug}</div>
                    </td>
                    <td className="p-4">
                       <span className={`text-[10px] font-black uppercase px-2 py-0.5 border-2 ${
                         vid.tier === 'VIP2' ? 'border-yellow-500 text-yellow-600' :
                         vid.tier === 'VIP1' ? 'border-blue-500 text-blue-600' : 'border-[#1a1a1a]/20 text-[#1a1a1a]/40'
                       }`}>
                         {vid.tier}
                       </span>
                    </td>
                    <td className="p-4 font-mono text-sm">{vid.likesCount}</td>
                    <td className="p-4 font-mono text-sm">{vid.views}</td>
                    <td className="p-4 text-right space-x-2">
                       <button className="p-2 hover:bg-[#1a1a1a] hover:text-white transition-colors border border-transparent hover:border-[#1a1a1a]"><Edit size={16} /></button>
                       <button className="p-2 hover:bg-error hover:text-white transition-colors border border-transparent hover:border-error"><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="bg-white border-2 border-[#1a1a1a] p-6 shadow-brutalist hover:-translate-y-1 transition-transform">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-[#1a1a1a] text-white">{icon}</div>
        <div className="text-[10px] font-black uppercase tracking-widest text-[#1a1a1a]/30">Live Data</div>
      </div>
      <div className="text-3xl font-black italic mb-1">{value}</div>
      <div className="text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/60">{title}</div>
    </div>
  );
}
