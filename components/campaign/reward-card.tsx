"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Reward } from "@/lib/types"

interface RewardCardProps {
  reward: Reward
}

export function RewardCard({ reward }: RewardCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }
  
  const isLimited = reward.limitedQuantity !== undefined
  const remaining = isLimited ? reward.limitedQuantity! - reward.claimedCount : null
  const isSoldOut = isLimited && remaining === 0
  
  return (
    <Card className={`transition-all hover:shadow-md ${isSoldOut ? 'opacity-60' : ''}`}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <span className="text-2xl font-bold text-accent">{formatCurrency(reward.amount)}</span>
            {isLimited && (
              <Badge variant={remaining! <= 10 ? "destructive" : "secondary"} className="ml-2">
                {isSoldOut ? 'Wyprzedane' : `Pozostalo ${remaining}`}
              </Badge>
            )}
          </div>
        </div>
        
        <h4 className="font-semibold text-lg mb-2">{reward.title}</h4>
        <p className="text-sm text-muted-foreground mb-4">{reward.description}</p>
        
        {reward.items.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">W zestawie:</p>
            <ul className="space-y-1">
              {reward.items.map((item, idx) => (
                <li key={idx} className="text-sm flex items-center gap-2">
                  <svg className="h-4 w-4 text-accent flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Dostawa: {reward.estimatedDelivery}</span>
          </div>
          <div className="flex items-center gap-1">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{reward.claimedCount} wspierajacych</span>
          </div>
        </div>
        
        <Button 
          variant="accent" 
          className="w-full" 
          disabled={isSoldOut}
        >
          {isSoldOut ? 'Wyprzedane' : 'Wybierz te nagrode'}
        </Button>
      </CardContent>
    </Card>
  )
}
