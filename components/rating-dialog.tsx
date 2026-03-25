"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { User, Send, CheckCircle, X, Hotel } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

interface RatingDialogProps {
  employee?: { id: string; name: string; image: string; role: string } | null
  area: string
  open: boolean
  onOpenChange: (open: boolean) => void
  type?: "employee" | "hotel"
}

// Configuración de Emojis con colores fijos
const ratingOptions = [
  {
    value: "satisfied",
    label: "Súper Satisfecho",
    color: "bg-emerald-500", 
    hoverColor: "hover:bg-emerald-600",
    ringColor: "ring-emerald-500",
    face: (
      <svg viewBox="0 0 24 24" className="h-10 w-10" fill="none">
        <circle cx="12" cy="12" r="10" fill="currentColor" />
        <circle cx="8" cy="10" r="1.5" fill="white" />
        <circle cx="16" cy="10" r="1.5" fill="white" />
        <path d="M8 15c1.5 2 5.5 2 8 0" stroke="white" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    value: "neutral",
    label: "Regular",
    color: "bg-[#f5ac0a]", 
    hoverColor: "hover:bg-orange-600",
    ringColor: "ring-[#f5ac0a]",
    face: (
      <svg viewBox="0 0 24 24" className="h-10 w-10" fill="none">
        <circle cx="12" cy="12" r="10" fill="currentColor" />
        <circle cx="8" cy="10" r="1.5" fill="white" />
        <circle cx="16" cy="10" r="1.5" fill="white" />
        <path d="M8 15h8" stroke="white" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    value: "unsatisfied",
    label: "Nada Satisfecho",
    color: "bg-red-500", 
    hoverColor: "hover:bg-red-600",
    ringColor: "ring-red-500",
    face: (
      <svg viewBox="0 0 24 24" className="h-10 w-10" fill="none">
        <circle cx="12" cy="12" r="10" fill="currentColor" />
        <circle cx="8" cy="10" r="1.5" fill="white" />
        <circle cx="16" cy="10" r="1.5" fill="white" />
        <path d="M8 17c1.5-2 5.5-2 8 0" stroke="white" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
]

export function RatingDialog({ employee, area, open, onOpenChange, type = "hotel" }: RatingDialogProps) {
  const [currentStep, setCurrentStep] = React.useState(0)
  const [ratings, setRatings] = React.useState<Record<number, string>>({})
  const [isSubmitted, setIsSubmitted] = React.useState(false)

  // Preguntas extraídas del documento oficial
  const questions = [
    "¿Te sentiste bienvenid@ cuándo entraste en el hotel?",
    "¿Fue rápido y eficiente el registro?",
    "¿El personal de la recepción se mostró amable y cordial?",
    "¿Recibió una habitación cómoda y limpia?",
    "¿La comida fue de buena calidad?",
    "¿Recomendarías nuestro hotel a otras personas?",
  ]

  const handleRating = (value: string) => {
    setRatings((prev) => ({ ...prev, [currentStep]: value }))
    if (currentStep < questions.length - 1) {
      setTimeout(() => setCurrentStep(currentStep + 1), 400)
    } else {
      setIsSubmitted(true)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl">
        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="h-12 w-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                  <Hotel size={24} />
                </div>
                <div>
                  <h2 className="font-black text-blue-900 uppercase text-xs tracking-tighter">Encuesta de Satisfacción</h2>
                  <p className="text-[10px] font-bold text-orange-400 uppercase">Rodadero Relax</p>
                </div>
              </div>

              <div className="text-center space-y-8 min-h-[300px] flex flex-col justify-center">
                <h3 className="text-2xl font-bold text-slate-800 leading-tight">
                  {questions[currentStep]}
                </h3>

                {/* Grid de botones corregido para evitar el fondo blanco en hover */}
                <div className="flex justify-center gap-4">
                  {ratingOptions.map((opt) => {
                    const isSelected = ratings[currentStep] === opt.value
                    return (
                      <button
                        key={opt.value}
                        onClick={() => handleRating(opt.value)}
                        className={cn(
                          "flex flex-col items-center gap-3 p-5 rounded-3xl transition-all duration-300 w-28 border-2",
                          // Lógica de color persistente:
                          isSelected 
                            ? `${opt.color} text-white border-transparent scale-110 shadow-xl` 
                            : `bg-white border-slate-100 text-slate-400 ${opt.hoverColor} hover:text-white hover:border-transparent`
                        )}
                      >
                        <div className={cn("transition-transform", isSelected && "scale-110")}>
                          {opt.face}
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-tighter">
                          {opt.label}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div className="p-12 text-center" initial={{ scale: 0.9 }} animate={{ scale: 1 }}>
              <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
              <h2 className="text-2xl font-black text-blue-900 uppercase">¡Gracias!</h2>
              <Button onClick={() => onOpenChange(false)} className="mt-8 rounded-full bg-blue-900">Cerrar</Button>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}
