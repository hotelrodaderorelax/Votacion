"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import useSWR from "swr"
import { Star, MessageSquare, ChevronDown, ChevronUp } from "lucide-react"
import { EmployeeCard } from "@/components/employee-card"
import { RatingDialog } from "@/components/rating-dialog"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

type Employee = {
  id: string
  name: string
  role: string
  department: string
  photo_url: string
  total_votes: number
  average_rating: number
}

// Interfaz para los comentarios del empleado
type Feedback = {
  comentario: string
  rating: number
  created_at: string
}

const departmentMap: Record<string, string> = {
  cocina: "Cocina",
  camareria: "Camarería", 
  recepcion: "recepción",
}

export function EmployeeGrid({ area }: { area: string }) {
  const [selectedEmployee, setSelectedEmployee] = React.useState<Employee | null>(null)
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  
  // Estado para controlar qué empleado tiene los comentarios desplegados
  const [expandedEmployeeId, setExpandedEmployeeId] = React.useState<string | null>(null)
  const [employeeFeedbacks, setEmployeeFeedbacks] = React.useState<Record<string, Feedback[]>>({})

  const { data: employees, isLoading, mutate } = useSWR<Employee[]>("/api/employees", fetcher)

  // Cargar comentarios cuando se expande un empleado
  const toggleComments = async (e: React.MouseEvent, empId: string) => {
    e.stopPropagation(); // Evita que se abra el diálogo de votación al expandir
    
    if (expandedEmployeeId === empId) {
      setExpandedEmployeeId(null);
      return;
    }

    setExpandedEmployeeId(empId);

    // Solo cargamos si no los tenemos ya en memoria
    if (!employeeFeedbacks[empId]) {
      try {
        const res = await fetch(`/api/employee-feedback?id=${empId}`);
        const data = await res.json();
        setEmployeeFeedbacks(prev => ({ ...prev, [empId]: data }));
      } catch (error) {
        console.error("Error cargando comentarios:", error);
      }
    }
  };

  const filteredEmployees = React.useMemo(() => {
    let list = employees ? [...employees] : []
    
    if (area === "recepcion") {
      const exists = list.find(e => e.name === "Lexilis Mejía")
      if (!exists) {
        list.unshift({
          id: "235250d9-d03b-4288-82c8-a0d53e3c7393",
          name: "Lexilis Mejía",
          role: "Recepcionista Elite",
          department: "recepción",
          photo_url: "/LexilisMejia.jpeg",
          total_votes: 8, // Basado en tu panel de admin
          average_rating: 5.0
        })
      }
    }

    const departmentName = departmentMap[area]
    return list.filter(emp => emp.department?.toLowerCase() === departmentName?.toLowerCase())
  }, [employees, area])

  if (isLoading) return (
    <div className="flex min-h-[300px] items-center justify-center">
      <Spinner className="h-10 w-10 text-[#2878a8]" />
    </div>
  )

  return (
    <>
      {/* Sección de Puntuación General del Hotel */}
      <div className="max-w-5xl mx-auto mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-[2.5rem] p-8 border-2 border-[#2878a8]/10 shadow-lg flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Promedio General Hotel</p>
            <h4 className="text-4xl font-black text-[#2878a8]">5.0 <span className="text-xl text-[#f5ac0a]">★</span></h4>
          </div>
          <div className="h-16 w-16 bg-blue-50 rounded-2xl flex items-center justify-center">
            <Star className="h-8 w-8 text-[#2878a8] fill-current" />
          </div>
        </div>
        <div className="bg-white rounded-[2.5rem] p-8 border-2 border-[#f5ac0a]/10 shadow-lg flex items-center gap-6">
          <div className="h-16 w-16 bg-orange-50 rounded-2xl flex items-center justify-center shrink-0">
            <MessageSquare className="h-8 w-8 text-[#f5ac0a]" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Último Feedback</p>
            <p className="text-sm text-slate-600 italic line-clamp-2">"El mejor hotel, sin duda volveré."</p>
          </div>
        </div>
      </div>

      <div className="rounded-[3rem] border-4 border-[#2878a8]/10 bg-white p-8 shadow-2xl">
        <h3 className="text-center text-3xl font-black text-[#2878a8] uppercase italic">Equipo de {area}</h3>
        <div className="mx-auto mt-2 h-1.5 w-24 rounded-full bg-[#f5ac0a]" />
        
        <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filteredEmployees.map((employee, index) => (
            <motion.div 
              key={employee.id} 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: index * 0.1 }}
              className="flex flex-col gap-3"
            >
              <div className="relative group">
                <EmployeeCard
                  employee={{
                    id: employee.id,
                    name: employee.name,
                    role: employee.role,
                    image: employee.photo_url,
                    totalVotes: employee.total_votes,
                    averageRating: employee.average_rating,
                  }}
                  onClick={() => { setSelectedEmployee(employee); setIsDialogOpen(true); }}
                />
                
                {/* Botón para desplegar comentarios */}
                <button 
                  onClick={(e) => toggleComments(e, employee.id)}
                  className={cn(
                    "absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-1 transition-all shadow-md z-10",
                    expandedEmployeeId === employee.id ? "bg-[#f5ac0a] text-white" : "bg-white text-[#2878a8] border border-blue-100 hover:bg-blue-50"
                  )}
                >
                  {expandedEmployeeId === employee.id ? (
                    <>Cerrar <ChevronUp className="h-3 w-3" /></>
                  ) : (
                    <>Comentarios <ChevronDown className="h-3 w-3" /></>
                  )}
                </button>
              </div>

              {/* Panel de Comentarios Desplegable */}
              <AnimatePresence>
                {expandedEmployeeId === employee.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden bg-slate-50/50 rounded-[2rem] border border-slate-100"
                  >
                    <div className="p-5 space-y-3">
                      {employeeFeedbacks[employee.id]?.length > 0 ? (
                        employeeFeedbacks[employee.id].map((fb, i) => (
                          <div key={i} className="bg-white p-3 rounded-2xl shadow-sm border border-slate-50">
                            <div className="flex justify-between items-center mb-1">
                              <div className="flex gap-0.5">
                                {[...Array(5)].map((_, starI) => (
                                  <Star 
                                    key={starI} 
                                    className={cn("h-2.5 w-2.5", starI < fb.rating ? "text-[#f5ac0a] fill-current" : "text-slate-200")} 
                                  />
                                ))}
                              </div>
                              <span className="text-[8px] text-slate-400 font-bold uppercase">
                                {new Date(fb.created_at).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-600 leading-tight">"{fb.comentario}"</p>
                          </div>
                        ))
                      ) : (
                        <div className="py-4 text-center">
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Cargando comentarios...</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>

      <RatingDialog
        employee={selectedEmployee ? {
          id: selectedEmployee.id,
          name: selectedEmployee.name,
          role: selectedEmployee.role,
          image: selectedEmployee.photo_url,
        } : null}
        area={area}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSuccess={() => mutate()}
      />
    </>
  )
}
