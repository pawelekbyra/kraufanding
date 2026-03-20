"use client"

import { useState, useMemo } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { CampaignCard } from "@/components/campaign/campaign-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { campaigns, categories } from "@/lib/mock-data"

type SortOption = 'newest' | 'most_funded' | 'ending_soon' | 'most_backed'

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<SortOption>('newest')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'funded'>('all')
  
  const filteredCampaigns = useMemo(() => {
    let filtered = [...campaigns]
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(c => 
        c.title.toLowerCase().includes(query) ||
        c.shortDescription.toLowerCase().includes(query) ||
        c.creatorName.toLowerCase().includes(query)
      )
    }
    
    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(c => c.category === selectedCategory)
    }
    
    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(c => c.status === statusFilter)
    }
    
    // Sorting
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case 'most_funded':
        filtered.sort((a, b) => (b.raisedAmount / b.goalAmount) - (a.raisedAmount / a.goalAmount))
        break
      case 'ending_soon':
        filtered.sort((a, b) => a.daysLeft - b.daysLeft)
        break
      case 'most_backed':
        filtered.sort((a, b) => b.backersCount - a.backersCount)
        break
    }
    
    return filtered
  }, [searchQuery, selectedCategory, sortBy, statusFilter])
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="bg-muted/30 py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold tracking-tight mb-2">Odkryj projekty</h1>
            <p className="text-muted-foreground">Przegladaj kampanie i znajdz projekty, ktore chcesz wspierac.</p>
            
            <div className="mt-6 flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <Input
                  placeholder="Szukaj projektow..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="h-10 px-3 rounded-md border border-input bg-background text-sm"
              >
                <option value="newest">Najnowsze</option>
                <option value="most_funded">Najlepiej finansowane</option>
                <option value="ending_soon">Koncza sie wkrotce</option>
                <option value="most_backed">Najwiecej wspierajacych</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <aside className="lg:w-64 flex-shrink-0">
              <div className="sticky top-24 space-y-6">
                <div>
                  <h3 className="font-semibold mb-3">Status</h3>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={statusFilter === 'all' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setStatusFilter('all')}
                    >
                      Wszystkie
                    </Button>
                    <Button
                      variant={statusFilter === 'active' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setStatusFilter('active')}
                    >
                      Aktywne
                    </Button>
                    <Button
                      variant={statusFilter === 'funded' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setStatusFilter('funded')}
                    >
                      Sfinansowane
                    </Button>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-3">Kategorie</h3>
                  <div className="space-y-1">
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                        selectedCategory === null 
                          ? 'bg-accent text-accent-foreground' 
                          : 'hover:bg-muted'
                      }`}
                    >
                      Wszystkie kategorie
                    </button>
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.slug)}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center justify-between ${
                          selectedCategory === category.slug 
                            ? 'bg-accent text-accent-foreground' 
                            : 'hover:bg-muted'
                        }`}
                      >
                        <span>{category.name}</span>
                        <span className={`text-xs ${selectedCategory === category.slug ? 'text-accent-foreground/70' : 'text-muted-foreground'}`}>
                          {category.campaignCount}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </aside>
            
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-muted-foreground">
                  Znaleziono <span className="font-medium text-foreground">{filteredCampaigns.length}</span> projektow
                </p>
                
                {(selectedCategory || searchQuery) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedCategory(null)
                      setSearchQuery("")
                    }}
                  >
                    Wyczysc filtry
                  </Button>
                )}
              </div>
              
              {selectedCategory && (
                <div className="mb-6">
                  <Badge variant="secondary" className="gap-1">
                    {categories.find(c => c.slug === selectedCategory)?.name}
                    <button onClick={() => setSelectedCategory(null)} className="ml-1 hover:text-foreground">
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </Badge>
                </div>
              )}
              
              {filteredCampaigns.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {filteredCampaigns.map((campaign) => (
                    <CampaignCard key={campaign.id} campaign={campaign} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <svg className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-lg font-medium mb-2">Nie znaleziono projektow</h3>
                  <p className="text-muted-foreground">Sprobuj zmienic filtry lub wyszukaj cos innego.</p>
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
