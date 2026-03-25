"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChefHat, Sparkles, ConciergeBell, Hotel, Star, X, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { EmployeeGrid } from "@/components/employee-grid"
import { Button } from "@/components/ui/button"

// 1. PREGUNTAS AL PIE DE LA LETRA (Aplanadas para interactividad)
const HOTEL_QUESTIONS = [
  { section: "BIENVENIDA", question: "¿Te sentiste bienvenid@ cuándo entraste en el hotel?" },
  { section: "REGISTRO", question: "1. Fue rápido y eficiente el registro" },
  { section: "REGISTRO", question: "2. El personal de la recepción se mostró amable y cordial" },
  { section: "REGISTRO", question: "3. La reserva contenía todos los servicios contratados" },
  { section: "HABITACIÓN", question: "1. Recibió una habitación cómoda y limpia" },
  { section: "HABITACIÓN", question: "2. La cama y las sábanas fueron confortables" },
  { section: "HABITACIÓN", question: "3. El cuarto de baño estuvo limpio y equipado" },
  { section: "HABITACIÓN", question: "4. Estado del inmobiliario" },
  { section: "PERSONAL", question: "1. Los camareros de limpieza fueron amables y de confianza" },
  { section: "PERSONAL", question: "2. Las auxiliares de cocina le brindaron un trato afable y agradable" },
  { section: "PERSONAL", question: "3. El personal fue capaz de responder inquietudes o requerimientos" },
  { section: "ALIMENTACIÓN", question: "1. La comida fue de buena calidad" },
  { section: "ALIMENTACIÓN", question: "2. La porción de cada alimento es equilibrada y adecuada" },
  { section: "ALIMENTACIÓN", question: "3. Hubo variedad en los platos servidos en desayuno y cena" },
  { section: "ALIMENTACIÓN", question: "4. La entrega del servicio fue ágil y oportuna" },
  { section: "ALIMENTACIÓN", question: "5. Presentación" },
  { section: "GENERAL", question: "¿Percibió tranquilidad en el hotel?" },
  { section: "GENERAL", question: "¿Recomendarías nuestro hotel a otras personas?" },
  { section: "GENERAL", question: "¿Cómo evaluarías tu experiencia en nuestro hotel?" },
  { section: "FEEDBACK", question: "Déjanos saber qué es lo que podríamos mejorar", isText: true }
];

export function InteractiveIslands() {
  const [selectedArea, setSelectedArea] = React.useState<string | null>(null)
  const [isSurveyOpen, setIsSurveyOpen] = React.useState(false)
  const [currentStep, setCurrentStep] = React.useState(0)
  const gridRef = React.useRef<HTMLDivElement>(null)

  const progress = ((currentStep + 1) / HOTEL_QUESTIONS.length) * 100

  const handleNext = () => {
    if (currentStep < HOTEL_QUESTIONS.length - 1) setCurrentStep(prev => prev + 1)
    else setIsSurveyOpen(false) // Aquí enviarías los datos
  }

  return (
    <section id="votar" className="py-16 md:py-24 bg-slate-50/30">
      <div className="container mx-auto px-4">
        
        {/* --- ISLA DEL HOTEL --- */}
        <div className="max-w-5xl mx-auto mb-24">
          <motion.div 
            className="relative overflow-hidden rounded-[3rem] bg-white border-2 border-[#2878a8]/10 shadow-xl p-8 md:p-12"
          >
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-left">
                <div className="inline-flex items-center justify-center p-3 mb-4 rounded-2xl bg-[#2878a8]/10 text-[#2878a8]">
                  <Hotel className="h-8 w-8" />
                </div>
                <h2 className="text-3xl font-black text-[#2878a8] uppercase tracking-tighter">¿Cómo estuvo tu estadía?</h2>
                <p className="mt-2 text-muted-foreground font-medium">Califica nuestras instalaciones y servicios generales.</p>
              </div>
              <Button 
                onClick={() => { setIsSurveyOpen(true); setCurrentStep(0); }}
                className="bg-[#2878a8] hover:bg-[#1e5a7e] text-white px-10 py-8 rounded-3xl text-xl font-black uppercase shadow-lg"
              >
                <Star className="mr-3 h-6 w-6 fill-current" /> Calificar Hotel
              </Button>
            </div>
          </motion.div>
        </div>

        {/* --- RESTO DE TU CÓDIGO (BOTONES DE ÁREAS) --- */}
        {/* ... (mantén tus áreas de Recepción, Camarería y Cocina aquí) ... */}

      </div>

      {/* --- CUESTIONARIO INTERACTIVO (MODAL) --- */}
      <AnimatePresence>
        {isSurveyOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-[2.5rem] w-full max-w-xl overflow-hidden shadow-2xl"
            >
              {/* Header con Progreso */}
              <div className="p-6 border-b bg-slate-50 relative">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-black text-[#2878a8] tracking-[0.2em] uppercase">
                    Pregunta {currentStep + 1} de {HOTEL_QUESTIONS.length}
                  </span>
                  <button onClick={() => setIsSurveyOpen(false)}><X size={20} className="text-slate-400" /></button>
                </div>
                <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-[#2878a8]" 
                  />
                </div>
              </div>

              {/* Cuerpo de la Pregunta */}
              <div className="p-10 text-center space-y-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <span className="px-3 py-1 bg-orange-100 text-[#f5ac0a] text-[10px] font-black rounded-lg uppercase">
                      {HOTEL_QUESTIONS[currentStep].section}
                    </span>
                    <h3 className="text-2xl font-bold text-slate-800 leading-tight">
                      {HOTEL_QUESTIONS[currentStep].question}
                    </h3>

                    {HOTEL_QUESTIONS[currentStep].isText ? (
                      <textarea 
                        className="w-full border-2 border-slate-100 rounded-2xl p-4 min-h-[120px] focus:border-[#2878a8] outline-none transition-all"
                        placeholder="Escribe tu opinión aquí..."
                      />
                    ) : (
                      <div className="flex justify-center gap-4">
                        {/* Botones de Reacción Estilo Personal */}
                        {[
                          { label: "Súper Satisfecho", color: "bg-emerald-500", border: "border-emerald-100" },
                          { label: "Regular", color: "bg-[#f5ac0a]", border: "border-orange-100" },
                          { label: "Nada Satisfecho", color: "bg-red-500", border: "border-red-100" }
                        ].map((btn, i) => (
                          <motion.button
                            key={i}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleNext}
                            className={cn(
                              "flex-1 flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all hover:shadow-md",
                              btn.border
                            )}
                          >
                            <div className={cn("h-4 w-4 rounded-full", btn.color)} />
                            <span className="text-[9px] font-black uppercase text-slate-500">{btn.label}</span>
                          </motion.button>
                        ))}
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Footer Navegación */}
              <div className="p-6 bg-slate-50 flex justify-between">
                <Button 
                  variant="ghost" 
                  disabled={currentStep === 0}
                  onClick={() => setCurrentStep(prev => prev - 1)}
                  className="text-slate-400 font-bold uppercase text-[10px]"
                >
                  <ChevronLeft className="mr-1 h-4 w-4" /> Anterior
                </Button>
                {HOTEL_QUESTIONS[currentStep].isText && (
                  <Button onClick={handleNext} className="bg-[#2878a8] font-black uppercase text-[10px] px-8">
                    Finalizar Encuesta
                  </Button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  )
}
