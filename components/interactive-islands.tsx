"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChefHat, Sparkles, ConciergeBell, Hotel, Star, X, ChevronLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { EmployeeGrid } from "@/components/employee-grid"
import { Button } from "@/components/ui/button"

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

// --- NUEVA PALETA DE COLORES POR CATEGORÍA ---
const sectionStyles: Record<string, { bg: string, text: string }> = {
  "BIENVENIDA": { bg: "bg-blue-100", text: "text-blue-600" },
  "REGISTRO": { bg: "bg-emerald-100", text: "text-emerald-600" },
  "HABITACIÓN": { bg: "bg-purple-100", text: "text-purple-600" },
  "PERSONAL": { bg: "bg-orange-100", text: "text-orange-600" },
  "ALIMENTACIÓN": { bg: "bg-amber-100", text: "text-amber-600" },
  "GENERAL": { bg: "bg-cyan-100", text: "text-cyan-600" },
  "FEEDBACK": { bg: "bg-slate-100", text: "text-slate-600" },
}

const areas = [
  { id: "recepcion", name: "Recepción", description: "Ayuda constante", icon: ConciergeBell, bgColor: "bg-blue-50", borderColor: "border-[#2878a8]/20", iconBg: "bg-[#2878a8]/10", iconColor: "text-[#2878a8]" },
  { id: "camareria", name: "Camarería", description: "Espacio impecable", icon: Sparkles, bgColor: "bg-orange-50", borderColor: "border-[#f5ac0a]/20", iconBg: "bg-[#f5ac0a]/10", iconColor: "text-[#f5ac0a]" },
  { id: "cocina", name: "Cocina", description: "Sabores del Caribe", icon: ChefHat, bgColor: "bg-slate-50", borderColor: "border-slate-200", iconBg: "bg-slate-100", iconColor: "text-slate-600" },
]

