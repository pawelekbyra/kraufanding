"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface EditProjectFormProps {
  project: {
    id: string;
    title: string;
    slug: string;
    status: string;
    creatorId: string;
  };
  creators: Array<{ id: string; name: string }>;
}

export default function EditProjectForm({ project, creators }: EditProjectFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: project.title,
    slug: project.slug,
    status: project.status,
    creatorId: project.creatorId
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch('/api/admin/projects', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: project.id,
          ...formData
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong");
      }

      router.push('/admin');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="alert alert-error rounded-2xl font-black uppercase tracking-widest text-xs">
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest opacity-40 italic ml-4">Tytuł Kampanii</label>
        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full bg-[#FDFBF7] border-2 border-[#1a1a1a]/10 rounded-2xl py-4 px-6 font-black text-xl text-[#1a1a1a] focus:border-primary outline-none transition-all"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest opacity-40 italic ml-4">Slug (URL)</label>
        <div className="relative">
           <span className="absolute left-6 top-1/2 -translate-y-1/2 text-[#1a1a1a]/20 font-black">/projects/</span>
           <input
             name="slug"
             value={formData.slug}
             onChange={handleChange}
             className="w-full bg-[#FDFBF7] border-2 border-[#1a1a1a]/10 rounded-2xl py-4 pl-32 pr-6 font-black text-xl text-[#1a1a1a] focus:border-primary outline-none transition-all"
             required
           />
        </div>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest opacity-40 italic ml-4">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full bg-[#FDFBF7] border-2 border-[#1a1a1a]/10 rounded-2xl py-4 px-6 font-black text-xl text-[#1a1a1a] focus:border-primary outline-none transition-all"
          >
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="closed">Closed</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest opacity-40 italic ml-4">Autor/Creator</label>
          <select
            name="creatorId"
            value={formData.creatorId}
            onChange={handleChange}
            className="w-full bg-[#FDFBF7] border-2 border-[#1a1a1a]/10 rounded-2xl py-4 px-6 font-black text-xl text-[#1a1a1a] focus:border-primary outline-none transition-all"
          >
            {creators.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="pt-8 flex gap-4">
        <button
          type="button"
          onClick={() => router.push('/admin')}
          className="flex-1 btn btn-ghost border-2 border-[#1a1a1a]/5 rounded-2xl font-black uppercase tracking-widest"
        >
          Anuluj
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 btn btn-primary rounded-2xl font-black uppercase tracking-widest shadow-xl"
        >
          {isLoading ? 'Zapisywanie...' : 'Zapisz Zmiany'}
        </button>
      </div>
    </form>
  );
}
