"use client";

import React, { useState, useEffect } from 'react';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import { pl } from 'date-fns/locale';
import { Heart, MessageSquare, ArrowUp, Loader2, Smile, ImageIcon, CornerDownRight, ThumbsUp, ThumbsDown, MoreVertical, Trash2 } from 'lucide-react';
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
  entityType?: 'PROJECT' | 'POST' | 'VIDEO';
  showMocks?: boolean;
}

const MOCK_COMMENTS = [
  {
    id: 'mock-1',
    authorName: 'Alex Innowator',
    text: 'Ten cover jest niesamowity! Czekałem na taką wersję od dawna. Produkcja na najwyższym poziomie.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    _count: { likes: 124, replies: 2 },
    isLiked: false,
    replies: [
        { id: 'mock-1-1', author: { email: 'fan@polutek.pl' }, text: 'Zgadzam się, wokal wgniata w fotel!', createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString() }
    ]
  },
  {
    id: 'mock-2',
    authorName: 'Marta Muzyk',
    text: 'Czysty profesjonalizm. Sekrety w sidebarze to świetny pomysł, już zostawiłam napiwek!',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    _count: { likes: 89, replies: 0 },
    isLiked: true,
  },
  {
    id: 'mock-3',
    authorName: 'Techno Freak',
    text: 'Czy planujesz wypuścić też wersję instrumentalną? Brzmi to bardzo obiecująco.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    _count: { likes: 12, replies: 1 },
    isLiked: false,
  }
];

