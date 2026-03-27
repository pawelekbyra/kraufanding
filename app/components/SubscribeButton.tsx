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
        setIsSubscribed(!prevSubscribed);
        setSubscribersCount(prev => prevSubscribed ? Math.max(0, prev - 1) : prev + 1);

        startTransition(async () => {
            try {
                const result = await toggleSubscriptionAction(creatorId) as any;
                if (result.error) {
                    setIsSubscribed(prevSubscribed);
                    setSubscribersCount(prev => prevSubscribed ? prev + 1 : prev - 1);
                } else if (result.success) {
                    setIsSubscribed(result.isSubscribed ?? false);
                }
            } catch (err: any) {
                setIsSubscribed(prevSubscribed);
                setSubscribersCount(prev => prevSubscribed ? prev + 1 : prev - 1);
            }
        });
    };

    return (
        <button
            onClick={handleSubscribe}
            disabled={isPending}
            className={cn(
                "text-[12px] font-bold rounded-none px-6 h-9 flex items-center justify-center transition-all uppercase tracking-[0.2em] min-w-[140px] font-mono border",
                isSubscribed
                    ? "bg-transparent text-bone/40 border-gold/10 hover:border-gold/30 hover:text-bone"
                    : "bg-gold text-obsidian border-gold hover:bg-transparent hover:text-gold shadow-[0_0_15px_rgba(197,160,89,0.3)]",
                isPending && "opacity-50 cursor-wait",
                className
            )}
        >
            {isSubscribed ? t.subscribed : t.subscribe}
        </button>
    );
}
