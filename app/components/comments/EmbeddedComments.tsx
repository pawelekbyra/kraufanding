"use client";

import React, { useState, useEffect } from 'react';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import { pl } from 'date-fns/locale';
import { Heart, MessageSquare, ArrowUp, Loader2, Smile, ImageIcon, CornerDownRight } from 'lucide-react';
import { SignInButton } from '@clerk/nextjs';
import Image from 'next/image';
import { DEFAULT_AVATAR_URL } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface EmbeddedCommentsProps {
  userProfile?: {
    id: string;
    email: string;
  } | null;
  entityId: string;
  entityType?: 'PROJECT' | 'POST';
}

const EmbeddedComments: React.FC<EmbeddedCommentsProps> = ({
  userProfile,
  entityId,
  entityType = 'PROJECT',
}) => {
  const queryClient = useQueryClient();
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['comments', entityId, entityType],
    queryFn: async ({ pageParam }) => {
        const url = new URL('/api/comments', window.location.origin);
        url.searchParams.append('entityId', entityId);
        url.searchParams.append('entityType', entityType);
        if (pageParam) url.searchParams.append('cursor', pageParam as string);
        const res = await fetch(url.toString());
        return res.json();
    },
    initialPageParam: '',
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled: !!entityId,
  });

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const comments = data?.pages?.flatMap((page) => page.comments || []) ?? [];

  const postMutation = useMutation({
    mutationFn: async ({ text, parentId }: { text: string; parentId?: string }) => {
        const res = await fetch('/api/comments', {
            method: 'POST',
            body: JSON.stringify({ entityId, entityType, text, parentId }),
            headers: { 'Content-Type': 'application/json' }
        });
        return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', entityId, entityType] });
      setNewComment('');
      setReplyTo(null);
    },
  });

  const likeMutation = useMutation({
    mutationFn: async (commentId: string) => {
        const res = await fetch('/api/comments/like', {
            method: 'POST',
            body: JSON.stringify({ commentId }),
            headers: { 'Content-Type': 'application/json' }
        });
        return res.json();
    },
    onMutate: async (commentId) => {
        await queryClient.cancelQueries({ queryKey: ['comments', entityId, entityType] });
        const previousData = queryClient.getQueryData(['comments', entityId, entityType]);

        queryClient.setQueryData(['comments', entityId, entityType], (old: any) => {
            if (!old) return old;
            return {
                ...old,
                pages: old.pages.map((page: any) => ({
                    ...page,
                    comments: page.comments.map((c: any) => {
                        if (c.id === commentId) {
                            const currentlyLiked = c.isLiked;
                            return {
                                ...c,
                                isLiked: !currentlyLiked,
                                _count: {
                                    ...c._count,
                                    likes: currentlyLiked ? Math.max(0, c._count.likes - 1) : c._count.likes + 1
                                }
                            };
                        }
                        return c;
                    })
                }))
            };
        });

        return { previousData };
    },
    onError: (err, commentId, context) => {
        if (context?.previousData) {
            queryClient.setQueryData(['comments', entityId, entityType], context.previousData);
        }
    },
    onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ['comments', entityId, entityType] });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !userProfile) return;
    postMutation.mutate({ text: newComment, parentId: replyTo || undefined });
  };

  return (
    <div className="space-y-12 max-w-4xl mx-auto prose-lg">
      {/* Input Area */}
      {userProfile ? (
        <form onSubmit={handleSubmit} className="flex gap-4 items-start p-8 bg-[#FDFBF7] rounded-[2rem] border border-[#1a1a1a]/5 shadow-xl transition-all focus-within:shadow-2xl focus-within:scale-[1.01] duration-500">
          <div className="w-14 h-14 rounded-2xl bg-[#1a1a1a] flex items-center justify-center shrink-0 border border-[#1a1a1a] shadow-xl">
             <span className="font-black text-white text-2xl uppercase">{userProfile.email.charAt(0)}</span>
          </div>
          <div className="flex-1 space-y-4">
            {replyTo && (
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary bg-primary/5 px-4 py-2 rounded-full w-fit">
                <CornerDownRight size={14} />
                Odpowiadasz na komentarz
                <button onClick={() => setReplyTo(null)} className="ml-2 hover:text-primary/70">✕</button>
              </div>
            )}
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={replyTo ? "Napisz odpowiedź..." : "Co o tym sądzisz?"}
              className="w-full bg-transparent text-[#1a1a1a] focus:outline-none text-xl resize-none min-h-[120px] font-serif italic py-2 leading-relaxed"
            />
            <div className="flex justify-end items-center pt-4 border-t border-[#1a1a1a]/5">
              <button
                type="submit"
                disabled={!newComment.trim() || postMutation.isPending}
                className="bg-[#1a1a1a] hover:bg-primary text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest flex items-center gap-3 disabled:opacity-50 transition-all active:scale-95 shadow-2xl"
              >
                {postMutation.isPending ? <Loader2 className="animate-spin" size={20} /> : <ArrowUp size={20} />}
                {replyTo ? 'Odpowiedz' : 'Publikuj'}
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
            <div className="w-12 h-12 bg-[#1a1a1a]/5 rounded-2xl" />
            <div className="flex-1 space-y-4">
              <div className="h-4 bg-[#1a1a1a]/5 rounded w-1/4" />
              <div className="h-20 bg-[#1a1a1a]/5 rounded w-full" />
            </div>
          </div>
        ))}

        {!isLoading && comments.length === 0 && (
          <div className="text-center py-24 border-2 border-dashed border-[#1a1a1a]/5 rounded-[2.5rem]">
            <p className="text-[#1a1a1a]/30 font-black uppercase tracking-[0.2em] italic">Brak komentarzy. Bądź pierwszy!</p>
          </div>
        )}

        {comments.map((comment: any) => (
          <div key={comment.id} className="space-y-6">
            <div className="group flex gap-6 items-start animate-in fade-in slide-in-from-bottom-8 duration-700 bg-white/50 p-6 rounded-[2rem] hover:bg-white transition-colors border border-transparent hover:border-[#1a1a1a]/5">
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
                    onClick={() => userProfile && likeMutation.mutate(comment.id)}
                    disabled={!userProfile || likeMutation.isPending}
                    className={cn(
                      "flex items-center gap-2 transition-all hover:scale-110",
                      comment.isLiked ? "text-primary" : "text-[#1a1a1a]/30 hover:text-primary"
                    )}
                  >
                    <Heart size={20} className={cn(comment.isLiked && "fill-primary")} />
                    <span className="text-xs font-black tracking-widest">{comment._count?.likes || 0}</span>
                  </button>
                  <button
                    onClick={() => userProfile && setReplyTo(comment.id)}
                    className="flex items-center gap-2 text-[#1a1a1a]/30 hover:text-[#1a1a1a]/60 transition-all hover:scale-110"
                  >
                    <MessageSquare size={20} />
                    <span className="text-xs font-black tracking-widest">{comment._count?.replies || 0}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* NESTED REPLIES */}
            {comment.replies && comment.replies.length > 0 && (
              <div className="pl-20 space-y-4">
                {comment.replies.map((reply: any) => (
                  <div key={reply.id} className="flex gap-4 items-start bg-white/30 p-4 rounded-2xl border border-transparent hover:border-[#1a1a1a]/5 transition-all">
                    <div className="w-10 h-10 rounded-xl bg-[#1a1a1a]/5 flex items-center justify-center shrink-0 border border-[#1a1a1a]/5">
                      <span className="font-black text-[#1a1a1a]/40 text-sm uppercase">{(reply.author?.email?.[0] || 'U')}</span>
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="font-black text-[#1a1a1a] uppercase tracking-tighter text-sm">{reply.author?.email?.split('@')[0] || 'Użytkownik'}</span>
                        <span className="text-[8px] opacity-30">•</span>
                        <span className="text-[10px] font-black text-[#1a1a1a]/30 italic">
                          {isClient && reply.createdAt && !isNaN(new Date(reply.createdAt).getTime())
                            ? formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true, locale: pl })
                            : 'niedawno'}
                        </span>
                      </div>
                      <p className="text-[#1a1a1a]/60 font-serif text-lg leading-relaxed italic">
                        {reply.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
