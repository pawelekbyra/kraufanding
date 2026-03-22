"use client";

import React, { useState, useEffect } from 'react';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import { pl } from 'date-fns/locale';
import { Heart, MessageSquare, ArrowUp, Loader2, Smile, ImageIcon, CornerDownRight, ThumbsUp, ThumbsDown } from 'lucide-react';
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

  const apiComments = data?.pages?.flatMap((page) => page.comments || []) ?? [];
  const comments = [...apiComments, ...MOCK_COMMENTS];

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
        if (commentId.startsWith('mock')) return { success: true };
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
    <div className="space-y-12 max-w-4xl prose-lg bg-[#FDFBF7] p-8 rounded-[2rem] border border-[#1a1a1a]/5">
      <div className="flex items-end gap-8 mb-8">
         <h3 className="text-xl font-black text-[#1a1a1a] uppercase tracking-widest leading-none">{comments.length} komentarzy</h3>
         <button className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity pb-0.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M3 4h18M6 12h12m-9 8h6" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Sortuj według
         </button>
      </div>

      {/* Input Area */}
      <div className="flex gap-4 items-start mb-12">
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0 border border-primary/10">
           {userProfile ? (
             <span className="font-black text-primary text-lg uppercase">{userProfile.email.charAt(0)}</span>
           ) : (
             <Smile size={20} className="text-primary/40" />
           )}
        </div>
        <div className="flex-1 space-y-4">
          <div className="relative group">
            {replyTo && (
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary bg-primary/5 px-4 py-2 rounded-full w-fit mb-2">
                <CornerDownRight size={14} />
                Odpowiadasz na komentarz
                <button onClick={() => setReplyTo(null)} className="ml-2 hover:text-primary/70">✕</button>
              </div>
            )}
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={replyTo ? "Dodaj publiczną odpowiedź..." : "Dodaj komentarz..."}
              className="w-full bg-transparent text-[#1a1a1a] focus:outline-none text-base border-b border-[#1a1a1a]/10 focus:border-[#1a1a1a] transition-colors resize-none py-2 font-serif italic"
              onClick={() => !userProfile && document.getElementById('signin-trigger')?.click()}
            />
          </div>

          <div className="flex justify-end gap-3 items-center">
             <button onClick={() => {setNewComment(''); setReplyTo(null);}} className="text-xs font-black uppercase tracking-widest opacity-40 hover:opacity-100 px-4 py-2 transition-all">Anuluj</button>
             {userProfile ? (
               <button
                 onClick={handleSubmit}
                 disabled={!newComment.trim() || postMutation.isPending}
                 className="bg-[#1a1a1a] text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest disabled:opacity-20 transition-all hover:bg-primary shadow-lg"
               >
                 {postMutation.isPending ? <Loader2 className="animate-spin" size={14} /> : (replyTo ? 'Odpowiedz' : 'Skomentuj')}
               </button>
             ) : (
                <SignInButton mode="modal">
                   <button id="signin-trigger" className="bg-[#1a1a1a]/5 text-[#1a1a1a] px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest hover:bg-[#1a1a1a]/10 transition-all">Skomentuj</button>
                </SignInButton>
             )}
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-8">
        {comments.map((comment: any) => (
          <div key={comment.id} className="space-y-4">
            <div className="flex gap-4 items-start">
               <div className="w-10 h-10 rounded-full bg-[#1a1a1a]/5 flex items-center justify-center shrink-0 overflow-hidden">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.authorName || comment.author?.email}`} alt="Avatar" />
               </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-black text-[#1a1a1a] uppercase text-xs">@{comment.authorName || 'Użytkownik'}</span>
                  <span className="text-[10px] font-bold text-[#1a1a1a]/30 italic">
                    {isClient && comment.createdAt && !isNaN(new Date(comment.createdAt).getTime())
                      ? formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale: pl })
                      : isClient ? 'niedawno' : ''}
                  </span>
                </div>
                <p className="text-[#1a1a1a] font-serif text-[17px] leading-relaxed italic">
                  {comment.text}
                </p>
                <div className="flex items-center gap-4 pt-1">
                  <button
                    onClick={() => userProfile && likeMutation.mutate(comment.id)}
                    className={cn(
                      "flex items-center gap-1 transition-all group",
                      comment.isLiked ? "text-primary" : "text-[#1a1a1a]/40"
                    )}
                  >
                    <ThumbsUp size={14} className={cn(comment.isLiked && "fill-primary")} />
                    <span className="text-[10px] font-black">{comment._count?.likes || 0}</span>
                  </button>
                  <button className="text-[#1a1a1a]/40 hover:text-[#1a1a1a] transition-all">
                    <ThumbsDown size={14} />
                  </button>
                  <button
                    onClick={() => userProfile && setReplyTo(comment.id)}
                    className="text-[10px] font-black uppercase tracking-widest text-[#1a1a1a]/60 hover:text-[#1a1a1a] ml-4"
                  >
                    Odpowiedz
                  </button>
                </div>
              </div>
            </div>

            {/* NESTED REPLIES */}
            {comment.replies && comment.replies.length > 0 && (
              <div className="pl-14 space-y-4">
                 <button className="text-xs font-black text-primary uppercase tracking-widest flex items-center gap-2 mb-4">
                    <div className="w-4 h-[2px] bg-primary/30"></div>
                    Pokaż {comment.replies.length} odpowiedzi
                 </button>
                {comment.replies.map((reply: any) => (
                  <div key={reply.id} className="flex gap-3 items-start">
                    <div className="w-6 h-6 rounded-full bg-[#1a1a1a]/5 flex items-center justify-center shrink-0 overflow-hidden">
                       <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${reply.author?.email}`} alt="Avatar" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-[#1a1a1a] uppercase text-[10px]">@{reply.author?.email?.split('@')[0] || 'Użytkownik'}</span>
                        <span className="text-[9px] font-bold text-[#1a1a1a]/30 italic">
                          {isClient && reply.createdAt && !isNaN(new Date(reply.createdAt).getTime())
                            ? formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true, locale: pl })
                            : 'niedawno'}
                        </span>
                      </div>
                      <p className="text-[#1a1a1a]/80 font-serif text-[15px] leading-relaxed italic">
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
          <div className="pt-8 flex justify-center">
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
