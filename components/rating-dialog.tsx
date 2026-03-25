"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { User, CheckCircle, X, Hotel, ArrowLeft } from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// --- OPCIONES DE CALIFICACIÓN CON ICONOS SVG EXACTOS ---
const ratingOptions = [
  {
    value: "satisfied",
    label: "Súper Satisfecho",
    activeColor: "bg-[#00a651]", // Verde Esmeralda
    ringColor: "ring-[#00a651]",
    emoji: (
      <svg viewBox="0 0 24 24" className="h-10 w-10 text-inherit" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" fill="currentColor"/>
        <circle cx="8" cy="10" r="1.5" fill="white"/>
        <circle cx="16" cy="10" r="1.5" fill="white"/>
        <path d="M7.5 14C9.5 16.5 14.5 16.5 16.5 14" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    value: "neutral",
    label: "Regular",
    activeColor: "bg-[#f5ac0a]", // Naranja Corporativo
    ringColor: "ring-[#f5ac0a]",
    emoji: (
      <svg viewBox="0 0 24 24" className="h-10 w-10 text-inherit" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" fill="currentColor"/>
        <circle cx="8" cy="10" r="1.5" fill="white"/>
        <circle cx="16" cy="10" r="1.5" fill="white"/>
        <path d="M8 15H16" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    value: "unsatisfied",
    label: "Nada Satisfecho",
    activeColor: "bg-[#ed1c24]", // Rojo Alerta
    ringColor: "ring-[#ed1c24]",
    emoji: (
      <svg viewBox="0 0 24 24" className="h-10 w-10 text-inherit" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" fill="currentColor"/>
        <circle cx="8" cy="10" r="1.5" fill="white"/>
        <circle cx="16" cy="10" r="1.5" fill="white"/>
        <path d="M16 17C15 15 9 15 8 17" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
]

// --- PREGUNTAS EXACTAS DEL PDF ---
const allQuestions = [
  "¿Te sentiste bienvenid@ cuándo entraste en el hotel?",
  "¿Fue rápido y eficiente el registro?",
  "¿El personal de la recepción se mostró amable y cordial?",
  "¿La reserva contenía todos los servicios contratados?",
  "¿Recibió una habitación cómoda y limpia?",
  "¿La cama y las sábanas fueron confortables?",
  "¿El cuarto de baño estuvo limpio y equipado?",
  "¿Recomendarías nuestro hotel?",
];

interface RatingDialogProps {
  employee?: { name: string; image: string; role: string } | null
  area: string
  open: boolean
  onOpenChange: (open: boolean) => void
  type: "hotel" | "employee"
}

export function RatingDialog({ employee, area, open, onOpenChange, type }: RatingDialogProps) {
  const [currentStep, setCurrentStep] = React.useState(0)
  const [ratings, setRatings] = React.useState<Record<number, string>>({})
  const [isSubmitted, setIsSubmitted] = React.useState(false)

  const isHotel = type === "hotel";
  const questions = isHotel ? allQuestions : [allQuestions[0], allQuestions[2]]; // Ejemplo adaptado

  const handleRating = (value: string) => {
    setRatings((prev) => ({ ...prev, [currentStep]: value }))
    if (currentStep < questions.length - 1) {
      setTimeout(() => setCurrentStep(prev => prev + 1), 350)
    } else {
      setTimeout(() => setIsSubmitted(true), 350)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* Ajuste de redondez a 'xl' para igualar la primera versión */}
      <DialogContent className="sm:max-w-xl rounded-xl p-0 overflow-hidden bg-white shadow-xl border border-slate-100">
        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <motion.div key="survey" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8">
              
              {/* Header Contextual Adaptable */}
              <div className="flex items-center gap-4 mb-8 border-b pb-4">
                {isHotel ? (
                  <div className="h-12 w-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600 border border-slate-200">
                    <Hotel size={24} />
                  </div>
                ) : (
                  <img src={employee?.image} alt={employee?.name} className="h-12 w-12 rounded-xl object-cover border border-slate-200" />
                )}
                <div>
                  <h2 className="font-bold text-slate-900 uppercase text-[10px] tracking-tight">
                    Pregunta {currentStep + 1} de {questions.length}
                  </h2>
                  <p className="font-black text-amber-500 uppercase text-lg tracking-tighter">
                    {isHotel ? `Hotel Rodadero Relax` : employee?.name}
                  </p>
                </div>
              </div>

              {/* Pregunta y Botones */}
              <div className="text-center min-h-[300px] flex flex-col justify-center space-y-10">
                <h3 className="text-2xl font-bold text-slate-800 leading-tight px-4">
                  {questions[currentStep]}
                </h3>

                {/* BOTONES CON LÓGICA DE COLOR ACTIVO Y ICONOS SVG */}
                <div className="flex justify-center gap-6">
                  {ratingOptions.map((opt) => {
                    const isSelected = ratings[currentStep] === opt.value;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => handleRating(opt.value)}
                        className={cn(
                          "flex flex-col items-center gap-3 p-6 rounded-[2rem] border-2 transition-all duration-300 w-32",
                          // Si está seleccionado: Color sólido y escala fija
                          isSelected 
                            ? `${opt.activeColor} text-white ring-4 ring-offset-2 ${opt.ringColor} border-transparent shadow-lg scale-105` 
                            // Si NO está seleccionado: Borde gris suave y hover de color suave
                            : `bg-white border-slate-100 text-slate-400 hover:scale-105 ${opt.activeColor.replace('bg-','hover:bg-')}/10 hover:border-${opt.activeColor.replace('bg-','')}/30`
                        )}
                      >
                        <div className={cn("transition-transform duration-300", isSelected && "scale-110")}>
                          {opt.emoji}
                        </div>
                        <span className={cn(
                          "text-[9px] font-black uppercase tracking-tighter transition-colors text-center",
                          isSelected ? "text-white" : "text-slate-500"
                        )}>
                          {opt.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Botón Anterior */}
              {currentStep > 0 && (
                <Button variant="ghost" onClick={() => setCurrentStep(prev => prev - 1)} className="mt-8 text-slate-500 hover:text-slate-800 font-bold uppercase text-[9px] gap-1.5 p-0">
                  <ArrowLeft size={14} /> Anterior
                </Button>
              )}
            </motion.div>
          ) : (
            <motion.div key="thanks" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="p-16 text-center">
              <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-slate-900uppercase tracking-tighter mb-2">¡Gracias!</h2>
              <p className="text-slate-600 font-medium">Tu calificación nos ayuda a mejorar en Rodadero Relax.</p>
              <Button onClick={() => onOpenChange(false)} className="mt-12 rounded-full bg-slate-950 text-white px-10 h-12 uppercase font-black tracking-widest text-xs">Finalizar</Button>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}
