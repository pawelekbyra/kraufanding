"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { campaigns } from "@/lib/mock-data"

export default function DashboardPage() {
  const userCampaigns = campaigns.slice(0, 2)
  const backedCampaigns = campaigns.slice(2, 5)
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN',
      minimumFractionDigits: 0,
    }).format(amount)
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Moj panel</h1>
              <p className="text-muted-foreground">Zarzadzaj swoimi kampaniami i sledz wspierane projekty.</p>
            </div>
            <Link href="/start-campaign">
              <Button variant="accent">
                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Nowa kampania
              </Button>
            </Link>
          </div>
          
          <div className="grid gap-6 md:grid-cols-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-accent">{formatCurrency(187500)}</div>
                <p className="text-sm text-muted-foreground">Zebrane srodki</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">423</div>
                <p className="text-sm text-muted-foreground">Wspierajacych</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">2</div>
                <p className="text-sm text-muted-foreground">Aktywne kampanie</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{formatCurrency(450)}</div>
                <p className="text-sm text-muted-foreground">Wplacone wsparcie</p>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="my-campaigns" className="space-y-6">
            <TabsList>
              <TabsTrigger value="my-campaigns">Moje kampanie</TabsTrigger>
              <TabsTrigger value="backed">Wspierane projekty</TabsTrigger>
              <TabsTrigger value="settings">Ustawienia</TabsTrigger>
            </TabsList>
            
            <TabsContent value="my-campaigns">
              <div className="space-y-4">
                {userCampaigns.map((campaign) => {
                  const percentFunded = Math.round((campaign.raisedAmount / campaign.goalAmount) * 100)
                  
                  return (
                    <Card key={campaign.id}>
                      <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row gap-6">
                          <div className="relative w-full lg:w-48 h-32 rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                              src={campaign.image}
                              alt={campaign.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge variant={campaign.status === 'active' ? 'success' : 'secondary'}>
                                    {campaign.status === 'active' ? 'Aktywna' : 'Zakoncziona'}
                                  </Badge>
                                  <Badge variant="outline">{campaign.category}</Badge>
                                </div>
                                <h3 className="text-lg font-semibold truncate">{campaign.title}</h3>
                              </div>
                              
                              <div className="flex gap-2 flex-shrink-0">
                                <Link href={`/campaign/${campaign.slug}`}>
                                  <Button variant="outline" size="sm">Zobacz</Button>
                                </Link>
                                <Button variant="outline" size="sm">Edytuj</Button>
                              </div>
                            </div>
                            
                            <div className="mt-4">
                              <div className="flex items-center justify-between text-sm mb-2">
                                <span>{formatCurrency(campaign.raisedAmount)} z {formatCurrency(campaign.goalAmount)}</span>
                                <span className="font-medium text-accent">{percentFunded}%</span>
                              </div>
                              <Progress value={percentFunded} />
                            </div>
                            
                            <div className="flex items-center gap-6 mt-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span>{campaign.backersCount} wspierajacych</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{campaign.daysLeft} dni pozostalo</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
                
                {userCampaigns.length === 0 && (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <svg className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      <h3 className="text-lg font-medium mb-2">Brak kampanii</h3>
                      <p className="text-muted-foreground mb-4">Nie masz jeszcze zadnych kampanii. Zaloz pierwsza zbiorke!</p>
                      <Link href="/start-campaign">
                        <Button variant="accent">Zaloz zbiorke</Button>
                      </Link>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="backed">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {backedCampaigns.map((campaign) => (
                  <Card key={campaign.id}>
                    <div className="relative aspect-video overflow-hidden rounded-t-lg">
                      <Image
                        src={campaign.image}
                        alt={campaign.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold truncate mb-2">{campaign.title}</h3>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Twoje wsparcie:</span>
                        <span className="font-medium">{formatCurrency(99)}</span>
                      </div>
                      <Progress 
                        value={Math.round((campaign.raisedAmount / campaign.goalAmount) * 100)} 
                        className="mt-3"
                      />
                      <Link href={`/campaign/${campaign.slug}`} className="block mt-3">
                        <Button variant="outline" size="sm" className="w-full">Zobacz projekt</Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Ustawienia profilu</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="relative h-20 w-20 rounded-full overflow-hidden bg-muted">
                      <Image
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80"
                        alt="Avatar"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <Button variant="outline" size="sm">Zmien zdjecie</Button>
                    </div>
                  </div>
                  
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium mb-2">Imie i nazwisko</label>
                      <input
                        type="text"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        defaultValue="Jan Kowalski"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <input
                        type="email"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        defaultValue="jan@przyklad.pl"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium mb-2">Bio</label>
                      <textarea
                        className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        placeholder="Opowiedz o sobie..."
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button variant="accent">Zapisz zmiany</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
