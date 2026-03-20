import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CampaignCard } from "@/components/campaign/campaign-card"
import { getFeaturedCampaigns } from "@/lib/mock-data"

export function FeaturedCampaigns() {
  const campaigns = getFeaturedCampaigns()
  
  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Wyroznionne projekty</h2>
            <p className="text-muted-foreground mt-2">Odkryj starannie wybrane kampanie, ktore wyrozniaja sie innowacyjnoscia i jakoscia.</p>
          </div>
          <Link href="/explore?featured=true">
            <Button variant="outline">
              Zobacz wszystkie
              <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Button>
          </Link>
        </div>
        
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {campaigns.slice(0, 3).map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
      </div>
    </section>
  )
}
