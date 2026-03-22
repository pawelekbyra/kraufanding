"use client";

import React, { useState, useEffect } from 'react';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import { pl } from 'date-fns/locale';
import { Heart, MessageSquare, ArrowUp, Loader2, Smile, ImageIcon } from 'lucide-react';
import { SignInButton } from '@clerk/nextjs';
import Image from 'next/image';
import { DEFAULT_AVATAR_URL } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface EmbeddedCommentsProps {
  userProfile?: {
    id: string;
    email: string;
  } | null;
  projectId: string;
}

const EmbeddedComments: React.FC<EmbeddedCommentsProps> = ({
  userProfile,
  projectId,
}) => {
  const queryClient = useQueryClient();
  const [newComment, setNewComment] = useState('');

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['comments', projectId],
    queryFn: async ({ pageParam }) => {
        const url = new URL('/api/comments', window.location.origin);
        url.searchParams.append('projectId', projectId);
        if (pageParam) url.searchParams.append('cursor', pageParam as string);
        const res = await fetch(url.toString());
        return res.json();
    },
    initialPageParam: '',
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled: !!projectId,
  });

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const comments = data?.pages?.flatMap((page) => page.comments || []) ?? [];

  const postMutation = useMutation({
    mutationFn: async (text: string) => {
        const res = await fetch('/api/comments', {
            method: 'POST',
            body: JSON.stringify({ projectId, text }),
            headers: { 'Content-Type': 'application/json' }
        });
        return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', projectId] });
      setNewComment('');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !userProfile) return;
    postMutation.mutate(newComment);
  };

  return (
    <div className="space-y-12 max-w-4xl mx-auto">
      {/* Input Area */}
      {userProfile ? (
        <form onSubmit={handleSubmit} className="flex gap-4 items-start p-6 bg-white rounded-[2rem] border border-[#1a1a1a]/5 shadow-lg transition-all focus-within:shadow-xl focus-within:scale-[1.01] duration-500">
          <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shrink-0 border border-primary shadow-xl">
             <span className="font-black text-white text-2xl uppercase">{userProfile.email[0]}</span>
          </div>
          <div className="flex-1 space-y-4">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Co o tym sądzisz?"
              className="w-full bg-transparent text-[#1a1a1a] focus:outline-none text-xl resize-none min-h-[120px] font-serif italic py-2"
            />
            <div className="flex justify-end items-center pt-4 border-t border-[#1a1a1a]/5">
              <button
                type="submit"
                disabled={!newComment.trim() || postMutation.isPending}
                className="bg-[#1a1a1a] hover:bg-primary text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest flex items-center gap-3 disabled:opacity-50 transition-all active:scale-95 shadow-2xl"
              >
                {postMutation.isPending ? <Loader2 className="animate-spin" size={20} /> : <ArrowUp size={20} />}
                Publikuj
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="p-12 bg-[#FDFBF7] rounded-[2.5rem] border-4 border-double border-[#1a1a1a]/10 text-center space-y-6">
          <div className="flex justify-center opacity-20">
             <MessageSquare size={48} className="text-[#1a1a1a]" />
          </div>
          <p className="text-[#1a1a1a]/60 font-serif italic text-2xl max-w-md mx-auto leading-relaxed">Zaloguj się, aby dołączyć do dyskusji i wspierać projekt.</p>
          <div className="flex justify-center pt-4">
             <SignInButton mode="modal">
                <button className="btn btn-primary btn-lg rounded-2xl font-black uppercase tracking-widest px-12 shadow-2xl hover:scale-105 transition-transform">Zaloguj się teraz</button>
             </SignInButton>
          </div>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-12">
        {isLoading && Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex gap-4 animate-pulse">
            <div className="w-12 h-12 bg-slate-200 rounded-2xl" />
            <div className="flex-1 space-y-4">
              <div className="h-4 bg-slate-200 rounded w-1/4" />
              <div className="h-20 bg-slate-200 rounded w-full" />
            </div>
          </div>
        ))}

        {!isLoading && comments.length === 0 && (
          <div className="text-center py-24 border-2 border-dashed border-[#1a1a1a]/5 rounded-[2.5rem]">
            <p className="text-[#1a1a1a]/30 font-black uppercase tracking-[0.2em] italic">Brak komentarzy. Bądź pierwszy!</p>
          </div>
        )}

        {comments.map((comment: any) => (
          <div key={comment.id} className="group flex gap-6 items-start animate-in fade-in slide-in-from-bottom-8 duration-700">
             <div className="w-14 h-14 rounded-2xl bg-[#1a1a1a]/5 flex items-center justify-center shrink-0 border border-[#1a1a1a]/5">
                <span className="font-black text-[#1a1a1a]/40 text-2xl uppercase">{(comment.authorName || 'U').charAt(0)}</span>
             </div>
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-3">
                <span className="font-black text-[#1a1a1a] uppercase tracking-tighter text-lg">{comment.authorName || 'Użytkownik'}</span>
                <span className="text-[10px] font-black text-[#1a1a1a]/20 uppercase tracking-[0.3em]">•</span>
                <span className="text-[10px] font-black text-[#1a1a1a]/30 uppercase tracking-[0.2em] italic">
                  {isClient && comment.createdAt && !isNaN(new Date(comment.createdAt).getTime())
                    ? formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale: pl })
                    : isClient ? 'niedawno' : ''}
                </span>
              </div>
              <p className="text-[#1a1a1a]/70 font-serif text-xl leading-relaxed italic">
                {comment.text}
              </p>
              <div className="flex items-center gap-8 pt-2">
                <button
                  className="flex items-center gap-2 text-[#1a1a1a]/30 hover:text-primary transition-colors"
                >
                  <Heart size={20} className={cn(comment.isLiked && "fill-primary text-primary")} />
                  <span className="text-xs font-black tracking-widest">{comment._count?.likes || 0}</span>
                </button>
                <button className="flex items-center gap-2 text-[#1a1a1a]/30 hover:text-[#1a1a1a]/60 transition-colors">
                  <MessageSquare size={20} />
                  <span className="text-xs font-black tracking-widest">{comment._count?.replies || 0}</span>
                </button>
              </div>
            </div>
          </div>
        ))}

        {hasNextPage && (
          <div className="pt-12 flex justify-center">
            <button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="btn btn-ghost text-[#1a1a1a]/40 font-black uppercase tracking-widest text-xs hover:bg-transparent hover:text-primary transition-colors"
            >
              {isFetchingNextPage ? <Loader2 className="animate-spin" /> : 'Pokaż więcej komentarzy'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmbeddedComments;
