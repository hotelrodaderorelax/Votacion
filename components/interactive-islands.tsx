"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChefHat, Sparkles, ConciergeBell, Hotel, Star, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { EmployeeGrid } from "@/components/employee-grid"
import { Button } from "@/components/ui/button"

// 1. DEFINICIÓN DE PREGUNTAS (Al pie de la letra del PDF) 
const HOTEL_SURVEY_QUESTIONS = [
  { section: "Bienvenida", question: "¿Te sentiste bienvenid@ cuándo entraste en el hotel?" },
  { section: "Registro", question: "1. Fue rápido y eficiente el registro" },
  { section: "Registro", question: "2. El personal de la recepción se mostró amable y cordial" },
  { section: "Registro", question: "3. La reserva contenía todos los servicios contratados" },
  { section: "Habitación", question: "1. Recibió una habitación cómoda y limpia" },
  { section: "Habitación", question: "2. La cama y las sábanas fueron confortables" },
  { section: "Habitación", question: "3. El cuarto de baño estuvo limpio y equipado" },
  { section: "Habitación", question: "4. Estado del inmobiliario" },
  { section: "Personal", question: "1. Los camareros de limpieza fueron amables y de confianza" },
  { section: "Personal", question: "2. Las auxiliares de cocina le brindaron un trato afable y agradable" },
  { section: "Personal", question: "3. El personal fue capaz de responder sus inquietudes y/o acompañarlo en sus requerimientos" },
  { section: "Alimentación", question: "1. La comida fue de buena calidad" },
  { section: "Alimentación", question: "2. La porción de cada alimento es equilibrada y adecuada" },
  { section: "Alimentación", question: "3. Hubo variedad en los platos servidos en desayuno y cena" },
  { section: "Alimentación", question: "4. La entrega del servicio fue ágil y oportuna" },
  { section: "Alimentación", question: "5. Presentación" },
  { section: "General", question: "¿Percibió tranquilidad en el hotel?" },
  { section: "General", question: "¿Recomendarías nuestro hotel a otras personas basándose en su experiencia?" },
  { section: "General", question: "¿Cómo evaluarías tu experiencia en nuestro hotel?" },
  { section: "Feedback", question: "Déjanos saber qué es lo que podríamos mejorar", isText: true }
];

const areas = [
  {
    id: "recepcion",
    name: "Recepción",
    description: "Tu primera sonrisa al llegar, siempre listos para ayudarte",
    icon: ConciergeBell,
    color: "from-[#2878a8] to-[#1e5a7e]",
    bgColor: "bg-blue-50",
    borderColor: "border-[#2878a8]/20",
    iconBg: "bg-[#2878a8]/10",
    iconColor: "text-[#2878a8]",
  },
  {
    id: "camareria",
    name: "Camarería",
    description: "Dedicados a mantener tu espacio impecable y confortable",
    icon: Sparkles,
    color: "from-[#f5ac0a] to-[#d49408]",
    bgColor: "bg-orange-50",
    borderColor: "border-[#f5ac0a]/20",
    iconBg: "bg-[#f5ac0a]/10",
    iconColor: "text-[#f5ac0a]",
  },
  {
    id: "cocina",
    name: "Cocina",
    description: "Nuestro equipo culinario prepara los mejores sabores del Caribe",
    icon: ChefHat,
    color: "from-[#2878a8] to-[#f5ac0a]",
    bgColor: "bg-slate-50",
    borderColor: "border-slate-200",
    iconBg: "bg-slate-100",
    iconColor: "text-slate-600",
  },
]

