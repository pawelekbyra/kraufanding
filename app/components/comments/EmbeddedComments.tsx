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
    <div className="space-y-6 max-w-4xl prose bg-transparent p-0 rounded-none border-none">
      <div className="flex items-center gap-6 mb-8">
         <h3 className="text-[20px] font-bold text-slate-900 leading-none font-serif">{comments.length} komentarzy</h3>
         <button className="flex items-center gap-2 text-[12px] font-bold text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-widest">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M3 4h18M6 12h12m-9 8h6" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Sortuj
         </button>
      </div>

      {/* Input Area */}
      <div className="flex gap-4 items-start mb-10 bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
        <div className="w-10 h-10 rounded-full bg-[#1a1a1a]/5 flex items-center justify-center shrink-0 overflow-hidden">
           {userProfile ? (
             <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userProfile.email}`} alt="Avatar" className="w-full h-full" />
           ) : (
             <Smile size={20} className="text-[#606060]" />
           )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="relative">
            {replyTo && (
              <div className="flex items-center gap-2 text-[11px] font-bold text-[#0f0f0f] bg-[#000000]/5 px-3 py-1 rounded-full w-fit mb-2">
                <CornerDownRight size={12} />
                Odpowiadasz
                <button onClick={() => setReplyTo(null)} className="ml-2 hover:opacity-60">✕</button>
              </div>
            )}
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onFocus={() => setIsInputFocused(true)}
              placeholder={replyTo ? "Dodaj odpowiedź..." : "Dodaj komentarz..."}
              className="w-full bg-transparent text-[#0f0f0f] focus:outline-none text-[14px] border-b border-[#000000]/10 focus:border-b-2 focus:border-[#0f0f0f] transition-all resize-none py-1 min-h-[1.5rem]"
              onClick={() => !userProfile && document.getElementById('signin-trigger')?.click()}
            />
          </div>

          {(isInputFocused || newComment.trim() || replyTo) && (
            <div className="flex justify-end gap-2 mt-2 animate-in fade-in slide-in-from-top-1 duration-200">
               <button
                 onClick={() => {setNewComment(''); setReplyTo(null); setIsInputFocused(false);}}
                 className="text-[14px] font-bold text-[#0f0f0f] hover:bg-[#000000]/10 px-4 py-2 rounded-full transition-all"
               >
                 Anuluj
               </button>

               {userProfile ? (
                  <button
                    onClick={handleSubmit}
                    disabled={!newComment.trim() || postMutation.isPending}
                    className={cn(
                        "px-4 py-2 rounded-full text-[14px] font-bold transition-all",
                        newComment.trim()
                            ? "bg-[#065fd4] text-white hover:bg-[#0556bf]"
                            : "bg-[#000000]/5 text-[#606060] cursor-not-allowed"
                    )}
                  >
                    {postMutation.isPending ? <Loader2 className="animate-spin" size={14} /> : (replyTo ? 'Odpowiedz' : 'Skomentuj')}
                  </button>
               ) : (
                  <SignInButton mode="modal">
                     <button className="bg-[#065fd4] text-white px-4 py-2 rounded-full text-[14px] font-bold hover:bg-[#0556bf] transition-all">Zaloguj się</button>
                  </SignInButton>
               )}
            </div>
          )}
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-6">
        {comments.map((comment: any) => (
          <div key={comment.id} className="space-y-3">
            <div className="flex gap-3 items-start group/comment">
               <div className="w-9 h-9 rounded-full bg-[#1a1a1a]/5 flex items-center justify-center shrink-0 overflow-hidden">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.authorName || comment.author?.email}`} alt="Avatar" />
               </div>
              <div className="flex-1 space-y-0.5 min-w-0">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900 text-[13px]">@{comment.authorName || 'Użytkownik'}</span>
                        <span className="text-[11px] text-slate-400">
                            {isClient && comment.createdAt && !isNaN(new Date(comment.createdAt).getTime())
                            ? formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale: pl })
                            : isClient ? 'niedawno' : ''}
                        </span>
                    </div>
                    {userProfile?.id === comment.authorId && (
                        <button
                          onClick={() => confirm('Usunąć komentarz?') && deleteMutation.mutate(comment.id)}
                          className="opacity-0 group-hover/comment:opacity-40 hover:!opacity-100 transition-opacity p-1"
                        >
                            <Trash2 size={12} className="text-error" />
                        </button>
                    )}
                </div>
                <p className="text-slate-700 text-[14px] leading-relaxed">
                  {comment.text}
                </p>
                <div className="flex items-center gap-3 pt-0.5">
                  <button
                    onClick={() => userProfile && likeMutation.mutate(comment.id)}
                    className={cn(
                      "flex items-center gap-1 transition-all group",
                      comment.isLiked ? "text-primary" : "text-[#606060] hover:text-[#0f0f0f]"
                    )}
                  >
                    <ThumbsUp size={13} className={cn(comment.isLiked && "fill-primary")} />
                    <span className="text-[11px] font-normal">{comment._count?.likes || 0}</span>
                  </button>
                  <button className="text-[#606060] hover:text-[#0f0f0f] transition-all">
                    <ThumbsDown size={13} />
                  </button>
                  {!comment.id.toString().startsWith('mock') && (
                    <button
                        onClick={() => userProfile && setReplyTo(comment.id)}
                        className="text-[11px] font-bold text-[#0f0f0f] hover:bg-[#000000]/10 px-2.5 py-0.5 rounded-full ml-1 transition-all"
                    >
                        Odpowiedz
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* NESTED REPLIES */}
            {comment.replies && comment.replies.length > 0 && (
              <div className="pl-12 space-y-3">
                 <button className="text-[11px] font-black text-primary uppercase tracking-widest flex items-center gap-2 mb-2">
                    <div className="w-3 h-[1.5px] bg-primary/30"></div>
                    Pokaż {comment.replies.length} odpowiedzi
                 </button>
                {comment.replies.map((reply: any) => (
                  <div key={reply.id} className="flex gap-2.5 items-start">
                    <div className="w-6 h-6 rounded-full bg-[#1a1a1a]/5 flex items-center justify-center shrink-0 overflow-hidden">
                       <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${reply.author?.email || reply.authorName}`} alt="Avatar" />
                    </div>
                    <div className="flex-1 space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-[#0f0f0f] text-[11px]">@{reply.authorName || reply.author?.email?.split('@')[0] || 'Użytkownik'}</span>
                        <span className="text-[10px] text-[#606060]">
                          {isClient && reply.createdAt && !isNaN(new Date(reply.createdAt).getTime())
                            ? formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true, locale: pl })
                            : 'niedawno'}
                        </span>
                      </div>
                      <p className="text-[#0f0f0f] text-[13px] leading-relaxed">
                        {reply.text}
                      </p>
                      <div className="flex items-center gap-3 pt-0.5">
                        <button
                          onClick={() => userProfile && likeMutation.mutate(reply.id)}
                          className={cn(
                            "flex items-center gap-1 transition-all group",
                            reply.isLiked ? "text-primary" : "text-[#606060] hover:text-[#0f0f0f]"
                          )}
                        >
                            <ThumbsUp size={12} className={cn(reply.isLiked && "fill-primary")} />
                            <span className="text-[10px] font-normal">{reply._count?.likes || 0}</span>
                        </button>
                        <button className="text-[#606060] hover:text-[#0f0f0f] transition-all">
                            <ThumbsDown size={12} />
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
          <div className="pt-6 flex justify-center">
            <button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="btn btn-ghost text-[#1a1a1a]/40 font-black uppercase tracking-widest text-[10px] hover:bg-transparent hover:text-primary transition-colors"
            >
              {isFetchingNextPage ? <Loader2 className="animate-spin" /> : 'Pokaż więcej'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmbeddedComments;
