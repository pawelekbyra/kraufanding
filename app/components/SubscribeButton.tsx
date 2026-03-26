"use client";

import React, { useState, useEffect } from 'react';
import { useAuth, useClerk } from '@clerk/nextjs';
import { cn } from '@/lib/utils';
import { toggleSubscriptionAction, getSubscriptionStatusAction } from '@/app/actions/subscription';

interface SubscribeButtonProps {
    creatorId: string;
    initialSubscribersCount: number;
    className?: string;
}

export default function SubscribeButton({ creatorId, initialSubscribersCount, className }: SubscribeButtonProps) {
    const { userId } = useAuth();
    const { openSignIn } = useClerk();
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [subscribersCount, setSubscribersCount] = useState(initialSubscribersCount);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (userId && creatorId) {
            getSubscriptionStatusAction(creatorId)
                .then(data => setIsSubscribed(data.isSubscribed))
                .catch(err => console.error("Error fetching subscription status:", err));
        }
    }, [userId, creatorId]);

    const handleSubscribe = async () => {
        if (!userId) {
            openSignIn();
            return;
        }
        if (!creatorId || isLoading) return;

        setIsLoading(true);
        // Optimistic UI update
        const prevSubscribed = isSubscribed;
        setIsSubscribed(!prevSubscribed);
        setSubscribersCount(prev => prevSubscribed ? prev - 1 : prev + 1);

        try {
            const result = await toggleSubscriptionAction(creatorId);

            if (result.error) {
                if (result.error === 'UNAUTHORIZED') {
                    openSignIn();
                } else {
                    console.error("Subscription action error:", result.error);
                }
                // Rollback
                setIsSubscribed(prevSubscribed);
                setSubscribersCount(prev => prevSubscribed ? prev + 1 : prev - 1);
            } else if (result.isSubscribed !== undefined) {
                setIsSubscribed(result.isSubscribed);
            }
        } catch (err) {
            console.error("Error updating subscription:", err);
            // Rollback
            setIsSubscribed(prevSubscribed);
            setSubscribersCount(prev => prevSubscribed ? prev + 1 : prev - 1);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center md:items-start">
            <button
                onClick={handleSubscribe}
                disabled={isLoading}
                className={cn(
                    "text-[14px] font-bold rounded-full px-6 h-9 flex items-center transition-all uppercase tracking-widest",
                    isSubscribed
                        ? "bg-[#000000]/5 text-[#0f0f0f] hover:bg-[#000000]/10"
                        : "bg-[#0f0f0f] text-white hover:bg-[#272727]",
                    isLoading && "opacity-50 cursor-not-allowed",
                    className
                )}
            >
                {isSubscribed ? 'Subskrybujesz' : 'Subskrajb'}
            </button>
            <p className="text-[12px] text-[#606060] mt-1 whitespace-nowrap">
                {subscribersCount.toLocaleString('pl-PL')} subskrypcji
            </p>
        </div>
    );
}
