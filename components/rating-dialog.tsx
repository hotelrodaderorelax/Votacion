"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { ChefHat, Sparkles, ConciergeBell, Hotel, Star } from "lucide-react"
import { cn } from "@/lib/utils"
import { EmployeeGrid } from "@/components/employee-grid"
import { Button } from "@/components/ui/button"

const areas = [
  {
    id: "recepcion",
    name: "Recepción",
    description: "Tu primera sonrisa al llegar, siempre listos para ayudarte",
    icon: ConciergeBell,
    color: "from-[#2878a8] to-[#1e5a7e]",
    bgColor: "bg-blue-50",
    borderColor: "border-[#2878a8]/20",
    iconBg: "bg-[#2878a8]/10",
    iconColor: "text-[#2878a8]",
  },
  {
    id: "camareria",
    name: "Camarería",
    description: "Dedicados a mantener tu espacio impecable y confortable",
    icon: Sparkles,
    color: "from-[#f5ac0a] to-[#d49408]",
    bgColor: "bg-orange-50",
    borderColor: "border-[#f5ac0a]/20",
    iconBg: "bg-[#f5ac0a]/10",
    iconColor: "text-[#f5ac0a]",
  },
  {
    id: "cocina",
    name: "Cocina",
    description: "Nuestro equipo culinario prepara los mejores sabores del Caribe",
    icon: ChefHat,
    color: "from-[#2878a8] to-[#f5ac0a]",
    bgColor: "bg-slate-50",
    borderColor: "border-slate-200",
    iconBg: "bg-slate-100",
    iconColor: "text-slate-600",
  },
]

export function InteractiveIslands() {
  const [selectedArea, setSelectedArea] = React.useState<string | null>(null)
  const gridRef = React.useRef<HTMLDivElement>(null)

  const handleAreaClick = (areaId: string) => {
    setSelectedArea(selectedArea === areaId ? null : areaId)
    if (selectedArea !== areaId) {
      setTimeout(() => {
        gridRef.current?.scrollIntoView({ 
          behavior: "smooth", 
          block: "start" 
        })
      }, 100)
    }
  }

  return (
    <section id="votar" className="py-16 md:py-24 bg-slate-50/30">
      <div className="container mx-auto px-4">
        
        {/* --- NUEVA ISLA: CALIFICACIÓN GENERAL DEL HOTEL --- */}
        <div className="max-w-5xl mx-auto mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-[3rem] bg-white border-2 border-[#2878a8]/10 shadow-xl p-8 md:p-12"
          >
            {/* Decoración de fondo */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 opacity-[0.03] pointer-events-none">
              <Hotel size={300} />
            </div>

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-left">
                <div className="inline-flex items-center justify-center p-3 mb-4 rounded-2xl bg-[#2878a8]/10 text-[#2878a8]">
                  <Hotel className="h-8 w-8" />
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-[#2878a8] uppercase tracking-tighter">
                  ¿Cómo estuvo tu estadía?
                </h2>
                <p className="mt-4 text-lg text-muted-foreground max-w-xl font-medium">
                  Califica nuestras instalaciones, habitaciones y servicios generales del hotel.
                </p>
              </div>

              <Button 
                onClick={() => { /* Aquí abres la encuesta general del hotel */ }}
                className="bg-[#2878a8] hover:bg-[#1e5a7e] text-white px-10 py-8 rounded-3xl text-xl font-black uppercase tracking-widest shadow-lg transition-transform active:scale-95"
              >
                <Star className="mr-3 h-6 w-6 fill-current" />
                Calificar Hotel
              </Button>
            </div>
          </motion.div>
        </div>

        {/* --- SECCIÓN EXISTENTE: EMPLEADOS --- */}
        <div className="mx-auto max-w-3xl text-center mb-12">
          <div className="flex items-center justify-center gap-2 text-[#f5ac0a] mb-2">
            <span className="h-px w-8 bg-[#f5ac0a]/30" />
            <span className="font-black uppercase text-xs tracking-[0.3em]">Nuestro Equipo</span>
            <span className="h-px w-8 bg-[#f5ac0a]/30" />
          </div>
          <h2 className="font-serif text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl">
            Vota por el Empleado del Mes
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Selecciona un área para calificar el servicio personalizado que recibiste.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
          {areas.map((area, index) => (
            <motion.button
              key={area.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleAreaClick(area.id)}
              className={cn(
                "group relative overflow-hidden rounded-[2.5rem] border-2 p-8 text-left transition-all duration-300 shadow-sm",
                area.bgColor,
                area.borderColor,
                selectedArea === area.id && "ring-4 ring-[#2878a8] ring-offset-4"
              )}
            >
              <div className={cn(
                "absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-10 bg-gradient-to-br",
                area.color
              )} />
              
              <div className={cn(
                "mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl transition-transform duration-500 group-hover:rotate-12",
                area.iconBg
              )}>
                <area.icon className={cn("h-8 w-8", area.iconColor)} />
              </div>

              <h3 className="text-2xl font-bold text-foreground tracking-tight uppercase">
                {area.name}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {area.description}
              </p>
            </motion.button>
          ))}
        </div>

        <div ref={gridRef} className="scroll-mt-24"> 
          {selectedArea && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-16 pt-16 border-t border-slate-200"
            >
              <EmployeeGrid area={selectedArea} />
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}



