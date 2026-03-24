"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { ChefHat, Sparkles, ConciergeBell } from "lucide-react"
import { cn } from "@/lib/utils"
import { EmployeeGrid } from "@/components/employee-grid"

const areas = [
  {
    id: "recepcion",
    name: "Recepción",
    description: "Tu primera sonrisa al llegar, siempre listos para ayudarte",
    icon: ConciergeBell,
    color: "from-[#2878a8] to-[#1e5a7e]", // Tu Azul
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
    color: "from-[#f5ac0a] to-[#d49408]", // Tu Naranja
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
  
  // 1. Creamos la referencia para el scroll
  const gridRef = React.useRef<HTMLDivElement>(null)

  const handleAreaClick = (areaId: string) => {
    setSelectedArea(selectedArea === areaId ? null : areaId)
    
    // 2. Lógica de auto-scroll suave
    if (selectedArea !== areaId) {
      setTimeout(() => {
        gridRef.current?.scrollIntoView({ 
          behavior: "smooth", 
          block: "start" 
        })
      }, 100) // Un pequeño delay para que React alcance a mostrar el componente
    }
  }

  return (
    <section id="votar" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-serif text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl">
            Vota por el Empleado del Mes
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Tu opinión es muy importante para nosotros en el <strong>Hotel Rodadero Relax</strong>. 
            Selecciona un área para calificar a nuestro equipo.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
          {areas.map((area, index) => (
            <motion.button
              key={area.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleAreaClick(area.id)} // Usamos la nueva función
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

        {/* 3. El punto de referencia donde bajará el scroll */}
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
