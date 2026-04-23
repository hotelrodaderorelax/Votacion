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
    src: "/AREA_COMUN.jpeg",
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
              {/* Ajustamos la altura a 75vh para fotos verticales */}
              <div className="relative h-[75vh] min-h-[500px] w-full md:h-[85vh]">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  // object-top asegura que no se corten las cabezas/techos en fotos verticales
                  className="object-cover object-top"
                  priority={index === 0}
                  sizes="100vw"
                />
                
                {/* Degradado más oscuro abajo para que los textos blancos resalten */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                <div className="absolute inset-0 flex flex-col items-center justify-end pb-24 text-center text-white px-6">
                  <h1 className="font-serif text-4xl font-bold tracking-tight text-balance md:text-6xl lg:text-7xl">
                    {image.title}
                  </h1>
                  <p className="mt-4 max-w-2xl text-lg text-white/90 md:text-2xl font-medium">
                    {image.subtitle}
                  </p>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Botones de navegación con mejor contraste */}
        <CarouselPrevious className="left-4 size-10 border-white/40 bg-black/20 text-white backdrop-blur-md hover:bg-black/40 hover:text-white md:left-8 md:size-14" />
        <CarouselNext className="right-4 size-10 border-white/40 bg-black/20 text-white backdrop-blur-md hover:bg-black/40 hover:text-white md:right-8 md:size-14" />
      </Carousel>
      
      {/* Indicador de scroll */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg
          className="h-8 w-8 text-white/70"
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
