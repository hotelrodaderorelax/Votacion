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
      whileHover={{ y: -8, rotateY: 5 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="group relative w-full perspective-1000"
    >
      {/* Card with collectible/trading card style */}
      <div className={cn(
        "relative overflow-hidden rounded-xl border-2 bg-gradient-to-br from-card to-secondary/30 p-1 shadow-lg transition-all duration-300",
        "border-primary/20 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10"
      )}>
        {/* Inner card content */}
        <div className="relative overflow-hidden rounded-lg bg-card">
          {/* Holographic shine effect */}
          <div className={cn(
            "pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300",
            isHovered && "opacity-100"
          )}>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
          </div>

          {/* Employee image area */}
          <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-primary/5 to-accent/10">
            {!imageError ? (
              <img
                src={employee.image}
                alt={employee.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <div className="flex flex-col items-center gap-3 text-muted-foreground">
                  <div className="rounded-full bg-muted p-6">
                    <User className="h-12 w-12" />
                  </div>
                </div>
              </div>
            )}
            
            {/* Gradient overlay at bottom */}
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-card to-transparent" />
            
            {/* Rating badge in corner */}
            {rating > 0 && (
              <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-accent/90 px-2 py-1 shadow-md">
                <Star className="h-3 w-3 fill-accent-foreground text-accent-foreground" />
                <span className="text-xs font-semibold text-accent-foreground">
                  {rating.toFixed(1)}
                </span>
              </div>
            )}

            {/* Top performer badge */}
            {rating >= 4.8 && (
              <div className="absolute left-2 top-2 rounded-full bg-primary p-1.5 shadow-md">
                <Award className="h-4 w-4 text-primary-foreground" />
              </div>
            )}
          </div>

          {/* Employee info */}
          <div className="relative p-4 text-center">
            {/* Decorative border */}
            <div className="absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
            
            <h4 className="font-serif text-lg font-semibold text-foreground">
              {employee.name}
            </h4>
            <p className="mt-1 text-sm text-muted-foreground">
              {employee.role}
            </p>
            
            {/* Vote count */}
            {votes > 0 && (
              <p className="mt-2 text-xs text-muted-foreground">
                {votes} {votes === 1 ? "voto" : "votos"}
              </p>
            )}
            
            {/* Call to action */}
            <div className="mt-3 flex items-center justify-center gap-1 text-xs font-medium text-primary">
              <span>Calificar</span>
              <svg
                className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </motion.button>
  )
}
