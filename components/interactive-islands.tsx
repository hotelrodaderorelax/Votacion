"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { ChefHat, Sparkles, ConciergeBell } from "lucide-react"
import { cn } from "@/lib/utils"
import { EmployeeGrid } from "@/components/employee-grid"

// 1. Filtrado para mostrar solo las 3 áreas requeridas
const areas = [
  {
    id: "recepcion",
    name: "Recepción",
    description: "Tu primera sonrisa al llegar, siempre listos para ayudarte",
    icon: ConciergeBell,
    color: "from-cyan-500 to-sky-600",
    bgColor: "bg-cyan-50",
    borderColor: "border-cyan-200",
    iconBg: "bg-cyan-100",
    iconColor: "text-cyan-600",
  },
  {
    id: "camareria",
    name: "Camarería",
    description: "Dedicados a mantener tu espacio impecable y confortable",
    icon: Sparkles,
    color: "from-emerald-500 to-teal-600",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
  },
  {
    id: "cocina",
    name: "Cocina",
    description: "Nuestro equipo culinario prepara los mejores sabores del Caribe",
    icon: ChefHat,
    color: "from-amber-500 to-orange-600",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
  },
]

export function InteractiveIslands() {
  const [selectedArea, setSelectedArea] = React.useState<string | null>(null)

  return (
    <section id="votar" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-serif text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl">
            Vota por el Empleado del Mes
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Tu opinión es muy importante para nosotros en el <strong>Hotel Rodadero Relax</strong>. 
            Selecciona un área para conocer a nuestro equipo y calificarlos.
          </p>
        </div>

        {/* 2. Grid ajustado a 3 columnas para que se vea balanceado */}
        <div className="mt-12 grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
          {areas.map((area, index) => (
            <motion.button
              key={area.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedArea(selectedArea === area.id ? null : area.id)}
              className={cn(
                "group relative overflow-hidden rounded-[2.5rem] border-2 p-8 text-left transition-all duration-300 shadow-sm",
                area.bgColor,
                area.borderColor,
                selectedArea === area.id && "ring-4 ring-primary ring-offset-4 border-primary/40"
              )}
            >
              {/* Gradient overlay on hover */}
              <div className={cn(
                "absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-10 bg-gradient-to-br",
                area.color
              )} />
              
              {/* Icon */}
              <div className={cn(
                "mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl transition-transform duration-500 group-hover:rotate-12",
                area.iconBg
              )}>
                <area.icon className={cn("h-8 w-8", area.iconColor)} />
              </div>

              {/* Content */}
              <h3 className="text-2xl font-bold text-foreground tracking-tight">
                {area.name}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {area.description}
              </p>

              {/* Selection indicator (Punto 2: Redirección visual) */}
              <div className={cn(
                "mt-6 flex items-center gap-2 text-sm font-bold uppercase tracking-widest transition-colors",
                selectedArea === area.id ? "text-primary" : "text-muted-foreground"
              )}>
                <span>{selectedArea === area.id ? "Área Seleccionada" : "Ver Personal"}</span>
                <svg
                  className={cn(
                    "h-4 w-4 transition-transform duration-300",
                    selectedArea === area.id ? "rotate-180" : "group-hover:translate-x-1"
                  )}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {selectedArea === area.id ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 15l7-7 7 7" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                  )}
                </svg>
              </div>
            </motion.button>
          ))}
        </div>

        {/* 3. El Grid de Empleados aparece justo debajo al seleccionar (Punto 2) */}
        {selectedArea && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mt-16 pt-16 border-t border-slate-200"
          >
            <div className="text-center mb-10">
              <h3 className="text-2xl font-bold text-blue-900 uppercase">Nuestro Equipo de {selectedArea}</h3>
              <p className="text-slate-500">Haz clic en un empleado para dejar tu valoración</p>
            </div>
            <EmployeeGrid area={selectedArea} />
          </motion.div>
        )}
      </div>
    </section>
  )
}
