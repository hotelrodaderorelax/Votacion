"use client"

import * as React from "react"
import Image from "next/image" // Importamos el componente oficial de Next.js
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

  // --- LÓGICA DE IMAGEN (Igual que tu carrusel) ---
  const isLexilis = employee.name.toLowerCase().includes("lexilis")
  
  // Si es Lexilis, usamos la ruta local exacta. 
  // Nota: Usa / al principio para indicar la carpeta public
  const displayImage = isLexilis 
    ? "/Lexilis Mejia.jpeg" 
    : (employee.image_url || employee.image || "");

  const rating = employee.averageRating || 0

  return (
    <motion.button
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -8 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="group relative w-full perspective-1000 focus:outline-none"
    >
      <div className={cn(
        "relative overflow-hidden rounded-[2.5rem] border-b-[12px] p-1 shadow-2xl transition-all duration-300",
        "border-[#f5ac0a] bg-white"
      )}>
        <div className="relative overflow-hidden rounded-[2rem] bg-white">
          
          {/* Brillo al pasar el mouse */}
          <div className={cn(
            "pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-500",
            isHovered && "opacity-100"
          )}>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
          </div>

          {/* Área de la Foto usando Next.js Image */}
          <div className="relative aspect-[4/5] overflow-hidden bg-slate-50">
            {!imageError && displayImage ? (
              <Image
                src={displayImage}
                alt={employee.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center text-slate-200">
                <User className="h-20 w-20" />
                <span className="text-xs font-bold uppercase mt-2">Sin Foto</span>
              </div>
            )}
            
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-white via-white/20 to-transparent" />
            
            {/* Medalla Award */}
            {(isLexilis || rating >= 4.8) && (
              <div className="absolute left-3 top-3 z-20 rounded-full bg-[#2878a8] p-2 shadow-lg ring-4 ring-white">
                <Award className="h-5 w-5 text-white" />
              </div>
            )}
          </div>

          {/* Información */}
          <div className="relative p-6 text-center">
            <h4 className="font-serif text-2xl font-black tracking-tight text-[#2878a8]">
              {employee.name}
            </h4>
            <p className="mt-1 text-xs font-bold uppercase tracking-[0.2em] text-[#f5ac0a]">
              {employee.role}
            </p>
            
            <div className="mt-4 flex flex-col items-center gap-2">
              <div className="w-full bg-[#2878a8] text-white py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-colors group-hover:bg-[#1e5a7e]">
                Calificar Servicio
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.button>
  )
}
