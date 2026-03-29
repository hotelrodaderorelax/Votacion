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
    image: string
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

  return (
    <motion.button
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -10, rotateY: 2 }}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className="group relative w-full perspective-1000"
    >
      <div className={cn(
        "relative overflow-hidden rounded-[2.5rem] border-b-[12px] bg-gradient-to-br p-1 shadow-2xl transition-all duration-300",
        "border-[#f5ac0a] bg-white",
        isHovered && "shadow-[#2878a8]/20"
      )}>
        <div className="relative overflow-hidden rounded-[2rem] bg-white">
          
          {/* Área de la Foto */}
          <div className="relative aspect-[4/5] overflow-hidden bg-slate-50">
            {!imageError && employee.image ? (
              <img
                src={employee.image}
                alt={employee.name}
                className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center bg-[#2878a8]/5">
                <User className="h-20 w-20 text-[#2878a8]/20" />
                <p className="text-[10px] font-bold text-[#2878a8]/40 uppercase mt-2">Sin Foto</p>
              </div>
            )}
            
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-white via-white/20 to-transparent" />
            
            {/* Calificación */}
            {rating > 0 && (
              <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/90 backdrop-blur-sm px-3 py-1.5 shadow-lg border border-[#f5ac0a]/20">
                <Star className="h-4 w-4 fill-[#f5ac0a] text-[#f5ac0a]" />
                <span className="text-sm font-black text-[#2878a8]">{rating.toFixed(1)}</span>
              </div>
            )}

            {/* Sello Elite */}
            {(employee.name === "Lexilis Mejía" || rating >= 4.8) && (
              <div className="absolute left-3 top-3 rounded-full bg-[#2878a8] p-2 shadow-lg ring-4 ring-white">
                <Award className="h-5 w-5 text-white" />
              </div>
            )}
          </div>

          {/* Información */}
          <div className="relative p-6 text-center">
            <h4 className="font-serif text-2xl font-black tracking-tight text-[#2878a8]">{employee.name}</h4>
            <p className="mt-1 text-xs font-bold uppercase tracking-[0.2em] text-[#f5ac0a]">{employee.role}</p>
            
            <div className="mt-4 flex flex-col items-center gap-2">
               <div className="w-full bg-[#2878a8] text-white py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-colors group-hover:bg-[#1e5a7e]">
                 Calificar Servicio
               </div>
               {votes > 0 && (
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                  {votes} {votes === 1 ? "voto recibido" : "votos recibidos"}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.button>
  )
}
