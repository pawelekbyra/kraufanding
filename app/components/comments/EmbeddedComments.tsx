"use client";

import React, { useState, useEffect } from 'react';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import { pl } from 'date-fns/locale';
import { Heart, MessageSquare, ArrowUp, Loader2, Smile, ImageIcon, CornerDownRight, ThumbsUp, ThumbsDown, MoreVertical, Trash2, Lock } from 'lucide-react';
import { SignInButton, useAuth, useUser } from '@clerk/nextjs';
import { cn } from '@/lib/utils';
import { useLanguage } from '../LanguageContext';

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
  const { t, language } = useLanguage();
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
                            const wasLiked = c.isLiked;
                            const wasDisliked = c.isDisliked;
                            return {
                                ...c,
                                isLiked: !wasLiked,
                                isDisliked: false,
                                _count: {
                                    ...c._count,
                                    likes: wasLiked ? Math.max(0, c._count.likes - 1) : c._count.likes + 1,
                                    dislikes: wasDisliked ? Math.max(0, c._count.dislikes - 1) : c._count.dislikes
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

  const dislikeMutation = useMutation({
    mutationFn: async (commentId: string) => {
        const res = await fetch('/api/comments/dislike', {
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
                            const wasLiked = c.isLiked;
                            const wasDisliked = c.isDisliked;
                            return {
                                ...c,
                                isLiked: false,
                                isDisliked: !wasDisliked,
                                _count: {
                                    ...c._count,
                                    likes: wasLiked ? Math.max(0, c._count.likes - 1) : c._count.likes,
                                    dislikes: wasDisliked ? Math.max(0, c._count.dislikes - 1) : c._count.dislikes + 1
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

  const getCommentsLabel = (count: number) => {
    if (language === 'pl') {
      if (count === 1) return 'Komentarz';
      return 'Komentarze';
    }
    return t.comments;
  };

  return (
    <div className="space-y-6 max-w-4xl prose bg-transparent p-0 rounded-none border-none font-serif">
      <div className="flex items-center gap-6 mb-4">
         <h3 className="text-[18px] font-bold text-ink leading-none uppercase tracking-tighter italic">{comments.length} {getCommentsLabel(comments.length)}</h3>
      </div>

      {/* Input Area */}
      <div className="flex gap-4 items-start mb-10">
        <div className="w-10 h-10 rounded-none bg-bone flex items-center justify-center shrink-0 overflow-hidden border border-ink/10">
           <img
             src={userProfile?.imageUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=Guest`}
             alt="Avatar"
             className="w-full h-full object-cover grayscale opacity-60"
           />
        </div>
        <div className="flex-1 min-w-0">
          <div className="relative">
            {replyTo && userProfile && (
              <div className="flex items-center gap-2 text-[11px] font-bold text-ink bg-bone/50 px-3 py-1 rounded-none border border-ink/5 w-fit mb-2">
                <CornerDownRight size={12} />
                {t.replying}
                <button onClick={() => setReplyTo(null)} className="ml-2 hover:opacity-60">✕</button>
              </div>
            )}
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onFocus={() => setIsInputFocused(true)}
              placeholder={replyTo ? t.addReply : t.addComment}
              className="w-full bg-transparent text-ink focus:outline-none text-[14px] border-b border-ink/10 focus:border-ink/40 transition-all resize-none py-1 min-h-[1.5rem] font-sans"
            />
          </div>

          {(isInputFocused || newComment.trim() || replyTo) && (
            <div className="flex justify-end gap-2 mt-2 animate-in fade-in slide-in-from-top-1 duration-200">
               <button
                 onClick={() => {setNewComment(''); setReplyTo(null); setIsInputFocused(false);}}
                 className="text-[12px] font-bold text-ink/40 hover:text-ink px-4 py-2 rounded-none transition-all font-mono uppercase tracking-widest"
               >
                   {t.cancel}
               </button>

                {userProfile ? (
                  <button
                    onClick={handleSubmit}
                    disabled={!newComment.trim() || postMutation.isPending}
                    className={cn(
                        "px-6 py-2 rounded-none text-[12px] font-bold transition-all uppercase tracking-widest font-mono",
                        newComment.trim()
                            ? "bg-ink text-linen hover:bg-oxblood"
                            : "bg-ink/5 text-ink/20 cursor-not-allowed border border-ink/5"
                    )}
                  >
                    {postMutation.isPending ? <Loader2 className="animate-spin" size={14} /> : (replyTo ? t.reply : t.comment)}
                  </button>
                ) : (
                  <SignInButton mode="modal">
                    <button className="px-6 py-2 rounded-none bg-ink text-linen hover:bg-oxblood text-[12px] font-bold transition-all uppercase tracking-widest font-mono">
                      {t.signIn}
                    </button>
                  </SignInButton>
                )}
            </div>
          )}
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-8">
        {comments.map((comment: any) => (
          <div key={comment.id} className="space-y-4">
            <div className="flex gap-4 items-start group/comment">
               <div className="w-10 h-10 rounded-none bg-bone flex items-center justify-center shrink-0 overflow-hidden border border-ink/5">
                  <img
                    src={comment.author?.imageUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.author?.email}`}
                    alt="Avatar"
                    className="w-full h-full object-cover grayscale opacity-60"
                  />
               </div>
              <div className="flex-1 space-y-1 min-w-0">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-ink text-[13px] font-mono">@{comment.author?.email.split('@')[0]}</span>
                        <span className="text-[11px] text-ink/30 italic">
                            {isClient && comment.createdAt && !isNaN(new Date(comment.createdAt).getTime())
                            ? formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale: pl })
                            : isClient ? 'niedawno' : ''}
                        </span>
                    </div>
                    {userProfile?.id === comment.authorId && (
                        <button
                          onClick={() => confirm(t.deleteComment) && deleteMutation.mutate(comment.id)}
                          className="opacity-0 group-hover/comment:opacity-40 hover:!opacity-100 transition-opacity p-1"
                        >
                            <Trash2 size={12} className="text-oxblood" />
                        </button>
                    )}
                </div>
                <p className="text-ink text-[14px] leading-relaxed font-sans opacity-90">
                  {comment.text}
                </p>
                <div className="flex items-center gap-4 pt-1 font-mono">
                  <button
                    onClick={() => userProfile && likeMutation.mutate(comment.id)}
                    className={cn(
                      "flex items-center gap-1.5 transition-all group",
                      comment.isLiked ? "text-oxblood" : "text-ink/30 hover:text-ink"
                    )}
                  >
                    <ThumbsUp size={13} className={cn(comment.isLiked && "fill-oxblood")} />
                    <span className="text-[11px] font-bold">{comment._count?.likes || 0}</span>
                  </button>
                  <button
                    onClick={() => userProfile && dislikeMutation.mutate(comment.id)}
                    className={cn(
                        "flex items-center gap-1.5 transition-all group",
                        comment.isDisliked ? "text-ink" : "text-ink/30 hover:text-ink"
                    )}
                  >
                    <ThumbsDown size={13} className={cn(comment.isDisliked && "fill-ink")} />
                    <span className="text-[11px] font-bold">{comment._count?.dislikes || 0}</span>
                  </button>
                  <button
                      onClick={() => userProfile && setReplyTo(comment.id)}
                      className="text-[11px] font-bold text-ink/40 hover:text-ink px-2 py-0.5 rounded-none ml-2 transition-all border border-transparent hover:border-ink/10 uppercase tracking-widest"
                  >
                      {t.reply}
                  </button>
                </div>
              </div>
            </div>

            {/* NESTED REPLIES */}
            {comment.replies && comment.replies.length > 0 && (
              <div className="pl-14 space-y-4 border-l border-ink/5 ml-5">
                {comment.replies.map((reply: any) => (
                  <div key={reply.id} className="flex gap-3 items-start">
                    <div className="w-7 h-7 rounded-none bg-bone flex items-center justify-center shrink-0 overflow-hidden border border-ink/5">
                       <img
                         src={reply.author?.imageUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${reply.author?.email}`}
                         alt="Avatar"
                         className="w-full h-full object-cover grayscale opacity-50"
                       />
                    </div>
                    <div className="flex-1 space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-ink text-[11px] font-mono">@{reply.author?.email?.split('@')[0] || 'Użytkownik'}</span>
                        <span className="text-[10px] text-ink/30 italic">
                          {isClient && reply.createdAt && !isNaN(new Date(reply.createdAt).getTime())
                            ? formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true, locale: pl })
                            : t.justNow}
                        </span>
                      </div>
                      <p className="text-ink text-[13px] leading-relaxed font-sans opacity-80">
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
          <div className="pt-10 flex justify-center">
            <button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="btn btn-ghost text-ink/30 font-bold uppercase tracking-[0.3em] text-[10px] hover:bg-transparent hover:text-ink transition-all border border-ink/5 hover:border-ink/20 px-10 font-mono"
            >
              {isFetchingNextPage ? <Loader2 className="animate-spin" /> : 'POKAŻ WIĘCEJ'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmbeddedComments;
