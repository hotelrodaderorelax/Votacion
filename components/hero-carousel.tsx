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
    src: "/FRENTE.jpg",
    alt: "Fachada del Hotel Rodadero Relax",
    title: "Bienvenido a Rodadero Relax",
    subtitle: "Tu oasis de tranquilidad en el Caribe"
  },
  {
    src: "/AREA COMUN.jpeg",
    alt: "Piscina y área común",
    title: "Relájate en Nuestra Piscina",
    subtitle: "Ambiente fresco y tropical para tus días de sol"
  },
  {
    src: "/HABITACION.JPG",
    alt: "Habitación del hotel",
    title: "Descanso Inigualable",
    subtitle: "Habitaciones amplias pensadas para tu confort"
  },
  {
    src: "/SALA.jpeg",
    alt: "Sala de estar del hotel",
    title: "Nuestra Sala de Estar",
    subtitle: "Comodidad y relajación en cada rincón"
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
                  sizes="100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute inset-0 flex flex-col items-center justify-end pb-20 text-center text-white p-4">
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
