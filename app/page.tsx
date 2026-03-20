import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { HeroSection } from "@/components/home/hero-section"
import { FeaturedCampaigns } from "@/components/home/featured-campaigns"
import { CategoriesSection } from "@/components/home/categories-section"
import { HowItWorks } from "@/components/home/how-it-works"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <FeaturedCampaigns />
        <CategoriesSection />
        <HowItWorks />
      </main>
      <Footer />
    </div>
  )
}
