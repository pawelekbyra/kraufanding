"use client";

import React, { useState, useEffect } from 'react';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import { pl } from 'date-fns/locale';
import { Heart, MessageSquare, ArrowUp, Loader2, Smile, ImageIcon, CornerDownRight, ThumbsUp, ThumbsDown, MoreVertical, Trash2 } from 'lucide-react';
import { SignInButton, useAuth, useUser } from '@clerk/nextjs';
import Image from 'next/image';
import { DEFAULT_AVATAR_URL } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface EmbeddedCommentsProps {
  userProfile?: {
    id: string;
    email: string;
    imageUrl?: string | null;
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
  userProfile: initialUserProfile,
  entityId,
  entityType = 'PROJECT',
  showMocks = false
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
    <div className="space-y-6 max-w-4xl prose bg-white p-6 rounded-none border-2 border-black shadow-brutalist font-mono">
      <div className="flex items-center gap-6 mb-4 border-b-2 border-black border-dashed pb-4">
         <h3 className="text-[16px] font-black text-[#0f0f0f] leading-none uppercase tracking-tighter bg-black text-white px-2 py-0.5">{comments.length} FEEDBACK_NODES</h3>
         <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:bg-primary/20 px-2 py-1 border-2 border-black shadow-brutalist-sm transition-all active:shadow-none active:translate-x-[1px] active:translate-y-[1px]">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M3 4h18M6 12h12m-9 8h6" strokeLinecap="round" strokeLinejoin="round"/></svg>
            SORT_PROTOCOL
         </button>
      </div>

      {/* Input Area */}
      <div className="flex gap-4 items-start mb-8 bg-[#FDFBF7] p-4 border-2 border-black border-dashed">
        <div className="w-10 h-10 rounded-none bg-white border-2 border-black flex items-center justify-center shrink-0 overflow-hidden shadow-brutalist-sm">
           {userProfile ? (
             <img
               src={userProfile.imageUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userProfile.email}`}
               alt="Avatar"
               className="w-full h-full object-cover"
             />
           ) : (
             <Smile size={20} className="text-[#606060]" />
           )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="relative">
            {replyTo && (
              <div className="flex items-center gap-2 text-[10px] font-black text-white bg-black px-3 py-1 rounded-none w-fit mb-2 uppercase">
                <CornerDownRight size={12} />
                REPLY_MODE
                <button onClick={() => setReplyTo(null)} className="ml-2 hover:text-primary">✕</button>
              </div>
            )}
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onFocus={() => setIsInputFocused(true)}
              placeholder={replyTo ? "ENTER_REPLY..." : "ENTER_FEEDBACK..."}
              className="w-full bg-white text-[#0f0f0f] focus:outline-none text-[13px] border-2 border-black px-3 py-2 focus:bg-primary/5 transition-all resize-none min-h-[4rem] font-bold"
              onClick={() => !userProfile && document.getElementById('signin-trigger')?.click()}
            />
          </div>

          {(isInputFocused || newComment.trim() || replyTo) && (
            <div className="flex justify-end gap-3 mt-3 animate-in fade-in slide-in-from-top-1 duration-200">
               <button
                 onClick={() => {setNewComment(''); setReplyTo(null); setIsInputFocused(false);}}
                 className="text-[11px] font-black text-[#0f0f0f] hover:bg-black/5 px-4 py-1 border-2 border-black shadow-brutalist-sm transition-all active:shadow-none active:translate-x-[1px] active:translate-y-[1px] uppercase"
               >
                 CANCEL
               </button>

               {userProfile ? (
                  <button
                    onClick={handleSubmit}
                    disabled={!newComment.trim() || postMutation.isPending}
                    className={cn(
                        "px-6 py-1 border-2 border-black text-[11px] font-black transition-all uppercase shadow-brutalist-sm active:shadow-none active:translate-x-[1px] active:translate-y-[1px]",
                        newComment.trim()
                            ? "bg-black text-white hover:bg-neutral"
                            : "bg-white text-black/30 cursor-not-allowed"
                    )}
                  >
                    {postMutation.isPending ? <Loader2 className="animate-spin" size={14} /> : (replyTo ? 'SUBMIT_REPLY' : 'SUBMIT_FEEDBACK')}
                  </button>
               ) : (
                  <SignInButton mode="modal">
                     <button className="bg-black text-white px-6 py-1 border-2 border-black text-[11px] font-black hover:bg-neutral transition-all uppercase shadow-brutalist-sm active:shadow-none active:translate-x-[1px] active:translate-y-[1px]">AUTH_CONNECT</button>
                  </SignInButton>
               )}
            </div>
          )}
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-8">
        {comments.map((comment: any) => (
          <div key={comment.id} className="space-y-3 bg-white p-4 border-2 border-black shadow-brutalist-sm">
            <div className="flex gap-3 items-start group/comment">
               <div className="w-9 h-9 rounded-none border-2 border-black flex items-center justify-center shrink-0 overflow-hidden shadow-brutalist-sm bg-white">
                  <img
                    src={comment.author?.imageUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.authorName || comment.author?.email}`}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
               </div>
              <div className="flex-1 space-y-1 min-w-0">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="font-black text-[#0f0f0f] text-[12px] uppercase">ID: {comment.authorName || 'ANONYMOUS'}</span>
                        <span className="text-[10px] text-black/40 font-bold uppercase tracking-tighter">
                            {isClient && comment.createdAt && !isNaN(new Date(comment.createdAt).getTime())
                            ? formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale: pl })
                            : isClient ? 'RECENT' : ''}
                        </span>
                    </div>
                    {userProfile?.id === comment.authorId && (
                        <button
                          onClick={() => confirm('DELETE_NODE?') && deleteMutation.mutate(comment.id)}
                          className="opacity-0 group-hover/comment:opacity-100 transition-opacity p-1 bg-error/10 hover:bg-error hover:text-white border border-black shadow-brutalist-sm"
                        >
                            <Trash2 size={10} />
                        </button>
                    )}
                </div>
                <p className="text-[#0f0f0f] text-[13px] leading-relaxed font-bold antialiased border-l-4 border-black/5 pl-3 py-1">
                  {comment.text}
                </p>
                <div className="flex items-center gap-4 pt-2">
                  <button
                    onClick={() => userProfile && likeMutation.mutate(comment.id)}
                    className={cn(
                      "flex items-center gap-1.5 transition-all group px-2 py-0.5 border border-black shadow-brutalist-sm active:shadow-none active:translate-x-[1px] active:translate-y-[1px]",
                      comment.isLiked ? "bg-primary/20" : "bg-white hover:bg-black/5"
                    )}
                  >
                    <ThumbsUp size={12} className={cn(comment.isLiked && "fill-black")} />
                    <span className="text-[11px] font-black">{comment._count?.likes || 0}</span>
                  </button>
                  {!comment.id.toString().startsWith('mock') && (
                    <button
                        onClick={() => userProfile && setReplyTo(comment.id)}
                        className="text-[10px] font-black text-[#0f0f0f] hover:bg-primary/10 border border-black px-3 py-0.5 shadow-brutalist-sm active:shadow-none active:translate-x-[1px] active:translate-y-[1px] transition-all uppercase"
                    >
                        REPLY_NODE
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* NESTED REPLIES */}
            {comment.replies && comment.replies.length > 0 && (
              <div className="pl-10 space-y-4 border-l-2 border-black border-dashed mt-4">
                 <div className="text-[10px] font-black text-black/40 uppercase tracking-widest mb-2 pl-4">
                    LINKED_REPLIES: {comment.replies.length}
                 </div>
                {comment.replies.map((reply: any) => (
                  <div key={reply.id} className="flex gap-2.5 items-start pl-4 bg-black/5 p-2 border border-black shadow-brutalist-sm">
                    <div className="w-7 h-7 rounded-none border border-black flex items-center justify-center shrink-0 overflow-hidden bg-white">
                       <img
                         src={reply.author?.imageUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${reply.author?.email || reply.authorName}`}
                         alt="Avatar"
                         className="w-full h-full object-cover"
                       />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-[#0f0f0f] text-[11px] uppercase">ID: {reply.authorName || reply.author?.email?.split('@')[0] || 'ANONYMOUS'}</span>
                        <span className="text-[9px] text-black/40 font-bold uppercase">
                          {isClient && reply.createdAt && !isNaN(new Date(reply.createdAt).getTime())
                            ? formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true, locale: pl })
                            : 'RECENT'}
                        </span>
                      </div>
                      <p className="text-[#0f0f0f] text-[12px] leading-relaxed font-bold">
                        {reply.text}
                      </p>
                      <div className="flex items-center gap-3 pt-1">
                        <button
                          onClick={() => userProfile && likeMutation.mutate(reply.id)}
                          className={cn(
                            "flex items-center gap-1 transition-all group px-1.5 py-0.5 border border-black shadow-brutalist-sm active:shadow-none active:translate-x-[1px] active:translate-y-[1px]",
                            reply.isLiked ? "bg-primary/20" : "bg-white hover:bg-black/5"
                          )}
                        >
                            <ThumbsUp size={11} className={cn(reply.isLiked && "fill-black")} />
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
