"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, Hotel, Loader2, User } from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// 1. Configuración de Emojis con sus colores originales
const ratingOptions = [
  {
    value: "satisfied",
    label: "Súper Satisfecho",
    activeBg: "bg-emerald-500", // Verde cuando se selecciona
    hoverBg: "hover:bg-emerald-50",
    emoji: (
      <svg viewBox="0 0 24 24" className="h-12 w-12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" fill="#FFCC33"/>
        <circle cx="8" cy="10" r="1.5" fill="#4A2C00"/>
        <circle cx="16" cy="10" r="1.5" fill="#4A2C00"/>
        <path d="M8 15C9 17 15 17 16 15" stroke="#4A2C00" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    value: "neutral",
    label: "Regular",
    activeBg: "bg-amber-500", // Naranja cuando se selecciona
    hoverBg: "hover:bg-amber-50",
    emoji: (
      <svg viewBox="0 0 24 24" className="h-12 w-12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" fill="#FFCC33"/>
        <circle cx="8" cy="10" r="1.5" fill="#4A2C00"/>
        <circle cx="16" cy="10" r="1.5" fill="#4A2C00"/>
        <path d="M8 15H16" stroke="#4A2C00" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    value: "unsatisfied",
    label: "Nada Satisfecho",
    activeBg: "bg-red-500", // Rojo cuando se selecciona
    hoverBg: "hover:bg-red-50",
    emoji: (
      <svg viewBox="0 0 24 24" className="h-12 w-12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" fill="#FFCC33"/>
        <circle cx="8" cy="10" r="1.5" fill="#4A2C00"/>
        <circle cx="16" cy="10" r="1.5" fill="#4A2C00"/>
        <path d="M16 17C15 15 9 15 8 17" stroke="#4A2C00" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
]

export function RatingDialog({ employee, area, open, onOpenChange, type = "hotel" }) {
  const [currentStep, setCurrentStep] = React.useState(0)
  const [ratings, setRatings] = React.useState({})
  const [isSubmitted, setIsSubmitted] = React.useState(false)

  // Preguntas para el hotel o personal
  const questions = type === "hotel" 
    ? ["¿Te sentiste bienvenid@ cuándo entraste en el hotel?", "¿Fue rápido y eficiente el registro?"]
    : ["¿El trato recibido fue cordial y atento?", "¿El personal respondió a tus inquietudes?"]

  const handleRating = (value) => {
    setRatings((prev) => ({ ...prev, [currentStep]: value }))
    if (currentStep < questions.length - 1) {
      setTimeout(() => setCurrentStep(currentStep + 1), 400)
    } else {
      setIsSubmitted(true)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg rounded-[2.5rem] p-0 overflow-hidden border-none bg-white shadow-2xl">
        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <motion.div key="form" className="p-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Header con foto o icono */}
              <div className="flex items-center gap-4 mb-8">
                {type === "employee" ? (
                  <img src={employee?.image} className="h-12 w-12 rounded-2xl object-cover border" />
                ) : (
                  <div className="h-12 w-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                    <Hotel size={24} />
                  </div>
                )}
                <div>
                  <h2 className="font-black text-slate-800 uppercase text-xs tracking-tight">
                    {type === "hotel" ? "Calificar Hotel" : `Calificar a ${employee?.name}`}
                  </h2>
                  <p className="text-[10px] font-bold text-orange-400 uppercase">{area}</p>
                </div>
              </div>

              {/* Pregunta y Botones */}
              <div className="text-center space-y-8 min-h-[280px] flex flex-col justify-center">
                <h3 className="text-2xl font-bold text-slate-800 leading-tight px-4">
                  {questions[currentStep]}
                </h3>

                <div className="flex justify-center gap-4">
                  {ratingOptions.map((opt) => {
                    const isSelected = ratings[currentStep] === opt.value
                    return (
                      <button
                        key={opt.value}
                        onClick={() => handleRating(opt.value)}
                        className={cn(
                          "flex flex-col items-center gap-3 p-5 rounded-[2rem] transition-all duration-300 w-28 border-2",
                          // Lógica de color fija: Si está seleccionado, mantiene su color
                          isSelected 
                            ? `${opt.activeBg} text-white border-transparent scale-105 shadow-lg` 
                            : `bg-white border-slate-50 text-slate-400 ${opt.hoverBg} hover:scale-105`
                        )}
                      >
                        <div className="shrink-0">{opt.emoji}</div>
                        <span className={cn(
                          "text-[9px] font-black uppercase tracking-tighter text-center leading-none",
                          isSelected ? "text-white" : "text-slate-400"
                        )}>
                          {opt.label}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div key="thanks" className="p-12 text-center" initial={{ scale: 0.9 }} animate={{ scale: 1 }}>
              <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
              <h2 className="text-2xl font-black text-slate-800 uppercase">¡Muchas Gracias!</h2>
              <Button onClick={() => onOpenChange(false)} className="mt-8 rounded-full bg-slate-900 px-8">Finalizar</Button>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}
