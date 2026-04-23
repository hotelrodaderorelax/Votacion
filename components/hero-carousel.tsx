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
    src: "/FRENTE.png",
    alt: "Fachada del Hotel Rodadero Relax",
    title: "Bienvenido a Rodadero Relax",
    subtitle: "Tu oasis de tranquilidad en el Caribe",
    containDesktop: true // 👈 IMPORTANTE
  },
  {
    src: "/AREA_COMUN.png",
    alt: "Piscina y área común",
    title: "Relájate en Nuestra Piscina",
    subtitle: "Ambiente fresco y tropical para tus días de sol"
  },
  {
    src: "/HABITACION.png",
    alt: "Habitación del hotel",
    title: "Descanso Inigualable",
    subtitle: "Habitaciones amplias pensadas para tu confort"
  },
  {
    src: "/SALA.png",
    alt: "Sala de estar del hotel",
    title: "Nuestra Sala de Estar",
    subtitle: "Comodidad y relajación en cada rincón"
  },
  {
    src: "/PARQUEADERO.png",
    alt: "Parqueadero del hotel",
    title: "Parqueadero Privado",
    subtitle: "Seguridad y comodidad para tu vehículo durante tu estadía",
    containDesktop: true // 👈 IMPORTANTE
  },
  {
    src: "/COMEDOR.png",
    alt: "Comedor del hotel",
    title: "Espacio para Compartir",
    subtitle: "Disfruta tus comidas en un ambiente cómodo y acogedor"
  }
]

export function HeroCarousel() {
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  )

  return (
    <section className="relative w-full bg-black">
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
              
              <div className="relative w-full h-[65vh] md:h-[80vh] overflow-hidden">
                
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  priority={index === 0}
                  sizes="100vw"
                  className={`
                    object-contain bg-black
                    ${image.containDesktop ? "md:object-contain" : "md:object-cover"}
                  `}
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Texto */}
                <div className="absolute inset-0 flex flex-col items-center justify-end pb-16 text-center text-white px-4">
                  <h1 className="font-serif text-3xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                    {image.title}
                  </h1>
                  <p className="mt-4 max-w-xl text-base text-white/90 md:text-xl">
                    {image.subtitle}
                  </p>
                </div>

              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className="left-4 size-10 border-white/20 bg-black/40 text-white backdrop-blur-md hover:bg-black/60" />
        <CarouselNext className="right-4 size-10 border-white/20 bg-black/40 text-white backdrop-blur-md hover:bg-black/60" />
      
      </Carousel>
    </section>
  )
}
