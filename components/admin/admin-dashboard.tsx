"use client"

import * as React from "react"
import useSWR from "swr"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Trophy, Users, Star, TrendingUp, ArrowLeft, LogOut, MessageSquare 
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function AdminDashboard() {
  const router = useRouter()
  const [authorized, setAuthorized] = React.useState(false)
  const [expandedId, setExpandedId] = React.useState<string | null>(null)
  const [feedbacks, setFeedbacks] = React.useState<Record<string, any[]>>({})
  const [loadingFeedback, setLoadingFeedback] = React.useState<string | null>(null)

  // Protección de ruta
  React.useEffect(() => {
    const auth = document.cookie.split('; ').find(row => row.startsWith('admin_auth='))?.split('=')[1];
    if (auth !== "true") router.push("/admin/login")
    else setAuthorized(true)
  }, [router])

  // Carga de empleados
  const { data: employees, isLoading } = useSWR(authorized ? "/api/employees" : null, fetcher)

  // Función para cargar comentarios al hacer clic
  const toggleComments = async (id: string) => {
    if (expandedId === id) {
      setExpandedId(null)
      return
    }
    setExpandedId(id)
    if (!feedbacks[id]) {
      setLoadingFeedback(id)
      try {
        const res = await fetch(`/api/employee-feedback?id=${id}`)
        const data = await res.json()
        setFeedbacks(prev => ({ ...prev, [id]: data }))
      } catch (e) { console.error(e) }
      finally { setLoadingFeedback(null) }
    }
  }

  const sortedEmployees = React.useMemo(() => {
    if (!employees) return []
    return [...employees].sort((a, b) => b.average_rating - a.average_rating)
  }, [employees])

  if (!authorized || isLoading) return <div className="flex min-h-screen items-center justify-center"><Spinner /></div>

  return (
    <div className="min-h-screen bg-slate-50/50 pb-12">
      {/* ... (Tu Header se mantiene igual) ... */}
      
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          {/* Columna Izquierda: Ganador (Sin cambios visuales) */}
          <div className="lg:col-span-1">
             {/* ... Tu Card del Ganador Provisional ... */}
          </div>

          {/* Columna Derecha: Clasificación Detallada */}
          <div className="lg:col-span-2">
            <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="border-b border-slate-100">
                <CardTitle className="text-[#2878a8] font-serif text-2xl italic">Clasificación Detallada</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {sortedEmployees.map((emp, i) => (
                    <div key={emp.id} className="flex flex-col">
                      <motion.div 
                        onClick={() => toggleComments(emp.id)}
                        className={cn(
                          "flex items-center gap-4 rounded-2xl border bg-white p-4 transition-all cursor-pointer hover:shadow-md",
                          expandedId === emp.id ? "border-[#2878a8]" : "border-transparent"
                        )}
                      >
                        {/* Avatar e Info Principal */}
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5ac0a] font-black text-white">{i + 1}</div>
                        <img src={emp.name.includes("Lexilis") ? "/Lexilis Mejia.jpeg" : emp.photo_url} className="h-14 w-14 rounded-full object-cover" />
                        <div className="flex-1 min-w-0">
                          <p className="font-black text-[#2878a8] text-lg uppercase leading-none">{emp.name}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">{emp.role}</p>
                        </div>
                        <div className="text-right bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                          <div className="flex items-center gap-1 text-[#f5ac0a]">
                            <Star className="h-4 w-4 fill-current" />
                            <span className="font-black text-xl">{Number(emp.average_rating).toFixed(1)}</span>
                          </div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">{emp.total_votes} votos</p>
                        </div>
                      </motion.div>

                      {/* Despliegue de Comentarios */}
                      <AnimatePresence>
                        {expandedId === emp.id && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                            <div className="mt-2 ml-14 p-4 bg-slate-50 rounded-xl space-y-3 border border-slate-100">
                              <h4 className="text-[10px] font-black text-[#2878a8] uppercase tracking-widest flex items-center gap-2">
                                <MessageSquare size={12} /> Comentarios Recientes
                              </h4>
                              {loadingFeedback === emp.id ? (
                                <Spinner className="h-4 w-4" />
                              ) : feedbacks[emp.id]?.length > 0 ? (
                                feedbacks[emp.id].map((f, idx) => (
                                  <div key={idx} className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                                    <p className="text-xs text-slate-600 italic">"{f.comment}"</p>
                                    <div className="flex justify-between mt-2 text-[8px] font-bold text-slate-400 uppercase">
                                      <span>{new Date(f.created_at).toLocaleDateString()}</span>
                                      <span className="text-[#f5ac0a]">Calificación: {f.overall_rating}</span>
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <p className="text-xs text-slate-400 italic">No hay comentarios aún.</p>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