export function InteractiveIslands() {
  const [selectedArea, setSelectedArea] = React.useState<string | null>(null)
  const [isSurveyOpen, setIsSurveyOpen] = React.useState(false)
  const [currentStep, setCurrentStep] = React.useState(0)
  const [ratings, setRatings] = React.useState<Record<number, string>>({})
  const [textFeedback, setTextFeedback] = React.useState("")
  const gridRef = React.useRef<HTMLDivElement>(null)

  const progress = ((currentStep + 1) / HOTEL_QUESTIONS.length) * 100
  
  // Obtener el estilo de la sección actual
  const currentSection = HOTEL_QUESTIONS[currentStep].section
  const currentStyle = sectionStyles[currentSection] || sectionStyles["GENERAL"]

  const handleRating = (e: React.MouseEvent, value: string) => {
    e.preventDefault()
    setRatings(prev => ({ ...prev, [currentStep]: value }))
    if (currentStep < HOTEL_QUESTIONS.length - 1) {
      setTimeout(() => setCurrentStep(prev => prev + 1), 400)
    }
  }

  const handleFinish = async () => {
    try {
      const response = await fetch('/api/survey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ratings, textFeedback }),
      });

      if (response.ok) {
        alert("¡Gracias por tu opinión!");
        setIsSurveyOpen(false);
        setCurrentStep(0);
        setRatings({});
        setTextFeedback("");
      }
    } catch (error) {
      console.error("Error de red:", error);
    }
  };

  return (
    <section id="votar" className="py-16 md:py-24 bg-slate-50/30">
      <div className="container mx-auto px-4">
        {/* Isla Superior */}
        <div className="max-w-5xl mx-auto mb-24">
          <motion.div className="relative overflow-hidden rounded-[3rem] bg-white border-2 border-[#2878a8]/10 shadow-xl p-8 md:p-12">
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
              <div>
                <div className="inline-flex items-center justify-center p-3 mb-4 rounded-2xl bg-[#2878a8]/10 text-[#2878a8]">
                  <Hotel className="h-8 w-8" />
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-[#2878a8] uppercase tracking-tighter">¿Cómo estuvo tu estadía?</h2>
                <p className="mt-4 text-lg text-muted-foreground font-medium">Califica nuestras instalaciones y servicios generales.</p>
              </div>
              <Button onClick={() => { setIsSurveyOpen(true); setCurrentStep(0); }} className="bg-[#2878a8] hover:bg-[#1e5a7e] text-white px-10 py-8 rounded-3xl text-xl font-black uppercase shadow-lg transition-transform active:scale-95">
                <Star className="mr-3 h-6 w-6 fill-current" /> Calificar Hotel
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Áreas */}
        <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto mb-12">
          {areas.map((area) => (
            <motion.button 
              key={area.id} 
              whileHover={{ y: -5 }}
              onClick={() => setSelectedArea(area.id)} 
              className={cn("group relative overflow-hidden rounded-[2.5rem] border-2 p-8 text-left transition-all", area.bgColor, area.borderColor, selectedArea === area.id && "ring-4 ring-[#2878a8]/20")}
            >
              <div className={cn("mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl", area.iconBg)}>
                <area.icon className={cn("h-8 w-8", area.iconColor)} />
              </div>
              <h3 className="text-2xl font-bold uppercase text-slate-800">{area.name}</h3>
            </motion.button>
          ))}
        </div>

        {selectedArea && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} ref={gridRef} className="mt-16">
            <EmployeeGrid area={selectedArea} />
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {isSurveyOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white rounded-[3rem] w-full max-w-xl overflow-hidden shadow-2xl">
              
              <div className="p-6 border-b bg-slate-50">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] font-black text-[#2878a8] uppercase tracking-widest">
                    Pregunta {currentStep + 1} de {HOTEL_QUESTIONS.length}
                  </span>
                  <button onClick={() => setIsSurveyOpen(false)} className="hover:rotate-90 transition-transform">
                    <X size={24} className="text-slate-400" />
                  </button>
                </div>
                <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                  <motion.div animate={{ width: `${progress}%` }} className="h-full bg-[#2878a8]" />
                </div>
              </div>

              <div className="p-10 text-center space-y-8 min-h-[380px] flex flex-col justify-center">
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                  >
                    {/* ETIQUETA CON COLOR DINÁMICO */}
                    <span className={cn(
                      "px-4 py-1.5 text-[10px] font-black rounded-xl uppercase tracking-wider shadow-sm transition-colors",
                      currentStyle.bg,
                      currentStyle.text
                    )}>
                      {currentSection}
                    </span>

                    <h3 className="text-2xl font-bold text-slate-800 leading-tight">
                      {HOTEL_QUESTIONS[currentStep].question}
                    </h3>

                    {HOTEL_QUESTIONS[currentStep].isText ? (
                      <textarea 
                        value={textFeedback}
                        onChange={(e) => setTextFeedback(e.target.value)}
                        className="w-full border-2 border-slate-100 rounded-[2rem] p-6 min-h-[150px] focus:border-[#2878a8] focus:ring-4 focus:ring-[#2878a8]/10 outline-none transition-all resize-none" 
                        placeholder="Tu opinión es muy importante para nosotros..." 
                      />
                    ) : (
                      <div className="flex justify-center gap-4">
                      {ratingOptions.map((option) => {
  const isSelected = ratings[currentStep] === option.value;
  return (
    <motion.button
      key={option.value}
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.95 }}
      onClick={(e) => handleRating(e, option.value)}
      className={cn(
        "flex-1 flex flex-col items-center gap-3 p-6 rounded-[2.5rem] border-2 transition-all duration-300 shadow-sm",
        // CAMBIO AQUÍ: Si está seleccionado, usa su color. Si no, fondo transparente/blanco.
        isSelected
          ? `${option.color} text-white border-transparent ring-4 ring-offset-2 ${option.ringColor} scale-105 shadow-lg`
          : "bg-white border-slate-100 text-slate-400 hover:bg-slate-50"
      )}
    >
      <span className="text-5xl filter drop-shadow-sm">{option.emoji}</span>
      <span className={cn(
        "text-[9px] font-black uppercase tracking-tighter transition-colors text-center leading-none",
        isSelected ? "text-white" : "text-slate-500"
      )}>
        {option.label}
      </span>
    </motion.button>
  );
})}
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="p-6 bg-slate-50 flex justify-between items-center">
                <Button 
                  variant="ghost" 
                  disabled={currentStep === 0} 
                  onClick={() => setCurrentStep(prev => prev - 1)} 
                  className="text-slate-400 font-bold uppercase text-[10px] tracking-widest"
                >
                  <ChevronLeft className="mr-1 h-4 w-4" /> Anterior
                </Button>

                {HOTEL_QUESTIONS[currentStep].isText ? (
                  <Button 
                    onClick={handleFinish} 
                    className="bg-[#2878a8] hover:bg-[#1e5a7e] font-black uppercase text-[10px] px-10 h-12 rounded-2xl shadow-lg"
                  >
                    Finalizar Encuesta
                  </Button>
                ) : (
                  <div className="w-24" />
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  )
}
