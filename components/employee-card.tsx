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
    // Mantenemos ambos por si acaso, pero el código priorizará el correcto
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

  // Priorizamos la URL de la imagen que venga de la base de datos
  const displayImage = employee.image_url || employee.image
  const rating = employee.averageRating || 0
  const votes = employee.totalVotes || 0

  return (
    <motion.button
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -8, rotateY: 5 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="group relative w-full perspective-1000"
    >
      {/* Borde con tu Naranja #f5ac0a */}
      <div className={cn(
        "relative overflow-hidden rounded-xl border-2 p-1 shadow-lg transition-all duration-300",
        "border-[#f5ac0a]/20 hover:border-[#f5ac0a] hover:shadow-xl hover:shadow-[#2878a8]/10",
        "bg-gradient-to-br from-white to-slate-50"
      )}>
        <div className="relative overflow-hidden rounded-lg bg-white">
          
          {/* Brillo Holográfico */}
          <div className={cn(
            "pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300",
            isHovered && "opacity-100"
          )}>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
          </div>

          {/* Área de la Foto */}
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
                <span className="text-[10px] font-bold uppercase mt-2">Sin Foto</span>
              </div>
            )}
            
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-white to-transparent" />
            
            {/* Rating con tu Naranja */}
            {rating > 0 && (
              <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 shadow-md border border-[#f5ac0a]/20">
                <Star className="h-3 w-3 fill-[#f5ac0a] text-[#f5ac0a]" />
                <span className="text-xs font-bold text-[#2878a8]">{rating.toFixed(1)}</span>
              </div>
            )}

            {/* Award con tu Azul #2878a8 */}
            {(employee.name === "Lexilis Mejía" || rating >= 4.8) && (
              <div className="absolute left-2 top-2 rounded-full bg-[#2878a8] p-1.5 shadow-md">
                <Award className="h-4 w-4 text-white" />
              </div>
            )}
          </div>

          {/* Información con tu Azul */}
          <div className="relative p-4 text-center">
            <div className="absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-[#2878a8]/20 to-transparent" />
            
            <h4 className="font-serif text-lg font-black text-[#2878a8]">
              {employee.name}
            </h4>
            <p className="mt-1 text-xs font-bold uppercase tracking-wider text-[#f5ac0a]">
              {employee.role}
            </p>
            
            {votes > 0 && (
              <p className="mt-2 text-[10px] font-bold text-slate-400 uppercase">
                {votes} {votes === 1 ? "voto" : "votos"}
              </p>
            )}
            
            <div className="mt-3 flex items-center justify-center gap-1 text-xs font-black uppercase tracking-widest text-[#2878a8]">
              <span>Calificar</span>
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
