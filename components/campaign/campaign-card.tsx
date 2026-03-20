import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Campaign } from "@/lib/types"

interface CampaignCardProps {
  campaign: Campaign
}

export function CampaignCard({ campaign }: CampaignCardProps) {
  const percentFunded = Math.round((campaign.raisedAmount / campaign.goalAmount) * 100)
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }
  
  return (
    <Link href={`/campaign/${campaign.slug}`}>
      <Card className="group overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={campaign.image}
            alt={campaign.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {campaign.featured && (
            <Badge variant="success" className="absolute top-3 left-3">
              Wyroznionne
            </Badge>
          )}
          {campaign.status === 'funded' && (
            <Badge variant="success" className="absolute top-3 right-3">
              Sfinansowany
            </Badge>
          )}
        </div>
        
        <CardContent className="p-5">
          <div className="mb-2">
            <span className="text-xs font-medium text-accent uppercase tracking-wide">
              {campaign.category}
            </span>
          </div>
          
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-accent transition-colors">
            {campaign.title}
          </h3>
          
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {campaign.shortDescription}
          </p>
          
          <Progress value={percentFunded} className="mb-3" />
          
          <div className="flex items-center justify-between text-sm">
            <div>
              <span className="font-semibold text-foreground">{formatCurrency(campaign.raisedAmount)}</span>
              <span className="text-muted-foreground"> z {formatCurrency(campaign.goalAmount)}</span>
            </div>
            <span className="font-medium text-accent">{percentFunded}%</span>
          </div>
          
          <div className="flex items-center justify-between mt-3 pt-3 border-t text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>{campaign.backersCount} wspierajacych</span>
            </div>
            <div className="flex items-center gap-1">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{campaign.daysLeft > 0 ? `${campaign.daysLeft} dni` : 'Zakonczony'}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
