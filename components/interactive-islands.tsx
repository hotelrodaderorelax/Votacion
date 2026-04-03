"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChefHat, Sparkles, ConciergeBell, Hotel, Star, X, ChevronLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { EmployeeGrid } from "@/components/employee-grid"
import { Button } from "@/components/ui/button"

// Valores numéricos para el tipo integer de tu tabla
const ratingOptions = [
  { value: "3", label: "Súper Satisfecho", color: "bg-emerald-500", emoji: "😊" },
  { value: "2", label: "Regular", color: "bg-amber-500", emoji: "😐" },
  { value: "1", label: "Nada Satisfecho", color: "bg-red-500", emoji: "😡" },
]

// IDs mapeados EXACTAMENTE a tu resultado de SQL
const HOTEL_QUESTIONS = [
  { id: "bienvenida_sentir", section: "BIENVENIDA", question: "¿Te sentiste bienvenid@ cuándo entraste en el hotel?" },
  { id: "registro_rapidez", section: "REGISTRO", question: "1. Fue rápido y eficiente el registro" },
  { id: "registro_amabilidad", section: "REGISTRO", question: "2. El personal de la recepción se mostró amable y cordial" },
  { id: "registro_reserva_servicios", section: "REGISTRO", question: "3. La reserva contenía todos los servicios contratados" },
  { id: "habitacion_limpieza", section: "HABITACIÓN", question: "1. Recibió una habitación cómoda y limpia" },
  { id: "habitacion_confort", section: "HABITACIÓN", question: "2. La cama y las sábanas fueron confortables" },
  { id: "habitacion_baño_limpio", section: "HABITACIÓN", question: "3. El cuarto de baño estuvo limpio y equipado" },
  { id: "habitacion_mobiliario", section: "HABITACIÓN", question: "4. Estado del mobiliario" },
  { id: "personal_limpieza_amable", section: "PERSONAL", question: "1. Los camareros de limpieza fueron amables y de confianza" },
  { id: "personal_cocina_trato", section: "PERSONAL", question: "2. Las auxiliares de cocina le brindaron un trato afable y agradable" },
  { id: "personal_resolucion_inquietudes", section: "PERSONAL", question: "3. El personal fue capaz de responder sus inquietudes" },
  { id: "alimento_calidad", section: "ALIMENTACIÓN", question: "1. La comida fue de buena calidad" },
  { id: "alimento_porcion", section: "ALIMENTACIÓN", question: "2. La porción de cada alimento es equilibrada y adecuada" },
  { id: "alimento_variedad", section: "ALIMENTACIÓN", question: "3. Hubo variedad en los platos servidos en desayuno y cena" },
  { id: "alimento_agilidad", section: "ALIMENTACIÓN", question: "4. La entrega del servicio fue ágil y oportuna" },
  { id: "alimento_presentacion", section: "ALIMENTACIÓN", question: "5. Presentación" },
  { id: "general_tranquilidad", section: "GENERAL", question: "¿Percibió tranquilidad en el hotel?" },
  { id: "general_recomendacion", section: "GENERAL", question: "¿Recomendarías nuestro hotel a otras personas?" },
  { id: "general_evaluacion", section: "GENERAL", question: "¿Cómo evaluarías tu experiencia en nuestro hotel?" },
  { id: "mejoras_sugerencias", section: "FEEDBACK", question: "Déjanos saber qué es lo que podríamos mejorar", isText: true }
];

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
  { id: "recepcion", name: "Recepción", icon: ConciergeBell, bgColor: "bg-blue-50", iconColor: "text-[#2878a8]" },
  { id: "camareria", name: "Camarería", icon: Sparkles, bgColor: "bg-orange-50", iconColor: "text-[#f5ac0a]" },
  { id: "cocina", name: "Cocina", icon: ChefHat, bgColor: "bg-slate-50", iconColor: "text-slate-600" },
]

