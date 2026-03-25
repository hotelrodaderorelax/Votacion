"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { User, CheckCircle, Hotel } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

interface Employee {
  id: string
  name: string
  role: string
  image: string
}

interface RatingDialogProps {
  employee: Employee | null
  area: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

// 1. Restauramos los SVGs para que se vean como en tus capturas
const ratingOptions = [
  {
    value: "satisfied",
    label: "Súper Satisfecho",
    activeColor: "bg-emerald-500", //
    ringColor: "ring-emerald-500",
    emoji: (
      <svg viewBox="0 0 24 24" className="h-10 w-10" fill="none">
        <circle cx="12" cy="12" r="10" fill="#FFCC33" />
        <circle cx="8" cy="10" r="1.5" fill="#4A2C00" />
        <circle cx="16" cy="10" r="1.5" fill="#4A2C00" />
        <path d="M8 15C9 17 15 17 16 15" stroke="#4A2C00" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    value: "neutral",
    label: "Regular",
    activeColor: "bg-amber-500", //
    ringColor: "ring-amber-500",
    emoji: (
      <svg viewBox="0 0 24 24" className="h-10 w-10" fill="none">
        <circle cx="12" cy="12" r="10" fill="#FFCC33" />
        <circle cx="8" cy="10" r="1.5" fill="#4A2C00" />
        <circle cx="16" cy="10" r="1.5" fill="#4A2C00" />
        <path d="M8 15H16" stroke="#4A2C00" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    value: "unsatisfied",
    label: "Nada Satisfecho",
    activeColor: "bg-red-500", //
    ringColor: "ring-red-500",
    emoji: (
      <svg viewBox="0 0 24 24" className="h-10 w-10" fill="none">
        <circle cx="12" cy="12" r="10" fill="#FFCC33" />
        <circle cx="8" cy="10" r="1.5" fill="#4A2C00" />
        <circle cx="16" cy="10" r="1.5" fill="#4A2C00" />
        <path d="M16 17C15 15 9 15 8 17" stroke="#4A2C00" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
]

const questions = {
  cocina: [
    "¿La comida fue de buena calidad?",
    "¿La porción de cada alimento fue equilibrada?",
    "¿Hubo variedad en los platos?",
    "¿La entrega del servicio fue ágil?",
    "¿Te gustó la presentación de los platos?",
  ],
  camareria: [
    "¿La habitación estaba limpia?",
    "¿La cama y las sábanas fueron confortables?",
    "¿El baño estuvo limpio y equipado?",
    "¿El inmobiliario estaba en buen estado?",
    "¿El personal fue amable y de confianza?",
  ],
  recepcion: [
    "¿Te sentiste bienvenido(a) al llegar?",
    "¿El registro fue rápido y eficiente?",
    "¿El personal fue amable y cordial?",
    "¿Tu reserva contenía todos los servicios?",
    "¿Respondieron a tus inquietudes?",
  ],
}

export function RatingDialog({ employee, area, open, onOpenChange, onSuccess }: RatingDialogProps) {
  const [currentQuestion, setCurrentQuestion] = React.useState(0)
  const [ratings, setRatings] = React.useState<Record<number, string>>({})
  const [comment, setComment] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isSubmitted, setIsSubmitted] = React.useState(false)
  const [imageError, setImageError] = React.useState(false)

  const areaQuestions = questions[area as keyof typeof questions] || []
  const totalQuestions = areaQuestions.length

  const handleRating = (e: React.MouseEvent, value: string) => {
    e.preventDefault();
    e.stopPropagation(); 
    
    setRatings((prev) => ({ ...prev, [currentQuestion]: value }))
    
    if (currentQuestion < totalQuestions - 1) {
      setTimeout(() => setCurrentQuestion((prev) => prev + 1), 400)
    }
  }

  const handleSubmit = async (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setIsSubmitting(true)
    
    const ratingValues = Object.values(ratings).map(r => 
      r === "satisfied" ? 5 : r === "neutral" ? 3 : 1
    )
    const avgRating = ratingValues.reduce((a, b) => a + b, 0) / ratingValues.length
    const voterId = `voter_${Date.now()}`
    
    try {
      const response = await fetch("/api/votes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employee_id: employee?.id,
          voter_identifier: voterId,
          friendliness: Math.round(avgRating),
          efficiency: Math.round(avgRating),
          problem_solving: Math.round(avgRating),
          cleanliness: Math.round(avgRating),
          comment,
        }),
      })
      
      if (!response.ok) throw new Error("Error en el servidor");
      
      setIsSubmitted(true)
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error submitting rating:", error)
      alert("Hubo un problema al enviar tu voto.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    onOpenChange(false)
    setTimeout(() => {
      setCurrentQuestion(0)
      setRatings({})
      setComment("")
      setIsSubmitted(false)
      setImageError(false)
    }, 300)
  }

  const allQuestionsAnswered = Object.keys(ratings).length === totalQuestions

  if (!employee) return null

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[95vh] overflow-y-auto sm:max-w-lg bg-white rounded-[2rem] border-none shadow-2xl p-0">
        <AnimatePresence mode="wait">
          {isSubmitted ? (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center py-12 text-center px-8">
              <div className="rounded-full bg-emerald-100 p-4">
                <CheckCircle className="h-12 w-12 text-emerald-600" />
              </div>
              <h3 className="mt-4 font-black text-2xl text-[#2878a8] uppercase tracking-tighter">¡Gracias!</h3>
              <p className="mt-2 text-muted-foreground text-sm font-medium">Tu opinión nos ayuda a mejorar.</p>
              <Button onClick={handleClose} className="mt-8 bg-slate-900 hover:bg-slate-800 rounded-full px-12 h-12 uppercase font-black text-xs tracking-widest">Finalizar</Button>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8">
              <DialogHeader className="mb-6">
                <div className="flex items-center gap-4">
                  <div className="relative h-14 w-14 overflow-hidden rounded-2xl bg-slate-100 border-2 border-amber-500/10 shrink-0">
                    {!imageError ? (
                      <img src={employee.image} alt={employee.name} className="h-full w-full object-cover" onError={() => setImageError(true)} />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-blue-50 text-blue-600"><Hotel size={24} /></div>
                    )}
                  </div>
                  <div className="text-left">
                    <DialogTitle className="text-xl text-[#2878a8] font-black leading-tight">{employee.name}</DialogTitle>
                    <DialogDescription className="font-black text-amber-500 uppercase text-[10px] tracking-widest leading-none mt-1">{employee.role}</DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              {/* Progress bar mejorada */}
              <div className="px-1">
                <div className="flex items-center justify-between text-[10px] font-black uppercase text-slate-400">
                  <span>Pregunta {currentQuestion + 1} de {totalQuestions}</span>
                  <span className="text-[#2878a8]">{Math.round((Object.keys(ratings).length / totalQuestions) * 100)}%</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                  <motion.div className="h-full bg-amber-500" animate={{ width: `${((currentQuestion + (ratings[currentQuestion] ? 1 : 0)) / totalQuestions) * 100}%` }} />
                </div>
              </div>

              {/* Question & Rating con corrección de fondo */}
              <div className="mt-8 min-h-[220px] flex flex-col justify-center">
                <AnimatePresence mode="wait">
                  <motion.div key={currentQuestion} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="text-center">
                    <h4 className="text-xl font-bold text-slate-800 leading-tight px-4">{areaQuestions[currentQuestion]}</h4>

                    <div className="mt-10 flex justify-center gap-4">
                      {ratingOptions.map((option) => {
                        const isSelected = ratings[currentQuestion] === option.value;
                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={(e) => handleRating(e, option.value)}
                            className={cn(
                              "flex flex-col items-center gap-3 rounded-[2rem] py-6 w-28 transition-all duration-300 border-2",
                              // CORRECCIÓN: Si está seleccionado, el fondo se queda pintado
                              isSelected 
                                ? `${option.activeColor} text-white border-transparent scale-105 shadow-xl` 
                                : "bg-white border-slate-50 text-slate-400 hover:bg-slate-50"
                            )}
                          >
                            <div className="shrink-0 scale-110">{option.emoji}</div>
                            <span className={cn("text-[9px] font-black uppercase tracking-tighter", isSelected ? "text-white" : "text-slate-500")}>
                              {option.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {allQuestionsAnswered && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 pt-4 border-t border-slate-100">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-2">¿Algún comentario adicional?</label>
                  <Textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Opcional..." className="rounded-xl border-slate-200 focus:ring-amber-500" />
                  <Button type="button" onClick={handleSubmit} disabled={isSubmitting} className="mt-6 w-full bg-[#2878a8] hover:bg-[#1e5a7e] text-white h-14 rounded-2xl font-black uppercase tracking-widest shadow-lg">
                    {isSubmitting ? "Enviando..." : "Enviar Votación"}
                  </Button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}
