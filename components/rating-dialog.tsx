"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { User, Send, CheckCircle, Loader2, Hotel } from "lucide-react"
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
  type?: "hotel" | "employee" // Nueva propiedad para distinguir
}

const ratingOptions = [
  { value: "satisfied", label: "Excelente", color: "bg-emerald-500", ringColor: "ring-emerald-500", emoji: "😊" },
  { value: "neutral", label: "Bueno", color: "bg-amber-500", ringColor: "ring-amber-500", emoji: "😐" },
  { value: "unsatisfied", label: "Regular/Malo", color: "bg-red-500", ringColor: "ring-red-500", emoji: "😟" },
]

const questions = {
  // Encuesta de Satisfacción del Hotel (Basado en tu PDF)
  hotel: [
    "¿Te sentiste bienvenido(a) al entrar al hotel?",
    "¿El registro fue rápido y eficiente?",
    "¿Recibió una habitación cómoda y limpia?",
    "¿La cama y las sábanas fueron confortables?",
    "¿El baño estuvo limpio y equipado?",
    "¿La comida fue de buena calidad y porción adecuada?",
    "¿Percibió tranquilidad en el hotel?",
    "¿Recomendarías nuestro hotel a otras personas?",
  ],
  // Encuestas por Área / Empleado
  cocina: [
    "¿La comida fue de buena calidad?",
    "¿La porción de cada alimento fue equilibrada?",
    "¿La entrega del servicio fue ágil?",
    "¿Te gustó la presentación de los platos?",
  ],
  camareria: [
    "¿La habitación estaba limpia?",
    "¿La cama y las sábanas fueron confortables?",
    "¿El personal de limpieza fue amable y de confianza?",
  ],
  recepcion: [
    "¿El personal fue amable y cordial?",
    "¿Tu reserva contenía todos los servicios?",
    "¿Respondieron a tus inquietudes eficientemente?",
  ],
}

export function RatingDialog({ employee, area, open, onOpenChange, onSuccess, type = "employee" }: RatingDialogProps) {
  const [currentQuestion, setCurrentQuestion] = React.useState(0)
  const [ratings, setRatings] = React.useState<Record<number, string>>({})
  const [comment, setComment] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isSubmitted, setIsSubmitted] = React.useState(false)

  // Selecciona preguntas según el tipo
  const areaQuestions = type === "hotel" ? questions.hotel : (questions[area as keyof typeof questions] || [])
  const totalQuestions = areaQuestions.length

  const handleRating = (value: string) => {
    setRatings((prev) => ({ ...prev, [currentQuestion]: value }))
    if (currentQuestion < totalQuestions - 1) {
      setTimeout(() => setCurrentQuestion((prev) => prev + 1), 300)
    }
  }

  const handleSubmit = async () => {
    if (isSubmitting) return
    setIsSubmitting(true)

    try {
      // Aquí enviarías a tu API diferenciando por tipo
      const response = await fetch("/api/votes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type, // "hotel" o "employee"
          target_id: type === "employee" ? employee?.id : "hotel_general",
          ratings,
          comment,
        }),
      })

      if (!response.ok) throw new Error("Error")
      setIsSubmitted(true)
      onSuccess?.()
    } catch (error) {
      console.error(error)
      alert("Hubo un error al enviar. Inténtalo de nuevo.")
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
    }, 300)
  }

  const allQuestionsAnswered = Object.keys(ratings).length === totalQuestions

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[95vh] overflow-y-auto sm:max-w-lg bg-white rounded-[2.5rem] p-0 border-none shadow-2xl">
        <AnimatePresence mode="wait">
          {isSubmitted ? (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center py-12 px-6 text-center">
              <div className="rounded-full bg-emerald-100 p-6 mb-6">
                <CheckCircle className="h-16 w-16 text-emerald-600" />
              </div>
              <h3 className="font-serif text-3xl font-black text-[#2878a8] mb-2">¡Gracias por tu opinión!</h3>
              <p className="text-slate-500 text-lg">Nos ayudas a mejorar el <span className="block font-bold text-[#f5ac0a]">Hotel Rodadero Relax</span></p>
              <Button onClick={handleClose} className="mt-10 bg-[#2878a8] rounded-2xl px-12 py-7 text-lg font-black uppercase shadow-lg">Cerrar</Button>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 md:p-8">
              <DialogHeader className="mb-8">
                <div className="flex items-center gap-5">
                  <div className="relative h-20 w-20 overflow-hidden rounded-[1.5rem] bg-slate-50 ring-4 ring-[#f5ac0a]/10 flex items-center justify-center">
                    {type === "hotel" ? (
                      <Hotel className="h-10 w-10 text-[#2878a8]" />
                    ) : (
                      <img src={employee?.image} alt={employee?.name} className="h-full w-full object-cover" />
                    )}
                  </div>
                  <div className="text-left">
                    <DialogTitle className="font-serif text-2xl text-[#2878a8] font-black leading-tight">
                      {type === "hotel" ? "Encuesta de Satisfacción" : employee?.name}
                    </DialogTitle>
                    <DialogDescription className="font-black text-[#f5ac0a] uppercase text-[11px] tracking-[0.2em] mt-1">
                      {type === "hotel" ? "Estadía General" : employee?.role}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              {/* Barra de Progreso */}
              <div className="mb-10">
                <div className="flex items-center justify-between text-[11px] font-black uppercase text-slate-400 mb-3 tracking-wider">
                  <span>Pregunta {currentQuestion + 1} de {totalQuestions}</span>
                  <span className="text-[#2878a8]">{Math.round((Object.keys(ratings).length / totalQuestions) * 100)}%</span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#2878a8] to-[#f5ac0a]"
                    animate={{ width: `${((currentQuestion + (ratings[currentQuestion] ? 1 : 0)) / totalQuestions) * 100}%` }}
                  />
                </div>
              </div>

              {/* Preguntas */}
              <div className="min-h-[240px]">
                <AnimatePresence mode="wait">
                  <motion.div key={currentQuestion} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="text-center">
                    <h4 className="text-xl font-bold text-slate-800 leading-snug mb-10">{areaQuestions[currentQuestion]}</h4>
                    <div className="grid grid-cols-3 gap-4">
                      {ratingOptions.map((option) => (
                        <div
                          key={option.value}
                          role="button"
                          onClick={() => handleRating(option.value)}
                          className={cn(
                            "flex flex-col items-center gap-4 rounded-[2rem] py-8 cursor-pointer transition-all shadow-sm",
                            option.color,
                            ratings[currentQuestion] === option.value ? "scale-105 ring-[6px] ring-offset-2 " + option.ringColor : "opacity-90 hover:opacity-100"
                          )}
                        >
                          <span className="text-5xl">{option.emoji}</span>
                          <span className="text-[10px] font-black uppercase text-white tracking-wider">{option.label}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {allQuestionsAnswered && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-10 pt-8 border-t-2 border-slate-50">
                  <Textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="¿Algún comentario adicional?"
                    className="rounded-2xl min-h-[120px]"
                  />
                  <Button onClick={handleSubmit} disabled={isSubmitting} className="mt-8 w-full bg-[#2878a8] py-8 rounded-[1.5rem] font-black uppercase tracking-[0.25em] shadow-xl">
                    {isSubmitting ? <Loader2 className="h-6 w-6 animate-spin" /> : "Enviar Resultados"}
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
