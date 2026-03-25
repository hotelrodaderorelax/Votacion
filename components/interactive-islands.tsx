"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChefHat, Sparkles, ConciergeBell, Hotel, Star, X, ChevronLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { EmployeeGrid } from "@/components/employee-grid"
import { Button } from "@/components/ui/button"

// 1. PREGUNTAS EXTRAÍDAS FIELMENTE DEL DOCUMENTO
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
  { section: "PERSONAL", question: "3. El personal fue capaz de responder sus inquietudes" },
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

const areas = [
  { id: "recepcion", name: "Recepción", description: "Tu primera sonrisa al llegar, siempre listos para ayudarte", icon: ConciergeBell, color: "from-[#2878a8] to-[#1e5a7e]", bgColor: "bg-blue-50", borderColor: "border-[#2878a8]/20", iconBg: "bg-[#2878a8]/10", iconColor: "text-[#2878a8]" },
  { id: "camareria", name: "Camarería", description: "Dedicados a mantener tu espacio impecable y confortable", icon: Sparkles, color: "from-[#f5ac0a] to-[#d49408]", bgColor: "bg-orange-50", borderColor: "border-[#f5ac0a]/20", iconBg: "bg-[#f5ac0a]/10", iconColor: "text-[#f5ac0a]" },
  { id: "cocina", name: "Cocina", description: "Nuestro equipo culinario prepara los mejores sabores del Caribe", icon: ChefHat, color: "from-[#2878a8] to-[#f5ac0a]", bgColor: "bg-slate-50", borderColor: "border-slate-200", iconBg: "bg-slate-100", iconColor: "text-slate-600" },
]

export function InteractiveIslands() {
  const [selectedArea, setSelectedArea] = React.useState<string | null>(null)
  const [isSurveyOpen, setIsSurveyOpen] = React.useState(false)
  const [currentStep, setCurrentStep] = React.useState(0)
  const gridRef = React.useRef<HTMLDivElement>(null)

  const progress = ((currentStep + 1) / HOTEL_QUESTIONS.length) * 100

  const handleNext = () => {
    if (currentStep < HOTEL_QUESTIONS.length - 1) setCurrentStep(prev => prev + 1)
    else setIsSurveyOpen(false)
  }

  return (
    <section id="votar" className="py-16 md:py-24 bg-slate-50/30">
      <div className="container mx-auto px-4">
        
        {/* --- ISLA SUPERIOR: HOTEL --- */}
        <div className="max-w-5xl mx-auto mb-24">
          <motion.div className="relative overflow-hidden rounded-[3rem] bg-white border-2 border-[#2878a8]/10 shadow-xl p-8 md:p-12">
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
              <div>
                <div className="inline-flex items-center justify-center p-3 mb-4 rounded-2xl bg-[#2878a8]/10 text-[#2878a8]">
                  <Hotel className="h-8 w-8" />
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-[#2878a8] uppercase tracking-tighter">¿Cómo estuvo tu estadía?</h2>
                <p className="mt-4 text-lg text-muted-foreground font-medium">Califica nuestras instalaciones y servicios generales del hotel.</p>
              </div>
              <Button onClick={() => { setIsSurveyOpen(true); setCurrentStep(0); }} className="bg-[#2878a8] hover:bg-[#1e5a7e] text-white px-10 py-8 rounded-3xl text-xl font-black uppercase shadow-lg">
                <Star className="mr-3 h-6 w-6 fill-current" /> Calificar Hotel
              </Button>
            </div>
          </motion.div>
        </div>

        {/* --- SECCIÓN: EMPLEADOS --- */}
        <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto mb-12">
          {areas.map((area) => (
            <motion.button key={area.id} onClick={() => setSelectedArea(area.id)} className={cn("group relative overflow-hidden rounded-[2.5rem] border-2 p-8 text-left transition-all", area.bgColor, area.borderColor)}>
              <div className={cn("mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl", area.iconBg)}>
                <area.icon className={cn("h-8 w-8", area.iconColor)} />
              </div>
              <h3 className="text-2xl font-bold uppercase">{area.name}</h3>
            </motion.button>
          ))}
        </div>

        {selectedArea && <div ref={gridRef} className="mt-16"><EmployeeGrid area={selectedArea} /></div>}
      </div>

      {/* --- MODAL INTERACTIVO CON EMOJIS --- */}
      <AnimatePresence>
        {isSurveyOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white rounded-[3rem] w-full max-w-xl overflow-hidden shadow-2xl">
              
              {/* Progreso */}
              <div className="p-6 border-b bg-slate-50">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] font-black text-[#2878a8] uppercase tracking-widest">Pregunta {currentStep + 1} de {HOTEL_QUESTIONS.length}</span>
                  <button onClick={() => setIsSurveyOpen(false)}><X size={20} className="text-slate-400" /></button>
                </div>
                <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                  <motion.div animate={{ width: `${progress}%` }} className="h-full bg-[#2878a8]" />
                </div>
              </div>

            {/* Pregunta y Emojis */}
<div className="p-10 text-center space-y-8">
  <span className="px-3 py-1 bg-orange-100 text-[#f5ac0a] text-[10px] font-black rounded-lg uppercase">
    {HOTEL_QUESTIONS[currentStep].section}
  </span>
  <h3 className="text-2xl font-bold text-slate-800 leading-tight">
    {HOTEL_QUESTIONS[currentStep].question}
  </h3>

  {HOTEL_QUESTIONS[currentStep].isText ? (
    <textarea 
      className="w-full border-2 border-slate-100 rounded-[2rem] p-4 min-h-[120px] focus:border-[#2878a8] outline-none transition-all" 
      placeholder="Escribe aquí tu comentario..." 
    />
  ) : (
    <div className="flex justify-center gap-4">
      {ratingOptions.map((option) => {
        // Suponiendo que guardas el estado en un objeto llamado 'ratings'
        const isSelected = ratings[currentStep] === option.value;

        return (
          <motion.button
            key={option.value}
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => handleRating(e, option.value)} // Usamos tu función handleRating
            className={cn(
              "flex-1 flex flex-col items-center gap-3 p-6 rounded-[2.5rem] border-2 transition-all duration-300 shadow-sm",
              // Si está seleccionado, aplicamos el color sólido y anillo
              isSelected
                ? `${option.color} text-white border-transparent ring-4 ring-offset-2 ${option.ringColor} scale-105 shadow-lg`
                : "bg-white border-slate-100 text-slate-400 hover:bg-slate-50"
            )}
          >
            <span className="text-5xl filter drop-shadow-sm">{option.emoji}</span>
            <span className={cn(
              "text-[9px] font-black uppercase tracking-tighter transition-colors text-center",
              isSelected ? "text-white" : "text-slate-500"
            )}>
              {option.label}
            </span>
          </motion.button>
        );
      })}
    </div>
  )}
</div>
              </div>

              {/* Navegación */}
              <div className="p-6 bg-slate-50 flex justify-between">
                <Button variant="ghost" disabled={currentStep === 0} onClick={() => setCurrentStep(prev => prev - 1)} className="text-slate-400 font-bold uppercase text-[10px]"><ChevronLeft className="mr-1 h-4 w-4" /> Anterior</Button>
                {HOTEL_QUESTIONS[currentStep].isText && <Button onClick={handleNext} className="bg-[#2878a8] font-black uppercase text-[10px] px-8">Finalizar</Button>}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  )
}
