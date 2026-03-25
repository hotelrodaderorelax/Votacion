"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { User, Send, CheckCircle } from "lucide-react"
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

const ratingOptions = [
  {
    value: "satisfied",
    label: "Súper Satisfecho",
    color: "bg-emerald-500 hover:bg-emerald-600",
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
    color: "bg-amber-500 hover:bg-amber-600",
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
    color: "bg-red-500 hover:bg-red-600",
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
    setRatings((prev) => ({ ...prev, [currentQuestion]: value }))
    if (currentQuestion < totalQuestions - 1) {
      setTimeout(() => setCurrentQuestion((prev) => prev + 1), 300)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    
    // Convert ratings to numeric values (satisfied=5, neutral=3, unsatisfied=1)
    const ratingValues = Object.values(ratings).map(r => 
      r === "satisfied" ? 5 : r === "neutral" ? 3 : 1
    )
    const avgRating = ratingValues.reduce((a, b) => a + b, 0) / ratingValues.length
    
    // Generate a unique voter identifier (in production, use session/IP)
    const voterId = `voter_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // Submit to API
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
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Error al enviar")
      }
      
      setIsSubmitted(true)
      onSuccess?.()
    } catch (error) {
      console.error("Error submitting rating:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    onOpenChange(false)
    // Reset state after dialog closes
    setTimeout(() => {
      setCurrentQuestion(0)
      setRatings({})
      setComment("")
      setIsSubmitted(false)
      setImageError(false)
    }, 300)
  }

  const isLastQuestion = currentQuestion === totalQuestions - 1
  const allQuestionsAnswered = Object.keys(ratings).length === totalQuestions

  if (!employee) return null

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <AnimatePresence mode="wait">
          {isSubmitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center py-8 text-center"
            >
              <div className="rounded-full bg-emerald-100 p-4">
                <CheckCircle className="h-12 w-12 text-emerald-600" />
              </div>
              <h3 className="mt-4 font-serif text-2xl font-semibold text-foreground">
                ¡Gracias por tu opinión!
              </h3>
              <p className="mt-2 text-muted-foreground">
                Tu calificación nos ayuda a mejorar nuestro servicio.
              </p>
              <Button onClick={handleClose} className="mt-6">
                Cerrar
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <DialogHeader>
                <div className="flex items-center gap-4">
                  <div className="relative h-16 w-16 overflow-hidden rounded-xl bg-muted">
                    {!imageError ? (
                      <img
                        src={employee.image}
                        alt={employee.name}
                        className="h-full w-full object-cover"
                        onError={() => setImageError(true)}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <User className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="text-left">
                    <DialogTitle className="font-serif text-xl">
                      {employee.name}
                    </DialogTitle>
                    <DialogDescription>{employee.role}</DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              {/* Progress bar */}
              <div className="mt-6">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Pregunta {currentQuestion + 1} de {totalQuestions}</span>
                  <span>{Math.round((Object.keys(ratings).length / totalQuestions) * 100)}%</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                  <motion.div
                    className="h-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentQuestion + (ratings[currentQuestion] ? 1 : 0)) / totalQuestions) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>

              {/* Question */}
              <div className="mt-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentQuestion}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h4 className="text-center text-lg font-medium text-foreground">
                      {areaQuestions[currentQuestion]}
                    </h4>

                    {/* Rating buttons */}
                    <div className="mt-6 flex justify-center gap-4">
                      {ratingOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => handleRating(option.value)}
                          className={cn(
                            "flex flex-col items-center gap-2 rounded-xl p-3 text-white transition-all duration-200",
                            option.color,
                            ratings[currentQuestion] === option.value && `ring-2 ring-offset-2 ${option.ringColor}`
                          )}
                        >
                          {option.face}
                          <span className="text-xs font-medium">{option.label}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Navigation dots */}
              <div className="mt-6 flex justify-center gap-2">
                {areaQuestions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentQuestion(index)}
                    className={cn(
                      "h-2 w-2 rounded-full transition-all duration-200",
                      index === currentQuestion
                        ? "w-6 bg-primary"
                        : ratings[index]
                        ? "bg-primary/50"
                        : "bg-muted"
                    )}
                  />
                ))}
              </div>

              {/* Comment section (appears after all questions) */}
              {allQuestionsAnswered && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-6"
                >
                  <label className="text-sm font-medium text-foreground">
                    ¿Algún comentario adicional? (Opcional)
                  </label>
                  <Textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Cuéntanos qué podemos mejorar o qué te encantó..."
                    className="mt-2 min-h-[100px]"
                  />
                  
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="mt-4 w-full"
                    size="lg"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <motion.div
                          className="h-4 w-4 rounded-full border-2 border-white border-t-transparent"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        Enviando...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Send className="h-4 w-4" />
                        Enviar Calificación
                      </span>
                    )}
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