export function InteractiveIslands() {
  const [selectedArea, setSelectedArea] = React.useState<string | null>(null)
  const [isHotelSurveyOpen, setIsHotelSurveyOpen] = React.useState(false)
  const gridRef = React.useRef<HTMLDivElement>(null)

  const handleAreaClick = (areaId: string) => {
    setSelectedArea(selectedArea === areaId ? null : areaId)
    if (selectedArea !== areaId) {
      setTimeout(() => {
        gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
      }, 100)
    }
  }

  return (
    <section id="votar" className="py-16 md:py-24 bg-slate-50/30">
      <div className="container mx-auto px-4">
        
        {/* --- ISLA: CALIFICACIÓN GENERAL DEL HOTEL --- */}
        <div className="max-w-5xl mx-auto mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-[3rem] bg-white border-2 border-[#2878a8]/10 shadow-xl p-8 md:p-12"
          >
            <div className="absolute top-0 right-0 -mr-16 -mt-16 opacity-[0.03] pointer-events-none">
              <Hotel size={300} />
            </div>

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-left">
                <div className="inline-flex items-center justify-center p-3 mb-4 rounded-2xl bg-[#2878a8]/10 text-[#2878a8]">
                  <Hotel className="h-8 w-8" />
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-[#2878a8] uppercase tracking-tighter">
                  ¿Cómo estuvo tu estadía?
                </h2>
                <p className="mt-4 text-lg text-muted-foreground max-w-xl font-medium">
                  Califica nuestras instalaciones, habitaciones y servicios generales del hotel según tu experiencia. [cite: 5, 11]
                </p>
              </div>

              <Button 
                onClick={() => setIsHotelSurveyOpen(true)}
                className="bg-[#2878a8] hover:bg-[#1e5a7e] text-white px-10 py-8 rounded-3xl text-xl font-black uppercase tracking-widest shadow-lg transition-transform active:scale-95"
              >
                <Star className="mr-3 h-6 w-6 fill-current" />
                Calificar Hotel
              </Button>
            </div>
          </motion.div>
        </div>

        {/* --- SECCIÓN: EMPLEADOS --- */}
        <div className="mx-auto max-w-3xl text-center mb-12">
          <div className="flex items-center justify-center gap-2 text-[#f5ac0a] mb-2">
            <span className="h-px w-8 bg-[#f5ac0a]/30" />
            <span className="font-black uppercase text-xs tracking-[0.3em]">Nuestro Equipo</span>
            <span className="h-px w-8 bg-[#f5ac0a]/30" />
          </div>
          <h2 className="font-serif text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl">
            Vota por el Empleado del Mes
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Selecciona un área para calificar el servicio personalizado que recibiste.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
          {areas.map((area, index) => (
            <motion.button
              key={area.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleAreaClick(area.id)}
              className={cn(
                "group relative overflow-hidden rounded-[2.5rem] border-2 p-8 text-left transition-all duration-300 shadow-sm",
                area.bgColor,
                area.borderColor,
                selectedArea === area.id && "ring-4 ring-[#2878a8] ring-offset-4"
              )}
            >
              <div className={cn(
                "absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-10 bg-gradient-to-br",
                area.color
              )} />
              
              <div className={cn(
                "mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl transition-transform duration-500 group-hover:rotate-12",
                area.iconBg
              )}>
                <area.icon className={cn("h-8 w-8", area.iconColor)} />
              </div>

              <h3 className="text-2xl font-bold text-foreground tracking-tight uppercase">
                {area.name}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {area.description}
              </p>
            </motion.button>
          ))}
        </div>

        <div ref={gridRef} className="scroll-mt-24"> 
          {selectedArea && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-16 pt-16 border-t border-slate-200"
            >
              <EmployeeGrid area={selectedArea} />
            </motion.div>
          )}
        </div>
      </div>

      {/* --- CUESTIONARIO EMERGENTE DEL HOTEL --- */}
      <AnimatePresence>
        {isHotelSurveyOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[2.5rem] w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
            >
              {/* Header del Modal */}
              <div className="p-6 border-b flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-[#2878a8] rounded-full flex items-center justify-center text-white">
                    <Hotel size={20} />
                  </div>
                  <div>
                    <h3 className="font-black text-[#2878a8] uppercase text-sm tracking-widest">Encuesta de Satisfacción</h3> [cite: 2]
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Hotel Rodadero Relax</p> [cite: 3]
                  </div>
                </div>
                <button 
                  onClick={() => setIsHotelSurveyOpen(false)}
                  className="h-10 w-10 rounded-full hover:bg-slate-200 flex items-center justify-center transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Contenido del Cuestionario (Scrollable) */}
              <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
                {HOTEL_SURVEY_QUESTIONS.map((q, idx) => (
                  <div key={idx} className="space-y-4">
                    <div className="flex items-baseline gap-3">
                      <span className="text-[10px] font-black text-[#f5ac0a] uppercase tracking-tighter bg-orange-50 px-2 py-1 rounded-md">
                        {q.section}
                      </span>
                    </div>
                    <p className="text-lg font-bold text-slate-700 leading-tight">
                      {q.question} 
                    </p>
                    
                    {q.isText ? (
                      <textarea 
                        placeholder="Escribe aquí tus comentarios..."
                        className="w-full border-2 border-slate-100 rounded-2xl p-4 min-h-[120px] focus:border-[#2878a8] outline-none transition-colors text-sm"
                      />
                    ) : (
                      <div className="flex gap-4">
                        {["Nada Satisfecho", "Regular", "Súper Satisfecho"].map((label, i) => (
                          <button 
                            key={i}
                            className={cn(
                              "flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 transition-all",
                              i === 0 && "border-red-50 text-red-400 hover:bg-red-500 hover:text-white",
                              i === 1 && "border-orange-50 text-orange-400 hover:bg-[#f5ac0a] hover:text-white",
                              i === 2 && "border-emerald-50 text-emerald-400 hover:bg-emerald-500 hover:text-white"
                            )}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Footer del Modal */}
              <div className="p-6 bg-slate-50 border-t">
                <Button 
                  onClick={() => setIsHotelSurveyOpen(false)}
                  className="w-full bg-[#2878a8] py-6 rounded-2xl font-black uppercase tracking-[0.2em]"
                >
                  Enviar Comentarios
                </Button>
                <p className="text-center text-[9px] text-slate-400 mt-4 font-medium italic">
                  Tus comentarios nos ayudarán a mejorar la calidad del servicio. [cite: 11]
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  )
}
