import { HeroCarousel } from "@/components/hero-carousel"
import { InteractiveIslands } from "@/components/interactive-islands"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <HeroCarousel />
      <InteractiveIslands />
      <Footer />
    </main>
  )
}
