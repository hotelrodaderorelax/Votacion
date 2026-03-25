"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { User, CheckCircle, X, Hotel, Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
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
  type?: "employee" | "hotel"
}

// 1. Restauramos tus SVGs originales con la lógica de color fija
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
    color: "bg-amber-500", 
    hoverColor: "hover:bg-amber-600",
    ringColor: "ring-amber-500",
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

// Preguntas del cuestionario
const questions = {
  recepcion: [
    "¿Te sentiste bienvenido(a) al llegar?",
    "¿El registro fue rápido y eficiente?",
    "¿El personal fue amable y cordial?",
    "¿Respondieron a tus inquietudes?",
  ],
  camareria: [
    "¿La habitación estaba limpia?",
    "¿La cama y las sábanas fueron confortables?",
    "¿El personal fue amable y de confianza?",
  ],
  cocina: [
    "¿La comida fue de buena calidad?",
    "¿La porción de cada alimento fue adecuada?",
    "¿La entrega del servicio fue ágil?",
  ]
}

export function RatingDialog({ employee, area, open, onOpenChange, onSuccess, type = "employee" }: RatingDialogProps) {
  const [currentQuestion, setCurrentQuestion] = React.useState(0)
  const [ratings, setRatings] = React.useState<Record<number, string>>({})
  const [comment, setComment] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isSubmitted, setIsSubmitted] = React.useState(false)

  const areaQuestions = questions[area as keyof typeof questions] || []
  const totalQuestions = areaQuestions.length

  const handleRating = (value: string) => {
    setRatings((prev) => ({ ...prev, [currentQuestion]: value }))
    if (currentQuestion < totalQuestions - 1) {
      setTimeout(() => setCurrentQuestion((prev) => prev + 1), 400)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    setIsSubmitted(true)
    onSuccess?.()
  }

  const handleClose = () => {
    onOpenChange(false)
    setTimeout(() => {
      setCurrentQuestion(0)
      setRatings({})
      setComment("")
      setIsSubmitted(false)
    }, 300)
  }

  const allQuestionsAnswered = Object.keys(ratings).length === totalQuestions

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[95vh] overflow-y-auto sm:max-w-lg bg-white rounded-[2.5rem] p-0 border-none shadow-2xl">
        <AnimatePresence mode="wait">
          {isSubmitted ? (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="p-12 text-center">
              <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
              <h3 className="text-2xl font-black text-slate-800 uppercase">¡Gracias!</h3>
              <Button onClick={handleClose} className="mt-8 bg-slate-900 rounded-full px-10">Cerrar</Button>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8">
              {/* Header con info del empleado */}
              <div className="flex items-center gap-4 mb-8 border-b pb-4">
                <img src={employee?.image} alt={employee?.name} className="h-14 w-14 rounded-xl object-cover border" />
                <div>
                  <h2 className="font-black text-slate-800 uppercase text-sm tracking-tight">{employee?.name}</h2>
                  <p className="text-[10px] font-bold text-orange-400 uppercase">{employee?.role}</p>
                </div>
              </div>

              {/* Pregunta actual */}
              <div className="text-center space-y-8 min-h-[250px] flex flex-col justify-center">
                <h4 className="text-xl font-bold text-slate-800 leading-tight">
                  {areaQuestions[currentQuestion]}
                </h4>

                {/* Botones con caras y color persistente */}
                <div className="flex justify-center gap-4">
                  {ratingOptions.map((option) => {
                    const isSelected = ratings[currentQuestion] === option.value;
                    return (
                      <button
                        key={option.value}
                        onClick={() => handleRating(option.value)}
                        className={cn(
                          "flex flex-col items-center gap-3 rounded-3xl p-5 transition-all duration-300 w-28 border-2",
                          isSelected 
                            ? `${option.color} text-white border-transparent scale-110 shadow-lg` 
                            : `bg-white border-slate-100 text-slate-400 ${option.hoverColor} hover:text-white hover:border-transparent`
                        )}
                      >
                        <div className={cn("transition-transform", isSelected && "scale-110")}>
                          {option.face}
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-tighter">
                          {option.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Comentarios finales */}
              {allQuestionsAnswered && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-8 space-y-4">
                  <Textarea 
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="¿Algo más que desees agregar?"
                    className="rounded-2xl border-slate-100 focus:ring-slate-900"
                  />
                  <Button onClick={handleSubmit} disabled={isSubmitting} className="w-full h-14 bg-slate-900 rounded-2xl font-black uppercase tracking-widest">
                    {isSubmitting ? <Loader2 className="animate-spin" /> : "Enviar Mi Opinión"}
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
