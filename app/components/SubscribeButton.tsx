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
        <div className="flex flex-col items-center md:items-start">
            <button
                onClick={handleSubscribe}
                disabled={isPending}
                className={cn(
                    "text-[14px] font-bold rounded-full px-6 h-9 flex items-center justify-center transition-all uppercase tracking-widest min-w-[154px]",
                    isSubscribed
                        ? "bg-[#000000]/5 text-[#0f0f0f] hover:bg-[#000000]/10"
                        : "bg-[#0f0f0f] text-white hover:bg-[#272727]",
                    isPending && "opacity-50 cursor-wait",
                    className
                )}
            >
                {isSubscribed ? t.subscribed : t.subscribe}
            </button>
            <p className="text-[12px] text-[#606060] mt-1 whitespace-nowrap">
                {mounted ? subscribersCount.toLocaleString('pl-PL') : subscribersCount} {t.subscribers}
            </p>
        </div>
    );
}