const EmbeddedComments: React.FC<EmbeddedCommentsProps> = ({
  userProfile,
  entityId,
  entityType = 'PROJECT',
  showMocks = false
}) => {
  const queryClient = useQueryClient();
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [isInputFocused, setIsInputFocused] = useState(false);

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

  const apiComments = data?.pages?.flatMap((page) => page.comments || []) ?? [];
  const comments = showMocks ? [...apiComments, ...MOCK_COMMENTS] : apiComments;

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
        if (commentId.toString().startsWith('mock')) return { success: true };
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

  const deleteMutation = useMutation({
    mutationFn: async (commentId: string) => {
        const res = await fetch(`/api/comments?id=${commentId}`, {
            method: 'DELETE',
        });
        return res.json();
    },
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['comments', entityId, entityType] });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !userProfile) return;
    postMutation.mutate({ text: newComment, parentId: replyTo || undefined });
  };

  return (
    <div className="space-y-10 max-w-4xl prose bg-transparent p-0 rounded-none border-none">
      <div className="flex items-center gap-8 mb-8 border-b border-navy/5 pb-4">
         <h3 className="text-xl font-black text-navy uppercase tracking-widest font-serif">{comments.length} Komentarzy</h3>
         <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gold/60 hover:text-gold transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M3 4h18M6 12h12m-9 8h6" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Sortowanie
         </button>
      </div>

      {/* Input Area - ELEGANT CARDS */}
      <div className="flex gap-6 items-start mb-12 p-6 bg-navy/5 rounded-[2rem] border border-white relative overflow-hidden group">
        <div className="absolute inset-0 bg-white opacity-0 group-focus-within:opacity-40 transition-opacity duration-700"></div>
        <div className="w-12 h-12 rounded-full bg-white border border-gold/20 flex items-center justify-center shrink-0 overflow-hidden shadow-soft relative z-10">
           {userProfile ? (
             <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userProfile.email}`} alt="Avatar" className="w-full h-full" />
           ) : (
             <Smile size={24} className="text-navy/20" />
           )}
        </div>
        <div className="flex-1 min-w-0 relative z-10">
          <div className="relative">
            {replyTo && (
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gold bg-gold/5 px-4 py-2 rounded-full w-fit mb-4 border border-gold/10">
                <CornerDownRight size={12} />
                Odpowiadasz
                <button onClick={() => setReplyTo(null)} className="ml-3 hover:text-navy transition-colors">✕</button>
              </div>
            )}
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onFocus={() => setIsInputFocused(true)}
              placeholder={replyTo ? "Podziel się myślami w odpowiedzi..." : "Zostaw swój ślad..."}
              className="w-full bg-transparent text-navy font-serif italic text-lg focus:outline-none placeholder:text-navy/20 transition-all resize-none py-2 min-h-[3rem] selection:bg-gold/20"
              onClick={() => !userProfile && document.getElementById('signin-trigger')?.click()}
            />
          </div>

          {(isInputFocused || newComment.trim() || replyTo) && (
            <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-navy/5 animate-in fade-in slide-in-from-top-1 duration-500">
               <button
                 onClick={() => {setNewComment(''); setReplyTo(null); setIsInputFocused(false);}}
                 className="text-[10px] font-black uppercase tracking-[0.2em] text-navy/40 hover:text-gold px-6 py-2 rounded-full transition-all"
               >
                 Anuluj
               </button>

               {userProfile ? (
                  <button
                    onClick={handleSubmit}
                    disabled={!newComment.trim() || postMutation.isPending}
                    className={cn(
                        "px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-soft",
                        newComment.trim()
                            ? "bg-gold text-white hover:bg-gold/90 hover:shadow-glow"
                            : "bg-navy/5 text-navy/20 cursor-not-allowed border border-navy/5"
                    )}
                  >
                    {postMutation.isPending ? <Loader2 className="animate-spin" size={14} /> : (replyTo ? 'Wyślij Odpowiedź' : 'Dodaj Komentarz')}
                  </button>
               ) : (
                  <SignInButton mode="modal">
                     <button className="bg-gold text-white px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-gold/90 transition-all shadow-soft">Zaloguj się</button>
                  </SignInButton>
               )}
            </div>
          )}
        </div>
      </div>

      {/* Comments List - REFINED TYPOGRAPHY */}
      <div className="space-y-12">
        {comments.map((comment: any) => (
          <div key={comment.id} className="space-y-6 animate-fade-in-up">
            <div className="flex gap-5 items-start group/comment">
               <div className="w-12 h-12 rounded-full bg-white border border-navy/5 flex items-center justify-center shrink-0 overflow-hidden shadow-soft group-hover/comment:border-gold/30 transition-colors">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.authorName || comment.author?.email}`} alt="Avatar" />
               </div>
              <div className="flex-1 space-y-2 min-w-0">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="font-black text-navy text-sm font-serif">@{comment.authorName || 'Anonim'}</span>
                        <div className="w-1 h-1 rounded-full bg-gold/30"></div>
                        <span className="text-[10px] font-bold text-navy/30 uppercase tracking-widest">
                            {isClient && comment.createdAt && !isNaN(new Date(comment.createdAt).getTime())
                            ? formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale: pl })
                            : isClient ? 'niedawno' : ''}
                        </span>
                    </div>
                    {userProfile?.id === comment.authorId && (
                        <button
                          onClick={() => confirm('Usunąć komentarz?') && deleteMutation.mutate(comment.id)}
                          className="opacity-0 group-hover/comment:opacity-40 hover:!opacity-100 transition-opacity p-2 bg-error/5 rounded-full"
                        >
                            <Trash2 size={14} className="text-error" />
                        </button>
                    )}
                </div>
                <p className="text-navy/80 text-lg font-serif italic leading-relaxed selection:bg-gold/20 px-1">
                  {comment.text}
                </p>
                <div className="flex items-center gap-4 pt-2">
                  <button
                    onClick={() => userProfile && likeMutation.mutate(comment.id)}
                    className={cn(
                      "flex items-center gap-2 transition-all p-1 px-3 rounded-full hover:bg-gold/5",
                      comment.isLiked ? "text-gold bg-gold/10" : "text-navy/40 hover:text-gold"
                    )}
                  >
                    <ThumbsUp size={14} className={cn(comment.isLiked && "fill-gold")} />
                    <span className="text-[11px] font-black">{comment._count?.likes || 0}</span>
                  </button>
                  <button className="text-navy/20 hover:text-gold transition-all p-2 rounded-full hover:bg-gold/5">
                    <ThumbsDown size={14} />
                  </button>
                  {!comment.id.toString().startsWith('mock') && (
                    <button
                        onClick={() => userProfile && setReplyTo(comment.id)}
                        className="text-[10px] font-black uppercase tracking-[0.2em] text-navy/40 hover:text-gold transition-all ml-2"
                    >
                        Odpowiedz
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* NESTED REPLIES - MORE MINIMAL */}
            {comment.replies && comment.replies.length > 0 && (
              <div className="pl-16 space-y-6 border-l-2 border-gold/10 ml-6">
                {comment.replies.map((reply: any) => (
                  <div key={reply.id} className="flex gap-4 items-start group/reply">
                    <div className="w-8 h-8 rounded-full bg-white border border-navy/5 flex items-center justify-center shrink-0 overflow-hidden shadow-soft group-hover/reply:border-gold/30 transition-colors">
                       <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${reply.author?.email || reply.authorName}`} alt="Avatar" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="font-black text-navy text-xs font-serif">@{reply.authorName || reply.author?.email?.split('@')[0] || 'Anonim'}</span>
                        <span className="text-[9px] font-bold text-navy/20 uppercase tracking-[0.2em]">
                          {isClient && reply.createdAt && !isNaN(new Date(reply.createdAt).getTime())
                            ? formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true, locale: pl })
                            : 'niedawno'}
                        </span>
                      </div>
                      <p className="text-navy/70 text-base font-serif italic leading-relaxed px-1">
                        {reply.text}
                      </p>
                      <div className="flex items-center gap-4 pt-1">
                        <button
                          onClick={() => userProfile && likeMutation.mutate(reply.id)}
                          className={cn(
                            "flex items-center gap-2 transition-all p-1 px-3 rounded-full hover:bg-gold/5",
                            reply.isLiked ? "text-gold bg-gold/10" : "text-navy/30 hover:text-gold"
                          )}
                        >
                            <ThumbsUp size={12} className={cn(reply.isLiked && "fill-gold")} />
                            <span className="text-[10px] font-black">{reply._count?.likes || 0}</span>
                        </button>
                      </div>
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
              className="text-[10px] font-black uppercase tracking-[0.3em] text-navy/30 hover:text-gold transition-colors py-4 px-12 border-y border-navy/5 hover:border-gold/20"
            >
              {isFetchingNextPage ? <Loader2 className="animate-spin" /> : 'Eksploruj więcej głosów'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmbeddedComments;