export function InteractiveIslands() {
  const [selectedArea, setSelectedArea] = React.useState<string | null>(null)
  const [isSurveyOpen, setIsSurveyOpen] = React.useState(false)
  const [currentStep, setCurrentStep] = React.useState(0)
  const [ratings, setRatings] = React.useState<Record<string, string>>({})
  const [textFeedback, setTextFeedback] = React.useState("")
  const gridRef = React.useRef<HTMLDivElement>(null)

  const handleAreaClick = (areaId: string) => {
    setSelectedArea(areaId);
    setTimeout(() => {
      gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 150);
  };

  const handleRating = (value: string) => {
    const questionId = HOTEL_QUESTIONS[currentStep].id;
    setRatings(prev => ({ ...prev, [questionId]: value }));
    if (currentStep < HOTEL_QUESTIONS.length - 1) {
      setTimeout(() => setCurrentStep(prev => prev + 1), 300);
    }
  };

  const handleFinish = async () => {
    // Estructura limpia que coincide con la tabla hotel_survey_responses
    const payload = {
      ...ratings,
      mejoras_sugerencias: textFeedback || "Sin comentarios"
    };

    try {
      const response = await fetch('/api/survey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        alert("¡Muchas gracias por su tiempo!");
        setIsSurveyOpen(false);
        setRatings({});
        setTextFeedback("");
        setCurrentStep(0);
      } else {
        console.error("Error del servidor:", data);
        alert(`Error: ${data.error || 'Verifique que respondió todas las preguntas'}`);
      }
    } catch (error) {
      console.error("Error de red:", error);
    }
  };

  const progress = ((currentStep + 1) / HOTEL_QUESTIONS.length) * 100;

  return (
    <section id="votar" className="py-16 bg-slate-50/30">
      <div className="container mx-auto px-4">
        {/* Banner */}
        <div className="max-w-5xl mx-auto mb-12">
          <div className="rounded-[3rem] bg-white border-2 border-[#2878a8]/10 shadow-xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <div className="inline-flex p-3 mb-4 rounded-2xl bg-[#2878a8]/10 text-[#2878a8]">
                <Hotel className="h-8 w-8" />
              </div>
              <h2 className="text-3xl font-black text-[#2878a8] uppercase tracking-tighter">¿Cómo estuvo tu estadía?</h2>
              <p className="text-muted-foreground font-medium">Califica nuestras instalaciones y servicios generales.</p>
            </div>
            <Button onClick={() => setIsSurveyOpen(true)} className="bg-[#2878a8] hover:bg-[#1e5a7e] text-white px-10 py-8 rounded-3xl text-xl font-black uppercase">
              <Star className="mr-3 h-6 w-6 fill-current" /> Calificar Hotel
            </Button>
          </div>
        </div>

        {/* Áreas */}
        <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
          {areas.map((area) => (
            <button key={area.id} onClick={() => handleAreaClick(area.id)} className={cn("p-8 rounded-[2.5rem] border-2 text-left transition-all", area.bgColor, selectedArea === area.id ? "border-[#2878a8] ring-4 ring-[#2878a8]/10" : "border-transparent shadow-sm hover:shadow-md")}>
              <area.icon className={cn("h-10 w-10 mb-4", area.iconColor)} />
              <h3 className="text-2xl font-bold uppercase text-slate-800">{area.name}</h3>
            </button>
          ))}
        </div>

        {selectedArea && (
          <div ref={gridRef} className="mt-16 scroll-mt-24">
            <EmployeeGrid area={selectedArea} />
          </div>
        )}
      </div>

      <AnimatePresence>
        {isSurveyOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-[3rem] w-full max-w-xl overflow-hidden shadow-2xl">
              <div className="relative">
                <div className="p-6 border-b flex justify-between items-center">
                  <span className="text-[10px] font-black text-[#2878a8] uppercase tracking-widest">Pregunta {currentStep + 1} de {HOTEL_QUESTIONS.length}</span>
                  <button onClick={() => setIsSurveyOpen(false)}><X size={24} className="text-slate-400" /></button>
                </div>
                {/* Barra de progreso fluida */}
                <div className="h-1.5 w-full bg-slate-100">
                  <motion.div className="h-full bg-[#2878a8]" animate={{ width: `${progress}%` }} />
                </div>
              </div>

              <div className="p-10 text-center min-h-[400px] flex flex-col justify-center gap-8">
                <span className={cn("px-4 py-1.5 text-[10px] font-black rounded-xl uppercase self-center", sectionStyles[HOTEL_QUESTIONS[currentStep].section].bg, sectionStyles[HOTEL_QUESTIONS[currentStep].section].text)}>
                  {HOTEL_QUESTIONS[currentStep].section}
                </span>
                <h3 className="text-2xl font-bold text-slate-800">{HOTEL_QUESTIONS[currentStep].question}</h3>

                {HOTEL_QUESTIONS[currentStep].isText ? (
                  <textarea value={textFeedback} onChange={(e) => setTextFeedback(e.target.value)} className="w-full border-2 border-slate-100 rounded-[2rem] p-6 min-h-[150px] outline-none focus:border-[#2878a8]" placeholder="Escribe aquí..." />
                ) : (
                  <div className="flex gap-4">
                    {ratingOptions.map((opt) => (
                      <button key={opt.value} onClick={() => handleRating(opt.value)} className={cn("flex-1 p-6 rounded-[2.5rem] text-white shadow-lg transition-transform active:scale-95", opt.color)}>
                        <span className="text-4xl block mb-2">{opt.emoji}</span>
                        <span className="text-[10px] font-black uppercase tracking-tighter">{opt.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-6 bg-slate-50 flex justify-between items-center">
                <Button variant="ghost" disabled={currentStep === 0} onClick={() => setCurrentStep(prev => prev - 1)} className="uppercase text-[10px] font-bold"><ChevronLeft className="mr-1 h-4 w-4" /> Anterior</Button>
                {HOTEL_QUESTIONS[currentStep].isText && (
                  <Button onClick={handleFinish} className="bg-[#2878a8] font-black uppercase text-[10px] px-8 rounded-2xl">Finalizar Encuesta</Button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  )
}
