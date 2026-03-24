"use client";

import React, { useState, useEffect } from 'react';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import { pl } from 'date-fns/locale';
import { Heart, MessageSquare, ArrowUp, Loader2, Smile, ImageIcon, CornerDownRight, ThumbsUp, ThumbsDown, MoreVertical, Trash2, Lock } from 'lucide-react';
import { SignInButton, useAuth, useUser } from '@clerk/nextjs';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface EmbeddedCommentsProps {
  userProfile?: {
    id: string;
    email: string;
    imageUrl?: string | null;
  } | null;
  videoId: string;
}

const EmbeddedComments: React.FC<EmbeddedCommentsProps> = ({
  userProfile: initialUserProfile,
  videoId
}) => {
  const queryClient = useQueryClient();
  const { isSignedIn, userId } = useAuth();
  const { user } = useUser();

  const userProfile = isSignedIn ? {
    id: userId!,
    email: user?.primaryEmailAddress?.emailAddress || '',
    imageUrl: user?.imageUrl || null
  } : null;

  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['comments', videoId],
    queryFn: async ({ pageParam }) => {
        const url = new URL('/api/comments', window.location.origin);
        url.searchParams.append('videoId', videoId);
        if (pageParam) url.searchParams.append('cursor', pageParam as string);
        const res = await fetch(url.toString());
        return res.json();
    },
    initialPageParam: '',
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled: !!videoId,
  });

  const comments = data?.pages?.flatMap((page) => page.comments || []) ?? [];

  const postMutation = useMutation({
    mutationFn: async ({ text, parentId }: { text: string; parentId?: string }) => {
        const res = await fetch('/api/comments', {
            method: 'POST',
            body: JSON.stringify({ videoId, text, parentId }),
            headers: { 'Content-Type': 'application/json' }
        });
        return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', videoId] });
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
        await queryClient.cancelQueries({ queryKey: ['comments', videoId] });
        const previousData = queryClient.getQueryData(['comments', videoId]);

        queryClient.setQueryData(['comments', videoId], (old: any) => {
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
            queryClient.setQueryData(['comments', videoId], context.previousData);
        }
    },
    onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ['comments', videoId] });
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
        queryClient.invalidateQueries({ queryKey: ['comments', videoId] });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !userProfile) return;
    postMutation.mutate({ text: newComment, parentId: replyTo || undefined });
  };

  return (
    <div className="space-y-6 max-w-4xl prose bg-white p-0 rounded-none border-none font-serif">
      <div className="flex items-center gap-6 mb-4">
         <h3 className="text-[18px] font-bold text-[#0f0f0f] leading-none uppercase tracking-tighter italic">{comments.length} Komentarzy</h3>
      </div>

      {/* Input Area */}
      {userProfile ? (
        <div className="flex gap-4 items-start mb-6">
          <div className="w-10 h-10 rounded-full bg-[#1a1a1a]/5 flex items-center justify-center shrink-0 overflow-hidden border border-[#1a1a1a]/10">
             <img
               src={userProfile.imageUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userProfile.email}`}
               alt="Avatar"
               className="w-full h-full object-cover"
             />
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
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-[#1a1a1a]/5 rounded-xl p-6 flex flex-col items-center justify-center text-center space-y-4 border-2 border-dashed border-[#1a1a1a]/10 mb-8">
           <div className="p-3 bg-white rounded-full shadow-sm">
              <Lock size={24} className="text-[#1a1a1a]/40" />
           </div>
           <div className="space-y-1">
              <h4 className="text-[16px] font-black uppercase tracking-tight italic">Chcesz dołączyć do dyskusji?</h4>
              <p className="text-[12px] text-[#1a1a1a]/60 font-bold uppercase tracking-widest">Zaloguj się, aby dodawać komentarze i lajkować.</p>
           </div>
           <SignInButton mode="modal">
              <button className="btn btn-sm bg-[#1a1a1a] text-[#FDFBF7] hover:bg-primary border-none rounded-full px-8 h-10 font-black tracking-widest transition-all">
                ZALOGUJ SIĘ
              </button>
           </SignInButton>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-6">
        {comments.map((comment: any) => (
          <div key={comment.id} className="space-y-3">
            <div className="flex gap-3 items-start group/comment">
               <div className="w-9 h-9 rounded-full bg-[#1a1a1a]/5 flex items-center justify-center shrink-0 overflow-hidden border border-[#1a1a1a]/5">
                  <img
                    src={comment.author?.imageUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.author?.email}`}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
               </div>
              <div className="flex-1 space-y-0.5 min-w-0">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                        <span className="font-bold text-[#0f0f0f] text-[12px]">@{comment.author?.email.split('@')[0]}</span>
                        <span className="text-[11px] text-[#606060]">
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
                <p className="text-[#0f0f0f] text-[13px] leading-relaxed">
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
                  <button
                      onClick={() => userProfile && setReplyTo(comment.id)}
                      className="text-[11px] font-bold text-[#0f0f0f] hover:bg-[#000000]/10 px-2.5 py-0.5 rounded-full ml-1 transition-all"
                  >
                      Odpowiedz
                  </button>
                </div>
              </div>
            </div>

            {/* NESTED REPLIES */}
            {comment.replies && comment.replies.length > 0 && (
              <div className="pl-12 space-y-3">
                {comment.replies.map((reply: any) => (
                  <div key={reply.id} className="flex gap-2.5 items-start">
                    <div className="w-6 h-6 rounded-full bg-[#1a1a1a]/5 flex items-center justify-center shrink-0 overflow-hidden border border-[#1a1a1a]/5">
                       <img
                         src={reply.author?.imageUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${reply.author?.email}`}
                         alt="Avatar"
                         className="w-full h-full object-cover"
                       />
                    </div>
                    <div className="flex-1 space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-[#0f0f0f] text-[11px]">@{reply.author?.email?.split('@')[0] || 'Użytkownik'}</span>
                        <span className="text-[10px] text-[#606060]">
                          {isClient && reply.createdAt && !isNaN(new Date(reply.createdAt).getTime())
                            ? formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true, locale: pl })
                            : 'niedawno'}
                        </span>
                      </div>
                      <p className="text-[#0f0f0f] text-[13px] leading-relaxed">
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
