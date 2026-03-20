"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
              <svg className="h-5 w-5 text-accent-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-xl font-bold">FundujMY</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/explore" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Odkryj projekty
            </Link>
            <Link href="/categories" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Kategorie
            </Link>
            <Link href="/how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Jak to dziala
            </Link>
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          <Link href="/start-campaign" className="hidden sm:block">
            <Button variant="accent">Zaloz zbiorke</Button>
          </Link>
          <Link href="/login" className="hidden sm:block">
            <Button variant="ghost">Zaloguj sie</Button>
          </Link>
          <Link href="/register" className="hidden sm:block">
            <Button variant="outline">Zarejestruj</Button>
          </Link>
          
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>
      
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <nav className="container mx-auto flex flex-col gap-4 p-4">
            <Link href="/explore" className="text-sm font-medium">Odkryj projekty</Link>
            <Link href="/categories" className="text-sm font-medium">Kategorie</Link>
            <Link href="/how-it-works" className="text-sm font-medium">Jak to dziala</Link>
            <hr className="my-2" />
            <Link href="/start-campaign">
              <Button variant="accent" className="w-full">Zaloz zbiorke</Button>
            </Link>
            <div className="flex gap-2">
              <Link href="/login" className="flex-1">
                <Button variant="ghost" className="w-full">Zaloguj sie</Button>
              </Link>
              <Link href="/register" className="flex-1">
                <Button variant="outline" className="w-full">Zarejestruj</Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
