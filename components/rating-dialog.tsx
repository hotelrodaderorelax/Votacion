"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { User, Send, CheckCircle, X, ChevronLeft, Hotel, Loader2 } from "lucide-react"
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

// 1. Configuración de Emojis y Colores (Fiel a tus capturas)
const ratingOptions = [
  {
    value: "satisfied",
    label: "Súper Satisfecho",
    emoji: "😊",
    color: "bg-emerald-500", // Verde
    borderColor: "border-emerald-100",
    textColor: "text-emerald-500",
    ringColor: "ring-emerald-500",
  },
  {
    value: "neutral",
    label: "Regular",
    emoji: "😐",
    color: "bg-[#f5ac0a]", // Naranja
    borderColor: "border-orange-100",
    textColor: "text-orange-400",
    ringColor: "ring-[#f5ac0a]",
  },
  {
    value: "unsatisfied",
    label: "Nada Satisfecho",
    emoji: "☹️",
    color: "bg-red-500", // Rojo
    borderColor: "border-red-100",
    textColor: "text-red-500",
    ringColor: "ring-red-500",
  },
]

// 2. Preguntas extraídas del PDF de satisfacción
const hotelQuestions = [
  { section: "BIENVENIDA", question: "¿Te sentiste bienvenid@ cuándo entraste en el hotel?" },
  { section: "REGISTRO", question: "1. Fue rápido y eficiente el registro" },
  { section: "REGISTRO", question: "2. El personal de la recepción se mostró amable y cordial" },
  { section: "HABITACIÓN", question: "1. Recibió una habitación cómoda y limpia" },
  { section: "HABITACIÓN", question: "2. La cama y las sábanas fueron confortables" },
  { section: "PERSONAL", question: "3. El personal fue capaz de responder sus inquietudes" },
  { section: "ALIMENTACIÓN", question: "1. La comida fue de buena calidad" },
  { section: "ALIMENTACIÓN", question: "4. La entrega del servicio fue ágil y oportuna" },
  { section: "GENERAL", question: "¿Percibió tranquilidad en el hotel?" },
  { section: "GENERAL", question: "¿Recomendarías nuestro hotel a otras personas?" },
]

const employeeQuestions = {
  cocina: [
    "¿La calidad de los alimentos fue de su agrado?",
    "¿La porción servida fue adecuada?",
    "¿La presentación del plato fue excelente?",
    "¿El servicio fue rápido?",
  ],
  camareria: [
    "¿Su habitación se encontraba impecable?",
    "¿El personal fue respetuoso y amable?",
    "¿Los suministros de baño estaban completos?",
    "¿Siente confianza con el personal de limpieza?",
  ],
  recepcion: [
    "¿El trato recibido fue cordial y atento?",
    "¿El proceso de check-in fue ágil?",
    "¿Resolvieron sus dudas eficientemente?",
    "¿Le brindaron toda la información necesaria?",
  ],
}

