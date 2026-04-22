"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChefHat, Sparkles, ConciergeBell, Hotel, Star, X, ChevronLeft, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { EmployeeGrid } from "@/components/employee-grid"
import { Button } from "@/components/ui/button"

const ratingOptions = [
  { value: "5", label: "Súper Satisfecho", color: "bg-emerald-500", emoji: "😊" },
  { value: "3", label: "Regular", color: "bg-amber-500", emoji: "😐" },
  { value: "1", label: "Nada Satisfecho", color: "bg-red-500", emoji: "😡" },
]

// 1. Preguntas alineadas exactamente al documento [cite: 20, 24]
const HOTEL_QUESTIONS = [
  { id: "bienvenida", section: "BIENVENIDA", question: "¿Te sentiste bienvenid@ cuándo entraste en el hotel?" },
  { id: "registro_eficiente", section: "EN CUANTO AL PROCESO DE REGISTRO:", question: "1. Fue rápido y eficiente el registro" },
  { id: "registro_amabilidad", section: "EN CUANTO AL PROCESO DE REGISTRO:", question: "2. El personal de la recepción se mostró amable y cordial." },
  { id: "registro_reserva", section: "EN CUANTO AL PROCESO DE REGISTRO:", question: "3. La reserva contenía todos los servicios contratados" },
  { id: "habitacion_limpia", section: "EN CUANTO A LA HABITACIÓN:", question: "1. Recibió una habitación cómoda y limpia" },
  { id: "habitacion_confort", section: "EN CUANTO A LA HABITACIÓN:", question: "2. La cama y las sábanas fueron confortables" },
  { id: "habitacion_baño", section: "EN CUANTO A LA HABITACIÓN:", question: "3. El cuarto de baño estuvo limpio y equipado" },
  { id: "habitacion_mobiliario", section: "EN CUANTO A LA HABITACIÓN:", question: "4. Estado del inmobiliario" },
  { id: "personal_limpieza", section: "EN CUANTO A NUESTRO PERSONAL:", question: "1. Los camareros de limpieza fueron amables y de confianza" },
  { id: "personal_cocina", section: "EN CUANTO A NUESTRO PERSONAL:", question: "2. Las auxiliares de cocina le brindaron un trato afable y agradable" },
  { id: "personal_resolucion", section: "EN CUANTO A NUESTRO PERSONAL:", question: "3. El personal fue capaz de responder sus inquietudes y/o acompañarlo en sus requerimientos." },
  { id: "alimento_calidad", section: "EN CUANTO A LA ALIMENTACIÓN:", question: "1. La comida fue de buena calidad" },
  { id: "alimento_porcion", section: "EN CUANTO A LA ALIMENTACIÓN:", question: "2. La porción de cada alimento es equilibrada y adecuada" },
  { id: "alimento_variedad", section: "EN CUANTO A LA ALIMENTACIÓN:", question: "3. Hubo variedad en los platos servidos en desayuno y cena" },
  { id: "alimento_agilidad", section: "EN CUANTO A LA ALIMENTACIÓN:", question: "4. La entrega del servicio fue ágil y oportuna" },
  { id: "alimento_presentacion", section: "EN CUANTO A LA ALIMENTACIÓN:", question: "5. Presentación" },
  { id: "problema_resuelto", section: "INCIDENCIAS", question: "¿Hubo algún problema que no se resolvió satisfactoriamente? Cuál", isText: true },
  { id: "general_tranquilidad", section: "EXPERIENCIA GENERAL", question: "¿Percibió tranquilidad en el hotel?" },
  { id: "general_recomendacion", section: "EXPERIENCIA GENERAL", question: "¿Recomendarías nuestro hotel a otras personas basándose en su experiencia?" },
  { id: "general_evaluacion", section: "EXPERIENCIA GENERAL", question: "¿Cómo evaluarías tu experiencia en nuestro hotel?" },
  { id: "sugerencias_mejora", section: "FEEDBACK FINAL", question: "Déjanos saber qué es lo que podríamos mejorar", isText: true }
];

const sectionStyles: Record<string, { bg: string, text: string }> = {
  "BIENVENIDA": { bg: "bg-blue-100", text: "text-blue-600" },
  "EN CUANTO AL PROCESO DE REGISTRO:": { bg: "bg-emerald-100", text: "text-emerald-600" },
  "EN CUANTO A LA HABITACIÓN:": { bg: "bg-purple-100", text: "text-purple-600" },
  "EN CUANTO A NUESTRO PERSONAL:": { bg: "bg-orange-100", text: "text-orange-600" },
  "EN CUANTO A LA ALIMENTACIÓN:": { bg: "bg-amber-100", text: "text-amber-600" },
  "INCIDENCIAS": { bg: "bg-red-100", text: "text-red-600" },
  "EXPERIENCIA GENERAL": { bg: "bg-cyan-100", text: "text-cyan-600" },
  "FEEDBACK FINAL": { bg: "bg-slate-100", text: "text-slate-600" },
}

