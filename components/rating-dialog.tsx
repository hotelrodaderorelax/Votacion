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

// --- FUNCIÓN PARA CORREGIR LA RUTA DE LA FOTO ---
const getPhotoPath = (name: string, fallbackImage: string) => {
  if (!name) return fallbackImage;
  const n = name.toUpperCase();
  if (n.includes("LEXILIS")) return "/LEXILIS-1.jpeg";
  if (n.includes("EZLATNE")) return "/EZLATNE-1.jpeg";
  if (n.includes("VIRGINIA")) return "/VIRGINIA-1.jpeg";
  if (n.includes("ANDREINA")) return "/ANDREINA-1.jpg.jpeg";
  if (n.includes("MIGUEL")) return "/MIGUEL-1.jpeg";
  return fallbackImage; // Si no es uno de los fijos, usa la de la DB
}

const ratingOptions = [
  {
    value: "satisfied",
    label: "Súper Satisfecho",
    color: "bg-emerald-500 hover:bg-emerald-600",
    ringColor: "ring-emerald-500",
    emoji: "😊",
  },
  {
    value: "neutral",
    label: "Regular",
    color: "bg-amber-500 hover:bg-amber-600",
    ringColor: "ring-amber-500",
    emoji: "😐",
  },
  {
    value: "unsatisfied",
    label: "Nada Satisfecho",
    color: "bg-red-500 hover:bg-red-600",
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

  // Reiniciar estado de error de imagen al cambiar de empleado
  React.useEffect(() => {
    setImageError(false);
  }, [employee]);

  const handleRating = (e: React.MouseEvent, value: string) => {
    e.preventDefault();
    e.stopPropagation(); 
    
    setRatings((prev) => ({ ...prev, [currentQuestion]: value }))
    
    if (currentQuestion < totalQuestions - 1) {
      setTimeout(() => setCurrentQuestion((prev) => prev + 1), 300)
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
      alert("Hubo un problema al enviar tu voto. Por favor, intenta de nuevo.")
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

  // Aplicamos la lógica de la foto aquí
  const displayImage = getPhotoPath(employee.name, employee.image);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg bg-white rounded-[2rem]">
        <AnimatePresence mode="wait">
          {isSubmitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center py-8 text-center"
            >
              <div className="rounded-full bg-emerald-100 p-4">
                <CheckCircle className="h-12 w-12 text-emerald-600" />
              </div>
              <h3 className="mt-4 font-serif text-2xl font-bold text-[#2878a8]">
                ¡Gracias por tu opinión!
              </h3>
              <p className="mt-2 text-muted-foreground">
                Tu calificación ayuda a mejorar el servicio en <strong>Hotel Rodadero Relax</strong>.
              </p>
              <Button onClick={handleClose} className="mt-6 bg-[#2878a8] hover:bg-[#1e5a7e] rounded-xl px-8">
                Finalizar
              </Button>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <DialogHeader>
                <div className="flex items-center gap-4">
                  <div className="relative h-16 w-16 overflow-hidden rounded-2xl bg-slate-100 border-2 border-[#f5ac0a]/20">
                    {!imageError && displayImage ? (
                      <img 
                        src={displayImage} 
                        alt={employee.name} 
                        className="h-full w-full object-cover" 
                        onError={() => setImageError(true)} 
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-slate-50">
                        <User className="h-8 text-slate-300" />
                      </div>
                    )}
                  </div>
                  <div className="text-left">
                    <DialogTitle className="font-serif text-xl text-[#2878a8] font-black leading-tight italic uppercase">
                      {employee.name}
                    </DialogTitle>
                    <DialogDescription className="font-bold text-[#f5ac0a] uppercase text-[10px] tracking-widest">
                      {employee.role}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              {/* Progress bar */}
              <div className="mt-6 px-1">
                <div className="flex items-center justify-between text-[10px] font-black uppercase text-slate-400">
                  <span>Pregunta {currentQuestion + 1} de {totalQuestions}</span>
                  <span className="text-[#2878a8]">{Math.round((Object.keys(ratings).length / totalQuestions) * 100)}%</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                  <motion.div
                    className="h-full bg-[#f5ac0a]"
                    animate={{ width: `${((currentQuestion + (ratings[currentQuestion] ? 1 : 0)) / totalQuestions) * 100}%` }}
                  />
                </div>
              </div>

              {/* Question & Rating */}
              <div className="mt-8 min-h-[200px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentQuestion}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-center"
                  >
                    <h4 className="text-lg font-bold text-slate-700 leading-tight">
                      {areaQuestions[currentQuestion]}
                    </h4>

                    <div className="mt-8 grid grid-cols-3 gap-3">
                      {ratingOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={(e) => handleRating(e, option.value)}
                          className={cn(
                            "flex flex-col items-center gap-3 rounded-[1.5rem] py-6 text-white transition-all duration-300",
                            option.color,
                            ratings[currentQuestion] === option.value ? "scale-105 ring-4 ring-offset-2 " + option.ringColor : "opacity-90 hover:opacity-100"
                          )}
                        >
                          <span className="text-4xl filter drop-shadow-sm">{option.emoji}</span>
                          <span className="text-[10px] font-black uppercase tracking-tight px-2">{option.label}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Comment & Submit */}
              {allQuestionsAnswered && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-4 pt-4 border-t border-slate-100">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                    ¿Algo más que quieras decirnos?
                  </label>
                  <Textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Escribe aquí tu comentario..."
                    className="mt-2 rounded-xl border-slate-200 focus:border-[#2878a8] focus:ring-[#2878a8]"
                  />
                  <Button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="mt-6 w-full bg-[#2878a8] hover:bg-[#1e5a7e] text-white py-6 rounded-2xl font-black uppercase tracking-[0.2em] shadow-lg transition-transform active:scale-95"
                  >
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
