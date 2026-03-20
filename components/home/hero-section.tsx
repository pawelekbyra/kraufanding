import Link from "next/link"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-muted/50 to-background py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl text-balance">
            Wspieraj projekty, ktore{" "}
            <span className="text-accent">zmieniaja swiat</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed text-pretty">
            FundujMY to platforma crowdfundingowa, ktora laczy tworcow z osobami chcacymi wspierac innowacyjne projekty. 
            Odkryj kampanie, ktore Cie inspiruja i dolacz do spolecznosci wspierajacych.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/explore">
              <Button size="xl" variant="accent">
                Odkryj projekty
                <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Button>
            </Link>
            <Link href="/start-campaign">
              <Button size="xl" variant="outline">
                Zaloz wlasna zbiorke
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-8 max-w-2xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-accent">2,847</div>
            <div className="text-sm text-muted-foreground mt-1">Sfinansowanych projektow</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-accent">12.5M zl</div>
            <div className="text-sm text-muted-foreground mt-1">Zebranych srodkow</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-accent">156K</div>
            <div className="text-sm text-muted-foreground mt-1">Wspierajacych</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-accent">89%</div>
            <div className="text-sm text-muted-foreground mt-1">Wskaznik sukcesu</div>
          </div>
        </div>
      </div>
      
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-1/2 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-accent/5 rounded-full blur-3xl" />
      </div>
    </section>
  )
}
