import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getCampaignBySlug } from "@/lib/mock-data"
import { RewardCard } from "@/components/campaign/reward-card"

interface CampaignPageProps {
  params: Promise<{ slug: string }>
}

export default async function CampaignPage({ params }: CampaignPageProps) {
  const { slug } = await params
  const campaign = getCampaignBySlug(slug)
  
  if (!campaign) {
    notFound()
  }
  
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
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Link href="/explore" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Powrot do projektow
            </Link>
          </div>
          
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <div className="relative aspect-video overflow-hidden rounded-xl">
                <Image
                  src={campaign.image}
                  alt={campaign.title}
                  fill
                  className="object-cover"
                  priority
                />
                {campaign.status === 'funded' && (
                  <Badge variant="success" className="absolute top-4 right-4 text-sm px-3 py-1">
                    Cel osiagniety!
                  </Badge>
                )}
              </div>
              
              {campaign.gallery.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {campaign.gallery.map((img, idx) => (
                    <div key={idx} className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                      <Image src={img} alt={`Gallery ${idx + 1}`} fill className="object-cover" />
                    </div>
                  ))}
                </div>
              )}
              
              <div>
                <Badge variant="secondary" className="mb-3">{campaign.category}</Badge>
                <h1 className="text-3xl font-bold tracking-tight mb-4">{campaign.title}</h1>
                <p className="text-lg text-muted-foreground">{campaign.shortDescription}</p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="relative h-12 w-12 rounded-full overflow-hidden">
                    <Image src={campaign.creatorAvatar} alt={campaign.creatorName} fill className="object-cover" />
                  </div>
                  <div>
                    <p className="font-medium">{campaign.creatorName}</p>
                    <p className="text-sm text-muted-foreground">{campaign.location}</p>
                  </div>
                </div>
              </div>
              
              <Tabs defaultValue="description" className="mt-8">
                <TabsList className="w-full justify-start">
                  <TabsTrigger value="description">Opis</TabsTrigger>
                  <TabsTrigger value="updates">Aktualnosci ({campaign.updates.length})</TabsTrigger>
                  <TabsTrigger value="faq">FAQ ({campaign.faqs.length})</TabsTrigger>
                </TabsList>
                
                <TabsContent value="description" className="mt-6">
                  <div 
                    className="prose prose-neutral dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: campaign.description }}
                  />
                </TabsContent>
                
                <TabsContent value="updates" className="mt-6">
                  {campaign.updates.length > 0 ? (
                    <div className="space-y-6">
                      {campaign.updates.map((update) => (
                        <Card key={update.id}>
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-lg">{update.title}</CardTitle>
                              <span className="text-sm text-muted-foreground">{update.createdAt}</span>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-muted-foreground">{update.content}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Brak aktualnosci.</p>
                  )}
                </TabsContent>
                
                <TabsContent value="faq" className="mt-6">
                  {campaign.faqs.length > 0 ? (
                    <div className="space-y-4">
                      {campaign.faqs.map((faq) => (
                        <div key={faq.id} className="border rounded-lg p-4">
                          <h4 className="font-medium mb-2">{faq.question}</h4>
                          <p className="text-sm text-muted-foreground">{faq.answer}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Brak pytan FAQ.</p>
                  )}
                </TabsContent>
              </Tabs>
            </div>
            
            <div className="space-y-6">
              <Card className="sticky top-24">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-accent">{formatCurrency(campaign.raisedAmount)}</span>
                        <span className="text-muted-foreground">z {formatCurrency(campaign.goalAmount)}</span>
                      </div>
                      <Progress value={percentFunded} className="mt-3 h-3" />
                      <p className="text-sm text-muted-foreground mt-2">{percentFunded}% celu</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 py-4 border-y">
                      <div className="text-center">
                        <div className="text-2xl font-bold">{campaign.backersCount}</div>
                        <div className="text-sm text-muted-foreground">wspierajacych</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">{campaign.daysLeft > 0 ? campaign.daysLeft : 0}</div>
                        <div className="text-sm text-muted-foreground">{campaign.daysLeft > 0 ? 'dni pozostalo' : 'Zakonczony'}</div>
                      </div>
                    </div>
                    
                    {campaign.daysLeft > 0 && (
                      <>
                        <Button variant="accent" size="xl" className="w-full">
                          Wesprzyj ten projekt
                        </Button>
                        <Button variant="outline" className="w-full">
                          <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                          Dodaj do obserwowanych
                        </Button>
                      </>
                    )}
                    
                    <div className="flex items-center justify-center gap-4 pt-2">
                      <button className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Udostepnij na Facebook">
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                      </button>
                      <button className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Udostepnij na Twitter">
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                      </button>
                      <button className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Kopiuj link">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {campaign.rewards.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Wybierz nagrode</h3>
                  {campaign.rewards.map((reward) => (
                    <RewardCard key={reward.id} reward={reward} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
