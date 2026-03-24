"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { ChefHat, Sparkles, ConciergeBell, Wine, Wrench, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import { EmployeeGrid } from "@/components/employee-grid"

const areas = [
  {
    id: "todos",
    name: "Ver Todos",
    description: "Visualiza todo nuestro equipo y califica a quien desees",
    icon: Users,
    color: "from-primary to-cyan-600",
    bgColor: "bg-primary/5",
    borderColor: "border-primary/20",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
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
  {
    id: "camareria",
    name: "Housekeeping",
    description: "Dedicados a mantener tu espacio impecable y confortable",
    icon: Sparkles,
    color: "from-emerald-500 to-teal-600",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
  },
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
    id: "bar",
    name: "Bar & Restaurante",
    description: "Cócteles refrescantes y ambiente tropical en nuestro bar",
    icon: Wine,
    color: "from-rose-500 to-pink-600",
    bgColor: "bg-rose-50",
    borderColor: "border-rose-200",
    iconBg: "bg-rose-100",
    iconColor: "text-rose-600",
  },
  {
    id: "mantenimiento",
    name: "Mantenimiento",
    description: "Mantienen nuestras instalaciones en perfecto estado",
    icon: Wrench,
    color: "from-slate-500 to-gray-600",
    bgColor: "bg-slate-50",
    borderColor: "border-slate-200",
    iconBg: "bg-slate-100",
    iconColor: "text-slate-600",
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
            Tu opinión es muy importante para nosotros. Selecciona un área y califica a nuestro equipo.
          </p>
        </div>

        {/* Interactive Islands Grid */}
        <div className="mt-12 grid gap-6 md:grid-cols-3">
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
                "group relative overflow-hidden rounded-2xl border-2 p-8 text-left transition-all duration-300",
                area.bgColor,
                area.borderColor,
                selectedArea === area.id && "ring-2 ring-primary ring-offset-2"
              )}
            >
              {/* Gradient overlay on hover */}
              <div className={cn(
                "absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-10 bg-gradient-to-br",
                area.color
              )} />
              
              {/* Icon */}
              <div className={cn(
                "mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110",
                area.iconBg
              )}>
                <area.icon className={cn("h-7 w-7", area.iconColor)} />
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-foreground">
                {area.name}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {area.description}
              </p>

              {/* Selection indicator */}
              <div className={cn(
                "mt-4 flex items-center gap-2 text-sm font-medium transition-colors",
                selectedArea === area.id ? "text-primary" : "text-muted-foreground"
              )}>
                <span>{selectedArea === area.id ? "Seleccionado" : "Clic para seleccionar"}</span>
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  )}
                </svg>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Employee Grid */}
        {selectedArea && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-12"
          >
            <EmployeeGrid area={selectedArea} />
          </motion.div>
        )}
      </div>
    </section>
  )
}