export function RatingDialog({ employee, area, open, onOpenChange, onSuccess, type = "employee" }: RatingDialogProps) {
  const [currentStep, setCurrentStep] = React.useState(0)
  const [ratings, setRatings] = React.useState<Record<number, string>>({})
  const [comment, setComment] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isSubmitted, setIsSubmitted] = React.useState(false)

  const isHotel = type === "hotel"
  const questionsList = isHotel ? hotelQuestions : (employeeQuestions[area as keyof typeof employeeQuestions] || [])
  const totalSteps = questionsList.length + 1
  const progress = ((currentStep + 1) / totalSteps) * 100

  const handleRating = (value: string) => {
    // Guardamos la calificación actual
    setRatings((prev) => ({ ...prev, [currentStep]: value }))
    // Pequeña demora para que el usuario vea el cambio de color antes de pasar a la siguiente
    setTimeout(() => {
      if (currentStep < questionsList.length) {
        setCurrentStep((prev) => prev + 1)
      }
    }, 400)
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
      setCurrentStep(0)
      setRatings({})
      setComment("")
      setIsSubmitted(false)
    }, 300)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[95vh] overflow-hidden sm:max-w-xl bg-white rounded-[3rem] p-0 border-none shadow-2xl flex flex-col">
        
        {/* Header con Info y Progreso */}
        <div className="p-6 border-b bg-slate-50 relative flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isHotel ? (
                <div className="h-10 w-10 bg-[#2878a8]/10 rounded-xl flex items-center justify-center text-[#2878a8]">
                  <Hotel size={20} />
                </div>
              ) : (
                <img src={employee?.image} alt={employee?.name} className="h-10 w-10 rounded-xl object-cover" />
              )}
              <div>
                <DialogTitle className="font-black text-[#2878a8] uppercase text-xs tracking-widest">
                  {isHotel ? "Encuesta de Hotel" : "Calificar Personal"}
                </DialogTitle>
                <p className="font-bold text-[#f5ac0a] uppercase text-[10px]">
                  {isHotel ? "Rodadero Relax" : employee?.name}
                </p>
              </div>
            </div>
            <button onClick={handleClose} className="p-2 hover:bg-slate-200 rounded-full text-slate-400">
              <X size={20} />
            </button>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-black uppercase text-slate-400">
              <span>Paso {currentStep + 1} de {totalSteps}</span>
              <span className="text-[#2878a8]">{Math.round(progress)}%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-[#2878a8]" 
                initial={{ width: 0 }} 
                animate={{ width: `${progress}%` }} 
              />
            </div>
          </div>
        </div>

        {/* Cuerpo del Cuestionario */}
        <div className="flex-1 overflow-y-auto min-h-[450px] flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            {isSubmitted ? (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="p-12 text-center">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle size={40} />
                </div>
                <h3 className="text-3xl font-black text-[#2878a8] mb-2 uppercase">¡Enviado!</h3>
                <p className="text-slate-500 font-medium">Gracias por ayudarnos a mejorar.</p>
                <Button onClick={handleClose} className="mt-8 bg-[#2878a8] rounded-full px-10 uppercase font-black">Cerrar</Button>
              </motion.div>
            ) : currentStep < questionsList.length ? (
              <motion.div 
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="w-full p-8 md:p-12 text-center space-y-10"
              >
                {isHotel && (
                  <span className="px-4 py-1.5 bg-orange-50 text-[#f5ac0a] text-[10px] font-black rounded-full uppercase border border-orange-100">
                    {(questionsList[currentStep] as any).section}
                  </span>
                )}
                <h4 className="text-2xl md:text-3xl font-bold text-slate-800 leading-tight">
                  {isHotel ? (questionsList[currentStep] as any).question : (questionsList[currentStep] as string)}
                </h4>

                {/* Grid de Emojis con Lógica de Color Activo */}
                <div className="grid grid-cols-3 gap-4 md:gap-6">
                  {ratingOptions.map((opt) => {
                    const isSelected = ratings[currentStep] === opt.value;
                    return (
                      <motion.button
                        key={opt.value}
                        whileHover={{ y: -5 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleRating(opt.value)}
                        className={cn(
                          "flex flex-col items-center gap-4 p-6 md:p-8 rounded-[2.5rem] border-2 transition-all duration-300 group",
                          opt.borderColor,
                          // Cuando está seleccionado, aplica el color de fondo y escala
                          isSelected ? `${opt.color} text-white scale-105 shadow-xl` : "bg-white hover:bg-slate-50"
                        )}
                      >
                        <span className="text-5xl md:text-6xl">{opt.emoji}</span>
                        <span className={cn(
                          "text-[10px] font-black uppercase transition-colors",
                          isSelected ? "text-white" : opt.textColor
                        )}>
                          {opt.label}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            ) : (
              // Paso de Comentarios Finales
              <motion.div key="comment" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full p-8 md:p-12 space-y-6">
                <div className="text-center space-y-2">
                  <h4 className="text-2xl font-bold text-slate-800 uppercase">¿Algo más que decir?</h4>
                  <p className="text-sm text-slate-400">Tus sugerencias nos ayudan a crecer.</p>
                </div>
                <Textarea 
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Escribe aquí..."
                  className="rounded-[2rem] border-slate-200 focus:ring-[#2878a8] min-h-[150px] p-6 text-slate-600 shadow-inner"
                />
                <Button 
                  onClick={handleSubmit} 
                  disabled={isSubmitting}
                  className="w-full bg-[#2878a8] hover:bg-[#1e5a7e] py-8 rounded-[2rem] text-lg font-black uppercase shadow-lg transition-transform active:scale-95"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" /> : "Enviar Mi Opinión"}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer de Navegación */}
        {!isSubmitted && (
          <div className="p-4 bg-slate-50 border-t flex justify-between items-center px-8">
            <Button 
              variant="ghost" 
              disabled={currentStep === 0}
              onClick={() => setCurrentStep(prev => prev - 1)}
              className="text-slate-400 font-bold uppercase text-[10px]"
            >
              <ChevronLeft className="mr-2 h-4 w-4" /> Anterior
            </Button>
            <div className="flex gap-1.5">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <div 
                  key={i} 
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-500", 
                    i === currentStep ? "w-6 bg-[#2878a8]" : "w-1.5 bg-slate-200"
                  )} 
                />
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
