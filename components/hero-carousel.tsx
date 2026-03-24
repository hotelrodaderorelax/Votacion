"use client"

import * as React from "react"
import Image from "next/image"
import Autoplay from "embla-carousel-autoplay"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

const hotelImages = [
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Fachada-M2mCOBU53yStwDYYMdl5xN83pDkKTI.jpg",
    alt: "Fachada del Hotel Rodadero Relax",
    title: "Bienvenido a Rodadero Relax",
    subtitle: "Tu oasis de tranquilidad en el Caribe"
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Piscina%206-G7SnWgN8vLJQzElN1NuLbr9483dGLx.jpg",
    alt: "Piscina con vista a las montañas",
    title: "Disfruta de Nuestra Piscina",
    subtitle: "Vistas panorámicas a la Sierra Nevada"
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202026-01-22%20at%2011.17.32%20AM-W5XdJIQw9NoOHfjxnI07El38jwBaoM.jpeg",
    alt: "Terraza con piscina",
    title: "Relájate en Nuestra Terraza",
    subtitle: "El lugar perfecto para descansar"
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Bar.PNG-ewjwfEbo5CzNwznZPy30Uol1tCDfAf.png",
    alt: "Bar del hotel",
    title: "Bar On The Rocks",
    subtitle: "Cócteles tropicales en un ambiente único"
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Recepcion%202-3mFNe7Gnmd5Cg7epR3OvcIdHyvmIvv.jpg",
    alt: "Recepción del hotel",
    title: "Atención Personalizada",
    subtitle: "Nuestro equipo está para servirte"
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Bar4-6woYyzdvmH0g0h3XtnJuj9C3I7UZZk.jpg",
    alt: "Área del bar y billar",
    title: "Entretenimiento y Diversión",
    subtitle: "Bar con mesa de billar y ambiente relajado"
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Mural.JPG-Der919w4qGy6niG9w9MFYv5Gm1r3tR.jpeg",
    alt: "Mural artístico fluorescente",
    title: "Arte y Ambiente Único",
    subtitle: "Detalles que hacen la diferencia"
  }
]

export function HeroCarousel() {
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  )

  return (
    <section className="relative w-full">
      <Carousel
        plugins={[plugin.current]}
        className="w-full"
        opts={{
          align: "start",
          loop: true,
        }}
      >
        <CarouselContent>
          {hotelImages.map((image, index) => (
            <CarouselItem key={index}>
              <div className="relative h-[60vh] min-h-[400px] w-full md:h-[70vh]">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute inset-0 flex flex-col items-center justify-end pb-20 text-center text-white">
                  <h1 className="font-serif text-3xl font-bold tracking-tight text-balance md:text-5xl lg:text-6xl">
                    {image.title}
                  </h1>
                  <p className="mt-4 max-w-2xl text-lg text-white/90 md:text-xl">
                    {image.subtitle}
                  </p>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4 size-10 border-white/30 bg-white/20 text-white backdrop-blur-sm hover:bg-white/30 hover:text-white md:left-8 md:size-12" />
        <CarouselNext className="right-4 size-10 border-white/30 bg-white/20 text-white backdrop-blur-sm hover:bg-white/30 hover:text-white md:right-8 md:size-12" />
      </Carousel>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce">
        <svg
          className="h-6 w-6 text-white/80"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </section>
  )
}
