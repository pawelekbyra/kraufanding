"use client";

import React, { useState, useEffect, useTransition } from 'react';
import { useAuth, useClerk } from '@clerk/nextjs';
import { cn } from '@/lib/utils';
import { toggleSubscriptionAction, getSubscriptionStatusAction } from '@/app/actions/subscription';
import { useLanguage } from './LanguageContext';

interface SubscribeButtonProps {
    creatorId: string;
    initialSubscribersCount: number;
    initialIsSubscribed?: boolean;
    className?: string;
}

export default function SubscribeButton({
    creatorId,
    initialSubscribersCount,
    initialIsSubscribed = false,
    className
}: SubscribeButtonProps) {
    const { t } = useLanguage();
    const { userId } = useAuth();
    const { openSignIn } = useClerk();
    const [isSubscribed, setIsSubscribed] = useState(initialIsSubscribed);
    const [subscribersCount, setSubscribersCount] = useState(initialSubscribersCount);
    const [isPending, startTransition] = useTransition();
    const [mounted, setMounted] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (userId && creatorId && initialIsSubscribed === undefined) {
            getSubscriptionStatusAction(creatorId)
                .then(data => setIsSubscribed(data.isSubscribed))
                .catch(err => console.error("Error fetching subscription status:", err));
        }

        // Reset state on logout
        if (!userId && mounted) {
            setIsSubscribed(false);
        }
    }, [userId, creatorId, initialIsSubscribed, mounted]);

    const handleSubscribe = async () => {
        if (!userId) {
            openSignIn();
            return;
        }
        if (!creatorId || isPending) return;

        if (!isSubscribed) {
            setShowConfirm(true);
            return;
        }

        executeSubscribe();
    };

    const executeSubscribe = async () => {
        const prevSubscribed = isSubscribed;

        // Optimistic UI state
        setIsSubscribed(!prevSubscribed);
        setSubscribersCount(prev => prevSubscribed ? Math.max(0, prev - 1) : prev + 1);

        startTransition(async () => {
            try {
                console.log("[SubscribeButton] Toggling subscription for creator:", creatorId);
                const result = await toggleSubscriptionAction(creatorId) as any;

                if (result.error) {
                    console.error("[SubscribeButton] Action failed:", result.error, result.message);
                    if (result.error === 'AUTH_REQUIRED') {
                        openSignIn();
                    } else if (result.error === 'CLERK_ERROR') {
                        alert(`BŁĄD KONFIGURACJI CLERK:\n\n${result.message}\n\nUpewnij się, że klucze Secret i Publishable pochodzą z tego samego projektu.`);
                    } else if (result.error === 'DATABASE_ERROR') {
                        alert(`BŁĄD BAZY DANYCH:\n\n${result.message}\n\nJeśli problem nadal występuje, spróbuj uruchomić:\n'npx prisma db push --force'`);
                    } else {
                        alert(`BŁĄD SUBSKRYPCJI: ${result.message || result.error}`);
                    }
                    // Rollback
                    setIsSubscribed(prevSubscribed);
                    setSubscribersCount(prev => prevSubscribed ? prev + 1 : prev - 1);
                } else if (result.success) {
                    console.log("[SubscribeButton] Action success:", result);
                    setIsSubscribed(result.isSubscribed ?? false);
                }
            } catch (err: any) {
                console.error("[SubscribeButton] Transition error:", err);
                alert("Wystąpił błąd serwera. Spróbuj ponownie później.");
                setIsSubscribed(prevSubscribed);
                setSubscribersCount(prev => prevSubscribed ? prev + 1 : prev - 1);
            }
        });
    };

    return (
        <>
        <button
            onClick={handleSubscribe}
            disabled={isPending}
            className={cn(
                "text-[14px] font-bold rounded-full px-6 h-9 flex items-center justify-center transition-all uppercase tracking-widest min-w-[154px]",
                isSubscribed
                    ? "bg-[#000000]/5 text-[#0f0f0f] hover:bg-[#000000]/10"
                    : "bg-[#FF5E00] text-[#3b82f6] hover:bg-[#E65500]",
                isPending && "opacity-50 cursor-wait",
                className
            )}
        >
            {isSubscribed ? t.subscribed : t.subscribe}
        </button>

        {showConfirm && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                <div
                    className="bg-[#FDFBF7] border-2 border-black p-8 max-w-sm w-full shadow-brutalist animate-in zoom-in-95 duration-300"
                    onClick={(e) => e.stopPropagation()}
                >
                    <h3 className="text-xl font-serif font-black text-black uppercase tracking-tighter mb-4">
                        {t.confirmSubscribeTitle}
                    </h3>
                    <p className="font-serif text-sm leading-relaxed text-black mb-8 opacity-70">
                        {t.confirmSubscribeText}
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => {
                                setShowConfirm(false);
                                executeSubscribe();
                            }}
                            className="bg-black text-white py-3 font-mono font-bold text-xs tracking-widest uppercase hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none shadow-brutalist-sm active:translate-x-[4px] active:translate-y-[4px] transition-all"
                        >
                            {t.yes}
                        </button>
                        <button
                            onClick={() => setShowConfirm(false)}
                            className="bg-white border-2 border-black text-black py-3 font-mono font-bold text-xs tracking-widest uppercase hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none shadow-brutalist-sm active:translate-x-[4px] active:translate-y-[4px] transition-all"
                        >
                            {t.no}
                        </button>
                    </div>
                </div>
            </div>
        )}
        </>
    );
}
