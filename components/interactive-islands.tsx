"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Hotel, Star, X, ChevronLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

// 1. LISTADO DE PREGUNTAS (Fiel al documento PDF)
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

export function InteractiveHotelSurvey() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [currentStep, setCurrentStep] = React.useState(0)
  
  const progress = ((currentStep + 1) / HOTEL_QUESTIONS.length) * 100

  const handleAnswer = () => {
    if (currentStep < HOTEL_QUESTIONS.length - 1) {
      setCurrentStep(prev => prev + 1)
    } else {
      setIsOpen(false)
    }
  }

  return (
    <>
      {/* Botón de Activación en la Isla */}
      <Button 
        onClick={() => { setIsOpen(true); setCurrentStep(0); }}
        className="bg-[#2878a8] hover:bg-[#1e5a7e] text-white px-10 py-8 rounded-3xl text-xl font-black uppercase shadow-lg transition-transform active:scale-95"
      >
        <Star className="mr-3 h-6 w-6 fill-current" />
        Calificar Hotel
      </Button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[3rem] w-full max-w-xl overflow-hidden shadow-2xl flex flex-col"
            >
              {/* Header con Progreso */}
              <div className="p-6 border-b bg-slate-50 relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Hotel className="h-5 w-5 text-[#2878a8]" />
                    <span className="text-[10px] font-black text-[#2878a8] tracking-[0.2em] uppercase">
                      Pregunta {currentStep + 1} de {HOTEL_QUESTIONS.length}
                    </span>
                  </div>
                  <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                    <X size={20} className="text-slate-400" />
                  </button>
                </div>
                <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-[#2878a8]" 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Cuerpo del Cuestionario */}
              <div className="p-8 md:p-12 text-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                  >
                    <span className="inline-block px-4 py-1 bg-orange-50 text-[#f5ac0a] text-[10px] font-black rounded-full uppercase tracking-widest border border-orange-100">
                      {HOTEL_QUESTIONS[currentStep].section}
                    </span>
                    
                    <h3 className="text-2xl md:text-3xl font-bold text-slate-800 leading-tight">
                      {HOTEL_QUESTIONS[currentStep].question}
                    </h3>

                    {HOTEL_QUESTIONS[currentStep].isText ? (
                      <textarea 
                        className="w-full border-2 border-slate-100 rounded-[2rem] p-6 min-h-[150px] focus:border-[#2878a8] outline-none transition-all text-slate-600 font-medium"
                        placeholder="Tus comentarios nos ayudan a mejorar..."
                      />
                    ) : (
                      <div className="flex justify-center gap-3 md:gap-6">
                        {/* REACCIONES CON EMOJIS IDÉNTICOS */}
                        {[
                          { label: "Súper Satisfecho", emoji: "😊", color: "hover:bg-emerald-500", text: "text-emerald-500", border: "border-emerald-100" },
                          { label: "Regular", emoji: "😐", color: "hover:bg-[#f5ac0a]", text: "text-orange-400", border: "border-orange-100" },
                          { label: "Nada Satisfecho", emoji: "☹️", color: "hover:bg-red-500", text: "text-red-500", border: "border-red-100" }
                        ].map((btn, i) => (
                          <motion.button
                            key={i}
                            whileHover={{ y: -5 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleAnswer}
                            className={cn(
                              "flex-1 flex flex-col items-center gap-4 p-6 rounded-[2.5rem] border-2 transition-all group",
                              btn.border
                            )}
                          >
                            <span className="text-4xl md:text-5xl">{btn.emoji}</span>
                            <span className={cn("text-[10px] font-black uppercase tracking-tighter transition-colors group-hover:text-white", btn.text)}>
                              {btn.label}
                            </span>
                          </motion.button>
                        ))}
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Navegación Inferior */}
              <div className="p-6 bg-slate-50 flex justify-between items-center">
                <Button 
                  variant="ghost" 
                  disabled={currentStep === 0}
                  onClick={() => setCurrentStep(prev => prev - 1)}
                  className="text-slate-400 font-bold uppercase text-[10px] tracking-widest"
                >
                  <ChevronLeft className="mr-2 h-4 w-4" /> Anterior
                </Button>
                
                {HOTEL_QUESTIONS[currentStep].isText && (
                  <Button 
                    onClick={handleAnswer}
                    className="bg-[#2878a8] hover:bg-[#1e5a7e] text-white px-8 py-6 rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] shadow-lg"
                  >
                    Enviar Encuesta
                  </Button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
