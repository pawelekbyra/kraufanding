"use client"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { categories } from "@/lib/mock-data"

type Step = 'basics' | 'story' | 'rewards' | 'preview'

export default function StartCampaignPage() {
  const [currentStep, setCurrentStep] = useState<Step>('basics')
  const [formData, setFormData] = useState({
    title: '',
    shortDescription: '',
    category: '',
    goalAmount: '',
    duration: '30',
    location: '',
    description: '',
    videoUrl: '',
  })
  
  const steps = [
    { id: 'basics', label: 'Podstawy', number: 1 },
    { id: 'story', label: 'Historia', number: 2 },
    { id: 'rewards', label: 'Nagrody', number: 3 },
    { id: 'preview', label: 'Podglad', number: 4 },
  ]
  
  const currentStepIndex = steps.findIndex(s => s.id === currentStep)
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold tracking-tight mb-2">Stworz nowa kampanie</h1>
              <p className="text-muted-foreground">Wypelnij formularz i rozpocznij zbieranie srodkow na swoj projekt.</p>
            </div>
            
            <div className="flex items-center justify-center mb-12">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <button
                    onClick={() => setCurrentStep(step.id as Step)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      currentStep === step.id
                        ? 'bg-accent text-accent-foreground'
                        : index < currentStepIndex
                        ? 'bg-accent/20 text-accent'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    <span className={`flex items-center justify-center w-6 h-6 rounded-full text-xs ${
                      currentStep === step.id
                        ? 'bg-accent-foreground/20'
                        : index < currentStepIndex
                        ? 'bg-accent/30'
                        : 'bg-muted-foreground/20'
                    }`}>
                      {index < currentStepIndex ? (
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        step.number
                      )}
                    </span>
                    <span className="hidden sm:inline">{step.label}</span>
                  </button>
                  
                  {index < steps.length - 1 && (
                    <div className={`w-8 h-0.5 mx-2 ${index < currentStepIndex ? 'bg-accent' : 'bg-muted'}`} />
                  )}
                </div>
              ))}
            </div>
            
            {currentStep === 'basics' && (
              <Card>
                <CardHeader>
                  <CardTitle>Podstawowe informacje</CardTitle>
                  <CardDescription>Podaj podstawowe informacje o swoim projekcie.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Tytul projektu *</label>
                    <Input
                      placeholder="np. Innowacyjny smartwatch dla aktywnych"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                    <p className="text-xs text-muted-foreground mt-1">Wybierz krotki, chwytliwy tytul, ktory przyciagnie uwage.</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Krotki opis *</label>
                    <textarea
                      className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      placeholder="Opisz swoj projekt w kilku zdaniach..."
                      value={formData.shortDescription}
                      onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Kategoria *</label>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option value="">Wybierz kategorie</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.slug}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium mb-2">Cel finansowy (PLN) *</label>
                      <Input
                        type="number"
                        placeholder="np. 50000"
                        value={formData.goalAmount}
                        onChange={(e) => setFormData({ ...formData, goalAmount: e.target.value })}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Czas trwania (dni) *</label>
                      <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={formData.duration}
                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      >
                        <option value="15">15 dni</option>
                        <option value="30">30 dni</option>
                        <option value="45">45 dni</option>
                        <option value="60">60 dni</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Lokalizacja</label>
                    <Input
                      placeholder="np. Warszawa, Polska"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    />
                  </div>
                </CardContent>
              </Card>
            )}
            
            {currentStep === 'story' && (
              <Card>
                <CardHeader>
                  <CardTitle>Opowiedz swoja historie</CardTitle>
                  <CardDescription>Opisz szczegolowo swoj projekt i dlaczego ludzie powinni go wspierac.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Pelny opis projektu *</label>
                    <textarea
                      className="flex min-h-[300px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      placeholder="Opisz swoj projekt szczegolowo. Powiedz o sobie, swojej motywacji, planach i jak wykorzystasz zebrane srodki..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                    <p className="text-xs text-muted-foreground mt-1">Mozesz uzyc formatowania HTML.</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Link do video (opcjonalnie)</label>
                    <Input
                      placeholder="https://youtube.com/watch?v=..."
                      value={formData.videoUrl}
                      onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                    />
                    <p className="text-xs text-muted-foreground mt-1">Dodaj video z YouTube lub Vimeo, aby lepiej przedstawic swoj projekt.</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Zdjecia projektu</label>
                    <div className="border-2 border-dashed border-input rounded-lg p-8 text-center">
                      <svg className="h-12 w-12 mx-auto text-muted-foreground mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-sm text-muted-foreground mb-2">Przeciagnij i upusc zdjecia tutaj lub</p>
                      <Button variant="outline" size="sm">Wybierz pliki</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {currentStep === 'rewards' && (
              <Card>
                <CardHeader>
                  <CardTitle>Dodaj nagrody</CardTitle>
                  <CardDescription>Zaoferuj nagrody dla wspierajacych. Nagrody moga znaczaco zwiekszyc wplaty.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="border rounded-lg p-6 bg-muted/30">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <Badge variant="secondary">Przykladowa nagroda</Badge>
                        <h4 className="font-semibold mt-2">Wczesny Ptak - 99 PLN</h4>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">Edytuj</Button>
                        <Button variant="ghost" size="sm" className="text-destructive">Usun</Button>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">Specjalna oferta dla pierwszych wspierajacych...</p>
                  </div>
                  
                  <Button variant="outline" className="w-full">
                    <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Dodaj nowa nagrode
                  </Button>
                  
                  <div className="bg-accent/10 rounded-lg p-4">
                    <h4 className="font-medium text-sm mb-2">Wskazowki dotyczace nagrod:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>Oferuj rozne poziomy cenowe (np. 29, 99, 249 PLN)</li>
                      <li>Opisz dokladnie co wspierajacy otrzyma</li>
                      <li>Podaj realistyczny termin dostawy</li>
                      <li>Rozważ limitowane nagrody dla wyzszych kwot</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {currentStep === 'preview' && (
              <Card>
                <CardHeader>
                  <CardTitle>Podglad kampanii</CardTitle>
                  <CardDescription>Sprawdz jak bedzie wygladac Twoja kampania przed publikacja.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg p-6 space-y-4">
                    {formData.title ? (
                      <>
                        <Badge variant="secondary">{categories.find(c => c.slug === formData.category)?.name || 'Kategoria'}</Badge>
                        <h2 className="text-2xl font-bold">{formData.title}</h2>
                        <p className="text-muted-foreground">{formData.shortDescription || 'Krotki opis projektu...'}</p>
                        <div className="flex gap-4 text-sm">
                          <span>Cel: {formData.goalAmount ? `${formData.goalAmount} PLN` : '-'}</span>
                          <span>Czas: {formData.duration} dni</span>
                          <span>Lokalizacja: {formData.location || '-'}</span>
                        </div>
                      </>
                    ) : (
                      <p className="text-center text-muted-foreground py-8">
                        Wypelnij poprzednie kroki, aby zobaczyc podglad kampanii.
                      </p>
                    )}
                  </div>
                  
                  <div className="mt-6 p-4 bg-accent/10 rounded-lg">
                    <h4 className="font-medium mb-2">Przed publikacja:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li className="flex items-center gap-2">
                        <svg className={`h-4 w-4 ${formData.title ? 'text-accent' : 'text-muted-foreground'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={formData.title ? "M5 13l4 4L19 7" : "M6 18L18 6M6 6l12 12"} />
                        </svg>
                        Tytul projektu
                      </li>
                      <li className="flex items-center gap-2">
                        <svg className={`h-4 w-4 ${formData.shortDescription ? 'text-accent' : 'text-muted-foreground'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={formData.shortDescription ? "M5 13l4 4L19 7" : "M6 18L18 6M6 6l12 12"} />
                        </svg>
                        Krotki opis
                      </li>
                      <li className="flex items-center gap-2">
                        <svg className={`h-4 w-4 ${formData.goalAmount ? 'text-accent' : 'text-muted-foreground'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={formData.goalAmount ? "M5 13l4 4L19 7" : "M6 18L18 6M6 6l12 12"} />
                        </svg>
                        Cel finansowy
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )}
            
            <div className="flex items-center justify-between mt-8">
              <Button
                variant="outline"
                onClick={() => {
                  const prevIndex = currentStepIndex - 1
                  if (prevIndex >= 0) {
                    setCurrentStep(steps[prevIndex].id as Step)
                  }
                }}
                disabled={currentStepIndex === 0}
              >
                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Wstecz
              </Button>
              
              {currentStep === 'preview' ? (
                <Button variant="accent">
                  Opublikuj kampanie
                  <svg className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    const nextIndex = currentStepIndex + 1
                    if (nextIndex < steps.length) {
                      setCurrentStep(steps[nextIndex].id as Step)
                    }
                  }}
                >
                  Dalej
                  <svg className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
