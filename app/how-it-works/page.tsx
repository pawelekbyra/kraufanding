import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

export default function HowItWorksPage() {
  const steps = [
    {
      number: "01",
      title: "Stworz kampanie",
      description: "Przygotuj atrakcyjny opis projektu, ustal cel finansowy i dodaj nagrody dla wspierajacych. Im lepiej opiszesz swoj projekt, tym wiecej osob przekonasz do wsparcia.",
      tips: ["Dodaj wysokiej jakosci zdjecia", "Nagraj krotkie video", "Opisz dokladnie cele projektu"],
    },
    {
      number: "02",
      title: "Promuj projekt",
      description: "Udostepnij kampanie w mediach spolecznosciowych, wysylaj do przyjaciol i rodziny. Pierwsi wspierajacy sa kluczowi dla sukcesu zbiórki.",
      tips: ["Udostepniaj regularnie na social media", "Kontaktuj sie z blogerami i influencerami", "Wysylaj aktualizacje do wspierajacych"],
    },
    {
      number: "03",
      title: "Otrzymuj wplaty",
      description: "Wspierajacy wplacaja srodki i wybieraja nagrody. Mozesz na biezaco sledzic postep kampanii i kontaktowac sie z backer'ami.",
      tips: ["Odpowiadaj na pytania szybko", "Dziekuj kazdemu wspierajacemu", "Informuj o postepach"],
    },
    {
      number: "04",
      title: "Zrealizuj projekt",
      description: "Po osiagnieciu celu otrzymujesz zebrane srodki. Teraz mozesz zrealizowac swoj projekt i wyslac nagrody do wspierajacych.",
      tips: ["Dotrzymuj terminow", "Informuj o ewentualnych opoznieniach", "Dostarczaj nagrody zgodnie z obietnica"],
    },
  ]

  const faqs = [
    {
      question: "Ile kosztuje zalozenie kampanii?",
      answer: "Zalozenie kampanii jest calkowicie bezplatne. Pobieramy jedynie 5% prowizji od zebranych srodkow plus koszty transakcji platniczych (okolo 2.9% + 0.25 PLN).",
    },
    {
      question: "Co jesli nie osiagne celu?",
      answer: "Dzialamy w modelu 'all-or-nothing'. Jesli nie osiagniesz celu, wszystkie wplaty zostana zwrocone wspierajacym. To motywuje do aktywnej promocji kampanii.",
    },
    {
      question: "Jak szybko otrzymam srodki?",
      answer: "Po pomyslnym zakonczeniu kampanii, srodki sa przelewane na Twoje konto w ciagu 14 dni roboczych.",
    },
    {
      question: "Czy moge edytowac kampanie po jej uruchomieniu?",
      answer: "Tak, mozesz edytowac opis, dodawac aktualizacje i nowe nagrody. Nie mozesz jednak zmniejszyc celu finansowego ani skrocic czasu trwania.",
    },
    {
      question: "Jakie projekty moge finansowac?",
      answer: "Przyjmujemy projekty kreatywne, technologiczne, spoleczne i wiele innych. Projekty musza byc legalne i zgodne z naszym regulaminem.",
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <section className="py-16 lg:py-24 bg-muted/30">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold tracking-tight mb-4">Jak dziala FundujMY?</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Crowdfunding to sposob na finansowanie projektow przez spolecznosc. Dowiedz sie, jak latwo mozesz rozpoczac swoja zbiorke.
            </p>
          </div>
        </section>
        
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto space-y-16">
              {steps.map((step, index) => (
                <div key={step.number} className="flex flex-col md:flex-row gap-8">
                  <div className="flex-shrink-0">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent text-accent-foreground text-2xl font-bold">
                      {step.number}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-4">{step.title}</h2>
                    <p className="text-muted-foreground mb-6">{step.description}</p>
                    <div className="bg-muted/50 rounded-lg p-4">
                      <h4 className="font-medium mb-2 text-sm">Wskazowki:</h4>
                      <ul className="space-y-1">
                        {step.tips.map((tip, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <svg className="h-4 w-4 text-accent flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-16 text-center">
              <Link href="/start-campaign">
                <Button size="xl" variant="accent">
                  Rozpocznij swoja zbiorke
                  <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Button>
              </Link>
            </div>
          </div>
        </section>
        
        <section className="py-16 lg:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold tracking-tight text-center mb-12">Czesto zadawane pytania</h2>
            <div className="max-w-3xl mx-auto space-y-4">
              {faqs.map((faq, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-2">{faq.question}</h3>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <Card className="bg-accent text-accent-foreground">
              <CardContent className="p-8 md:p-12 text-center">
                <h2 className="text-3xl font-bold mb-4">Gotowy, zeby zaczac?</h2>
                <p className="text-accent-foreground/80 mb-8 max-w-2xl mx-auto">
                  Dolacz do tysiecy tworcow, ktorzy z sukcesem sfinansowali swoje projekty na FundujMY.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/start-campaign">
                    <Button size="xl" variant="secondary">
                      Zaloz zbiorke
                    </Button>
                  </Link>
                  <Link href="/explore">
                    <Button size="xl" variant="outline" className="border-accent-foreground/20 text-accent-foreground hover:bg-accent-foreground/10">
                      Przegladaj projekty
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  )
}
