"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { User, Send, CheckCircle, Loader2 } from "lucide-react"
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
    color: "bg-emerald-500",
    ringColor: "ring-emerald-500",
    emoji: "😊",
  },
  {
    value: "neutral",
    label: "Regular",
    color: "bg-amber-500",
    ringColor: "ring-amber-500",
    emoji: "😐",
  },
  {
    value: "unsatisfied",
    label: "Nada Satisfecho",
    color: "bg-red-500",
    ringColor: "ring-red-500",
    emoji: "😡",
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

  // Manejo de voto con protección total anti-recarga
  const handleRating = (value: string) => {
    // Guardamos el rating actual
    setRatings((prev) => ({ ...prev, [currentQuestion]: value }))
    
    // Avanzamos a la siguiente pregunta con un pequeño delay
    if (currentQuestion < totalQuestions - 1) {
      setTimeout(() => {
        setCurrentQuestion((prev) => prev + 1)
      }, 300)
    }
  }

  const handleSubmit = async () => {
    if (isSubmitting) return
    setIsSubmitting(true)
    
    const ratingValues = Object.values(ratings).map(r => 
      r === "satisfied" ? 5 : r === "neutral" ? 3 : 1
    )
    const avgRating = ratingValues.reduce((a, b) => a + b, 0) / ratingValues.length
    
    try {
      const response = await fetch("/api/votes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employee_id: employee?.id,
          voter_identifier: `voter_${Date.now()}`,
          friendliness: Math.round(avgRating),
          efficiency: Math.round(avgRating),
          problem_solving: Math.round(avgRating),
          cleanliness: Math.round(avgRating),
          comment,
        }),
      })
      
      if (!response.ok) throw new Error("Error en servidor")
      
      setIsSubmitted(true)
      onSuccess?.()
    } catch (error) {
      console.error(error)
      alert("Error al enviar. Inténtalo de nuevo.")
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

  if (!employee) return null

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[95vh] overflow-y-auto sm:max-w-lg bg-white rounded-[2.5rem] p-0 border-none shadow-2xl">
        <AnimatePresence mode="wait">
          {isSubmitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center py-12 px-6 text-center"
            >
              <div className="rounded-full bg-emerald-100 p-6 mb-6">
                <CheckCircle className="h-16 w-16 text-emerald-600" />
              </div>
              <h3 className="font-serif text-3xl font-black text-[#2878a8] mb-2">
                ¡Muchas Gracias!
              </h3>
              <p className="text-slate-500 text-lg">
                Tu opinión nos ayuda a brindar un mejor servicio en el 
                <span className="block font-bold text-[#f5ac0a]">Hotel Rodadero Relax</span>
              </p>
              <Button 
                onClick={handleClose} 
                className="mt-10 bg-[#2878a8] hover:bg-[#1e5a7e] text-white rounded-2xl px-12 py-7 text-lg font-black uppercase tracking-widest shadow-lg"
              >
                Cerrar
              </Button>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 md:p-8">
              <DialogHeader className="mb-8">
                <div className="flex items-center gap-5">
                  <div className="relative h-20 w-20 overflow-hidden rounded-[1.5rem] bg-slate-100 ring-4 ring-[#f5ac0a]/10">
                    {!imageError ? (
                      <img src={employee.image} alt={employee.name} className="h-full w-full object-cover" onError={() => setImageError(true)} />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center"><User className="h-10 text-slate-300" /></div>
                    )}
                  </div>
                  <div className="text-left">
                    <DialogTitle className="font-serif text-2xl text-[#2878a8] font-black leading-tight">{employee.name}</DialogTitle>
                    <DialogDescription className="font-black text-[#f5ac0a] uppercase text-[11px] tracking-[0.2em] mt-1">{employee.role}</DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              {/* Progress */}
              <div className="mb-10">
                <div className="flex items-center justify-between text-[11px] font-black uppercase text-slate-400 mb-3 tracking-wider">
                  <span>Pregunta {currentQuestion + 1} de {totalQuestions}</span>
                  <span className="text-[#2878a8]">{Math.round((Object.keys(ratings).length / totalQuestions) * 100)}% Completado</span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-slate-100">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#2878a8] to-[#f5ac0a] rounded-full"
                    animate={{ width: `${((currentQuestion + (ratings[currentQuestion] ? 1 : 0)) / totalQuestions) * 100}%` }}
                    transition={{ type: "spring", stiffness: 50 }}
                  />
                </div>
              </div>

              {/* Question area */}
              <div className="min-h-[240px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentQuestion}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="text-center"
                  >
                    <h4 className="text-xl font-bold text-slate-800 leading-snug px-2 mb-10">
                      {areaQuestions[currentQuestion]}
                    </h4>

                    {/* USAMOS DIVS EN LUGAR DE BUTTONS PARA EVITAR RECARGA */}
                    <div className="grid grid-cols-3 gap-4">
                      {ratingOptions.map((option) => (
                        <div
                          key={option.value}
                          role="button"
                          onClick={() => handleRating(option.value)}
                          className={cn(
                            "flex flex-col items-center gap-4 rounded-[2rem] py-8 cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md",
                            option.color,
                            ratings[currentQuestion] === option.value 
                              ? "scale-105 ring-[6px] ring-offset-2 " + option.ringColor 
                              : "opacity-90 hover:opacity-100 hover:-translate-y-1"
                          )}
                        >
                          <span className="text-5xl mb-1">{option.emoji}</span>
                          <span className="text-[10px] font-black uppercase text-white tracking-wider text-center px-1">
                            {option.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Final Step */}
              {allQuestionsAnswered && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-10 pt-8 border-t-2 border-slate-50">
                  <label className="text-[11px] font-black uppercase text-slate-500 tracking-[0.15em] mb-3 block">
                    ¿Algún mensaje para el equipo?
                  </label>
                  <Textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tu opinión nos hace mejores..."
                    className="rounded-2xl border-slate-200 focus:border-[#2878a8] focus:ring-[#2878a8] min-h-[120px] p-4 text-slate-700"
                  />
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="mt-8 w-full bg-[#2878a8] hover:bg-[#1e5a7e] text-white py-8 rounded-[1.5rem] font-black uppercase tracking-[0.25em] shadow-xl active:scale-95 transition-all"
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-6 w-6 animate-spin" />
                    ) : (
                      <span className="flex items-center gap-3">
                        <Send className="h-5 w-5" />
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
"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { User, Send, CheckCircle, Loader2 } from "lucide-react"
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
    color: "bg-emerald-500",
    ringColor: "ring-emerald-500",
    emoji: "😊",
  },
  {
    value: "neutral",
    label: "Regular",
    color: "bg-amber-500",
    ringColor: "ring-amber-500",
    emoji: "😐",
  },
  {
    value: "unsatisfied",
    label: "Nada Satisfecho",
    color: "bg-red-500",
    ringColor: "ring-red-500",
    emoji: "😡",
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

  // Manejo de voto con protección total anti-recarga
  const handleRating = (value: string) => {
    // Guardamos el rating actual
    setRatings((prev) => ({ ...prev, [currentQuestion]: value }))
    
    // Avanzamos a la siguiente pregunta con un pequeño delay
    if (currentQuestion < totalQuestions - 1) {
      setTimeout(() => {
        setCurrentQuestion((prev) => prev + 1)
      }, 300)
    }
  }

  const handleSubmit = async () => {
    if (isSubmitting) return
    setIsSubmitting(true)
    
    const ratingValues = Object.values(ratings).map(r => 
      r === "satisfied" ? 5 : r === "neutral" ? 3 : 1
    )
    const avgRating = ratingValues.reduce((a, b) => a + b, 0) / ratingValues.length
    
    try {
      const response = await fetch("/api/votes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employee_id: employee?.id,
          voter_identifier: `voter_${Date.now()}`,
          friendliness: Math.round(avgRating),
          efficiency: Math.round(avgRating),
          problem_solving: Math.round(avgRating),
          cleanliness: Math.round(avgRating),
          comment,
        }),
      })
      
      if (!response.ok) throw new Error("Error en servidor")
      
      setIsSubmitted(true)
      onSuccess?.()
    } catch (error) {
      console.error(error)
      alert("Error al enviar. Inténtalo de nuevo.")
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

  if (!employee) return null

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[95vh] overflow-y-auto sm:max-w-lg bg-white rounded-[2.5rem] p-0 border-none shadow-2xl">
        <AnimatePresence mode="wait">
          {isSubmitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center py-12 px-6 text-center"
            >
              <div className="rounded-full bg-emerald-100 p-6 mb-6">
                <CheckCircle className="h-16 w-16 text-emerald-600" />
              </div>
              <h3 className="font-serif text-3xl font-black text-[#2878a8] mb-2">
                ¡Muchas Gracias!
              </h3>
              <p className="text-slate-500 text-lg">
                Tu opinión nos ayuda a brindar un mejor servicio en el 
                <span className="block font-bold text-[#f5ac0a]">Hotel Rodadero Relax</span>
              </p>
              <Button 
                onClick={handleClose} 
                className="mt-10 bg-[#2878a8] hover:bg-[#1e5a7e] text-white rounded-2xl px-12 py-7 text-lg font-black uppercase tracking-widest shadow-lg"
              >
                Cerrar
              </Button>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 md:p-8">
              <DialogHeader className="mb-8">
                <div className="flex items-center gap-5">
                  <div className="relative h-20 w-20 overflow-hidden rounded-[1.5rem] bg-slate-100 ring-4 ring-[#f5ac0a]/10">
                    {!imageError ? (
                      <img src={employee.image} alt={employee.name} className="h-full w-full object-cover" onError={() => setImageError(true)} />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center"><User className="h-10 text-slate-300" /></div>
                    )}
                  </div>
                  <div className="text-left">
                    <DialogTitle className="font-serif text-2xl text-[#2878a8] font-black leading-tight">{employee.name}</DialogTitle>
                    <DialogDescription className="font-black text-[#f5ac0a] uppercase text-[11px] tracking-[0.2em] mt-1">{employee.role}</DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              {/* Progress */}
              <div className="mb-10">
                <div className="flex items-center justify-between text-[11px] font-black uppercase text-slate-400 mb-3 tracking-wider">
                  <span>Pregunta {currentQuestion + 1} de {totalQuestions}</span>
                  <span className="text-[#2878a8]">{Math.round((Object.keys(ratings).length / totalQuestions) * 100)}% Completado</span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-slate-100">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#2878a8] to-[#f5ac0a] rounded-full"
                    animate={{ width: `${((currentQuestion + (ratings[currentQuestion] ? 1 : 0)) / totalQuestions) * 100}%` }}
                    transition={{ type: "spring", stiffness: 50 }}
                  />
                </div>
              </div>

              {/* Question area */}
              <div className="min-h-[240px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentQuestion}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="text-center"
                  >
                    <h4 className="text-xl font-bold text-slate-800 leading-snug px-2 mb-10">
                      {areaQuestions[currentQuestion]}
                    </h4>

                    {/* USAMOS DIVS EN LUGAR DE BUTTONS PARA EVITAR RECARGA */}
                    <div className="grid grid-cols-3 gap-4">
                      {ratingOptions.map((option) => (
                        <div
                          key={option.value}
                          role="button"
                          onClick={() => handleRating(option.value)}
                          className={cn(
                            "flex flex-col items-center gap-4 rounded-[2rem] py-8 cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md",
                            option.color,
                            ratings[currentQuestion] === option.value 
                              ? "scale-105 ring-[6px] ring-offset-2 " + option.ringColor 
                              : "opacity-90 hover:opacity-100 hover:-translate-y-1"
                          )}
                        >
                          <span className="text-5xl mb-1">{option.emoji}</span>
                          <span className="text-[10px] font-black uppercase text-white tracking-wider text-center px-1">
                            {option.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Final Step */}
              {allQuestionsAnswered && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-10 pt-8 border-t-2 border-slate-50">
                  <label className="text-[11px] font-black uppercase text-slate-500 tracking-[0.15em] mb-3 block">
                    ¿Algún mensaje para el equipo?
                  </label>
                  <Textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tu opinión nos hace mejores..."
                    className="rounded-2xl border-slate-200 focus:border-[#2878a8] focus:ring-[#2878a8] min-h-[120px] p-4 text-slate-700"
                  />
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="mt-8 w-full bg-[#2878a8] hover:bg-[#1e5a7e] text-white py-8 rounded-[1.5rem] font-black uppercase tracking-[0.25em] shadow-xl active:scale-95 transition-all"
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-6 w-6 animate-spin" />
                    ) : (
                      <span className="flex items-center gap-3">
                        <Send className="h-5 w-5" />
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