// ... (El resto de las áreas y estados se mantienen igual)

export function InteractiveIslands() {
  const [selectedArea, setSelectedArea] = React.useState<string | null>(null)
  const [isSurveyOpen, setIsSurveyOpen] = React.useState(false)
  const [isSubmitted, setIsSubmitted] = React.useState(false)
  const [currentStep, setCurrentStep] = React.useState(0)
  const [ratings, setRatings] = React.useState<Record<string, string>>({})
  const [textFeedbacks, setTextFeedbacks] = React.useState<Record<string, string>>({}) // 2. Soporte para múltiples comentarios
  const gridRef = React.useRef<HTMLDivElement>(null)

  const handleRating = (value: string) => {
    const questionId = HOTEL_QUESTIONS[currentStep].id;
    setRatings(prev => ({ ...prev, [questionId]: value }));
    if (currentStep < HOTEL_QUESTIONS.length - 1) {
      setTimeout(() => setCurrentStep(prev => prev + 1), 300);
    }
  };

  const handleFinish = async () => {
    // 2. Payload actualizado con los nuevos campos de comentarios
    const payload = {
      ...ratings,
      problema_no_resuelto: textFeedbacks["problema_resuelto"] || "Ninguno",
      sugerencias_mejora: textFeedbacks["sugerencias_mejora"] || "Sin comentarios"
    };

    try {
      const response = await fetch('/api/survey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setIsSubmitted(true);
      }
    } catch (error) {
      console.error("Error de red:", error);
    }
  };

  return (
    <section id="votar" className="py-16 bg-slate-50/30">
      {/* ... Botón Calificar Hotel y Grid de Áreas ... */}

      <AnimatePresence>
        {isSurveyOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div className="bg-white rounded-[3rem] w-full max-w-xl overflow-hidden shadow-2xl">
              
              {isSubmitted ? (
                /* 3. MENSAJE DE DESPEDIDA DEL DOCUMENTO  */
                <motion.div className="p-12 text-center flex flex-col items-center justify-center min-h-[450px] gap-6">
                  <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mb-2">
                    <Check className="h-8 w-8 text-emerald-500 stroke-[4px]" />
                  </div>
                  <h3 className="text-3xl font-black text-slate-800 uppercase tracking-tight">¡Gracias!</h3>
                  <p className="text-slate-500 font-medium max-w-sm mx-auto leading-relaxed">
                    Sus comentarios son importantes para nosotros y nos ayudarán a mejorar la calidad del servicio.
                  </p>
                  <Button onClick={() => setIsSurveyOpen(false)} className="bg-[#2878a8] hover:bg-[#1e5a7e] px-12 py-7 rounded-[2rem]">
                    Finalizar
                  </Button>
                </motion.div>
              ) : (
                <>
                  {/* ... Header y Barra de Progreso ... */}
                  <div className="p-10 text-center min-h-[400px] flex flex-col justify-center gap-8">
                    <span className={cn("px-4 py-1.5 text-[10px] font-black rounded-xl uppercase self-center", sectionStyles[HOTEL_QUESTIONS[currentStep].section]?.bg, sectionStyles[HOTEL_QUESTIONS[currentStep].section]?.text)}>
                      {HOTEL_QUESTIONS[currentStep].section}
                    </span>
                    <h3 className="text-2xl font-bold text-slate-800">{HOTEL_QUESTIONS[currentStep].question}</h3>

                    {HOTEL_QUESTIONS[currentStep].isText ? (
                      <textarea 
                        value={textFeedbacks[HOTEL_QUESTIONS[currentStep].id] || ""} 
                        onChange={(e) => setTextFeedbacks(prev => ({ ...prev, [HOTEL_QUESTIONS[currentStep].id]: e.target.value }))} 
                        className="w-full border-2 border-slate-100 rounded-[2rem] p-6 min-h-[150px]" 
                        placeholder="Escribe aquí..." 
                      />
                    ) : (
                      <div className="flex gap-4">
                        {ratingOptions.map((opt) => (
                          <button key={opt.value} onClick={() => handleRating(opt.value)} className={cn("flex-1 p-6 rounded-[2.5rem] text-white", opt.color)}>
                            <span className="text-4xl block mb-2">{opt.emoji}</span>
                            <span className="text-[10px] font-black uppercase">{opt.label}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {/* ... Footer con botones Anterior/Siguiente ... */}
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  )
}
