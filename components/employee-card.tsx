"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Star, User, Award } from "lucide-react"
import { cn } from "@/lib/utils"

interface EmployeeCardProps {
  employee: {
    id: string
    name: string
    role: string
    image?: string
    image_url?: string
    totalVotes?: number
    averageRating?: number
  }
  onClick: () => void
}

export function EmployeeCard({ employee, onClick }: EmployeeCardProps) {
  const [isHovered, setIsHovered] = React.useState(false)
  const [imageError, setImageError] = React.useState(false)

  const rating = employee.averageRating || 0
  const votes = employee.totalVotes || 0

  // --- LÓGICA DE FOTOS AUTOMÁTICA ---
  const getPhotoPath = (name: string) => {
    const n = name.toUpperCase();
    if (n.includes("LEXILIS")) return "/LEXILIS-1.jpeg";
    if (n.includes("EZLATNE")) return "/EZLATNE-1.jpeg";
    if (n.includes("VIRGINIA")) return "/VIRGINIA-1.jpeg";
    if (n.includes("ANDREINA")) return "/ANDREINA-1.jpg.jpeg";
    if (n.includes("MIGUEL")) return "/MIGUEL-1.jpeg";
    return employee.image || employee.image_url || null;
  }

  const displayImage = getPhotoPath(employee.name);

  return (
    <motion.button
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -8, rotateY: 5 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="group relative w-full perspective-1000 focus:outline-none"
    >
      <div className={cn(
        "relative overflow-hidden rounded-xl border-2 p-1 shadow-lg transition-all duration-300",
        "border-[#f5ac0a]/20 hover:border-[#f5ac0a] hover:shadow-xl hover:shadow-[#2878a8]/10",
        "bg-gradient-to-br from-white to-slate-50"
      )}>
        <div className="relative overflow-hidden rounded-lg bg-white">
          
          {/* Brillo holográfico */}
          <div className={cn(
            "pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300",
            isHovered && "opacity-100"
          )}>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
          </div>

          {/* Área de la imagen */}
          <div className="relative aspect-[3/4] overflow-hidden bg-slate-100">
            {!imageError && displayImage ? (
              <img
                src={displayImage}
                alt={employee.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center text-slate-300">
                <User className="h-12 w-12" />
                <span className="text-[10px] font-bold mt-2">SIN FOTO</span>
              </div>
            )}
            
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-white to-transparent" />
            
            {/* Rating badge */}
            {rating > 0 && (
              <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 shadow-md border border-[#f5ac0a]/20">
                <Star className="h-3 w-3 fill-[#f5ac0a] text-[#f5ac0a]" />
                <span className="text-xs font-bold text-[#2878a8]">{rating.toFixed(1)}</span>
              </div>
            )}

            {/* Award badge para destacados */}
            {rating >= 4.8 && (
              <div className="absolute left-2 top-2 rounded-full bg-[#2878a8] p-1.5 shadow-md">
                <Award className="h-4 w-4 text-white" />
              </div>
            )}
          </div>

          {/* Información */}
          <div className="relative p-4 text-center">
            <div className="absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-[#2878a8]/30 to-transparent" />
            
            <h4 className="font-serif text-lg font-bold text-[#2878a8]">
              {employee.name}
            </h4>
            <p className="mt-1 text-xs font-bold uppercase tracking-widest text-[#f5ac0a]">
              {employee.role}
            </p>
            
            {votes > 0 && (
              <p className="mt-2 text-[10px] font-medium text-slate-400">
                {votes} {votes === 1 ? "voto" : "votos"}
              </p>
            )}
            
            <div className="mt-3 flex items-center justify-center gap-1 text-xs font-bold uppercase tracking-tighter text-[#2878a8]">
              <span>Calificar Servicio</span>
              <svg className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </motion.button>
  )
}
