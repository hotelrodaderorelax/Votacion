"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { User, Send, CheckCircle, X, ChevronLeft } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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

  const handleRating = (value: string) => {
    // Guardamos la calificación
    setRatings((prev) => ({ ...prev, [currentQuestion]: value }))
    
    // Agregamos un pequeño delay antes de pasar a la siguiente para que el usuario
    // vea que el botón cambió de color al seleccionarlo
    if (currentQuestion < totalQuestions - 1) {
      setTimeout(() => setCurrentQuestion((prev) => prev + 1), 400)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    // Simulación de envío
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsSubmitted(true)
    onSuccess?.()
    setIsSubmitting(false)
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
      <DialogContent className="max-h-[95vh] overflow-y-auto sm:max-w-lg bg-white rounded-[2rem]">
        <AnimatePresence mode="wait">
          {isSubmitted ? (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center py-12 text-center">
              <div className="rounded-full bg-emerald-100 p-4 mb-4">
                <CheckCircle className="h-12 w-12 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800">¡Gracias por tu opinión!</h3>
              <p className="text-slate-500 mt-2">Tu calificación nos ayuda a mejorar.</p>
              <Button onClick={handleClose} className="mt-8 px-10 rounded-full bg-slate-900">Cerrar</Button>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <DialogHeader className="flex flex-row items-center gap-4 space-y-0 text-left border-b pb-4">
                <div className="relative h-14 w-14 overflow-hidden rounded-xl bg-muted border">
                  {!imageError ? (
                    <img src={employee.image} alt={employee.name} className="h-full w-full object-cover" onError={() => setImageError(true)} />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center"><User className="h-6 w-6 text-muted-foreground" /></div>
                  )}
                </div>
                <div className="flex-1">
                  <DialogTitle className="text-lg font-bold text-slate-800">{employee.name}</DialogTitle>
                  <DialogDescription className="text-xs uppercase font-semibold text-amber-500">{employee.role}</DialogDescription>
                </div>
                <button onClick={handleClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X className="h-5 w-5 text-slate-400" /></button>
              </DialogHeader>

              {/* Progreso */}
              <div className="mt-6 space-y-2">
                <div className="flex justify-between text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                  <span>Pregunta {currentQuestion + 1} de {totalQuestions}</span>
                  <span>{Math.round((Object.keys(ratings).length / totalQuestions) * 100)}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-slate-900"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentQuestion + (ratings[currentQuestion] ? 1 : 0)) / totalQuestions) * 100}%` }}
                  />
                </div>
              </div>

              {/* Pregunta Actual */}
              <div className="mt-8 min-h-[220px] flex flex-col items-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentQuestion}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-center space-y-8 w-full"
                  >
                    <h4 className="text-xl font-bold text-slate-800 px-4 leading-tight">
                      {areaQuestions[currentQuestion]}
                    </h4>

                    {/* Botones de Calificación */}
                    <div className="flex justify-center gap-4">
                      {ratingOptions.map((option) => {
                        const isSelected = ratings[currentQuestion] === option.value;
                        return (
                          <button
                            key={option.value}
                            onClick={() => handleRating(option.value)}
                            className={cn(
                              "flex flex-col items-center gap-3 rounded-2xl p-4 transition-all duration-300 w-28",
                              // Si está seleccionado, aplicamos el color de fondo completo
                              isSelected 
                                ? `${option.color} text-white scale-110 shadow-lg ring-2 ring-offset-2 ${option.ringColor}` 
                                : `bg-white border-2 border-slate-100 text-slate-400 hover:border-slate-200 ${option.hoverColor} hover:text-white`
                            )}
                          >
                            <div className={cn("transition-transform duration-300", isSelected && "scale-110")}>
                              {option.face}
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-tighter">
                              {option.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Comentarios (Se muestra al terminar preguntas) */}
              {allQuestionsAnswered && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-8 border-t pt-6">
                  <label className="text-xs font-bold uppercase text-slate-400 mb-2 block">¿Algún comentario adicional? (Opcional)</label>
                  <Textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Cuéntanos más..."
                    className="min-h-[100px] rounded-2xl border-slate-100 focus:ring-slate-900"
                  />
                  <Button 
                    onClick={handleSubmit} 
                    disabled={isSubmitting} 
                    className="mt-6 w-full h-14 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold uppercase tracking-widest shadow-xl"
                  >
                    {isSubmitting ? "Enviando..." : "Enviar Calificación"}
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
