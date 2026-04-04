"use client"

import * as React from "react"
import useSWR from "swr"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Trophy, Users, Star, TrendingUp, LogOut, MessageSquare, ChevronDown 
} from "lucide-react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// IMPORTANTE: Asegúrate de que estos componentes existan en tu carpeta ui
import { Button } from "@/components/ui/button" 

const fetcher = (url: string) => fetch(url).then((res) => res.json())

// Componente de Spinner interno para evitar errores de importación externa
const LoadingSpinner = () => (
  <div className="flex h-5 w-5 animate-spin rounded-full border-2 border-[#2878a8] border-t-transparent" />
)

export default function AdminDashboard() {
  const router = useRouter()
  const [authorized, setAuthorized] = React.useState(false)
  const [expandedId, setExpandedId] = React.useState<string | null>(null)
  const [feedbacks, setFeedbacks] = React.useState<Record<string, any[]>>({})
  const [loadingFeedback, setLoadingFeedback] = React.useState<string | null>(null)

  React.useEffect(() => {
    const auth = document.cookie.split('; ').find(row => row.startsWith('admin_auth='))?.split('=')[1]
    if (auth !== "true") {
      router.push("/admin/login")
    } else {
      setAuthorized(true)
    }
  }, [router])

  const { data: employees, isLoading } = useSWR(authorized ? "/api/employees" : null, fetcher)

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
        setFeedbacks(prev => ({ ...prev, [id]: Array.isArray(data) ? data : [] }))
      } catch (e) {
        console.error("Error cargando comentarios:", e)
      } finally {
        setLoadingFeedback(null)
      }
    }
  }

  const sortedEmployees = React.useMemo(() => {
    if (!employees || !Array.isArray(employees)) return []
    return [...employees].sort((a, b) => b.average_rating - a.average_rating)
  }, [employees])

  const stats = React.useMemo(() => {
    if (!employees || !Array.isArray(employees)) return { totalVotes: 0, avgHotel: 0, topCount: 0 }
    const total = employees.reduce((acc, curr) => acc + (curr.total_votes || 0), 0)
    const avg = employees.reduce((acc, curr) => acc + (curr.average_rating || 0), 0) / (employees.length || 1)
    const top = employees.filter(e => e.average_rating >= 4.5).length
    return { totalVotes: total, avgHotel: avg, topCount: top }
  }, [employees])

  const handleLogout = () => {
    document.cookie = "admin_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;"
    router.push("/admin/login")
  }

  if (!authorized || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-12">
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 p-2">
               <Trophy className="text-[#f5ac0a] h-5 w-5" />
            </div>
            <div>
              <h1 className="font-serif text-xl italic tracking-tight text-[#2878a8]">
                RANKING DE SERVICIO
              </h1>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#f5ac0a]">
                Hotel Rodadero Relax
              </p>
            </div>
          </div>
          <Button 
            variant="ghost"
            onClick={handleLogout}
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-red-500 hover:bg-red-50"
          >
            <LogOut className="h-4 w-4" /> Cerrar Sesión
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-400">Votos Totales</CardTitle>
              <Users className="h-4 w-4 text-[#2878a8]" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-[#2878a8]">{stats.totalVotes}</div>
              <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">Acumulados</p>
            </CardContent>
          </Card>
          
          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-400">Promedio Hotel</CardTitle>
              <Star className="h-4 w-4 text-[#f5ac0a]" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-[#2878a8]">{stats.avgHotel.toFixed(1)}</div>
              <p className="text-[10px] font-bold text-[#f5ac0a] uppercase mt-1">Estrellas Globales</p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-400">Élite</CardTitle>
              <TrendingUp className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-[#2878a8]">{stats.topCount}</div>
              <p className="text-[10px] font-bold text-emerald-500 uppercase mt-1">Calificación +4.5</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <Card className="overflow-hidden border-none shadow-2xl bg-white sticky top-28">
              <div className="bg-[#2878a8] p-4 text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/80 italic">Líder Actual</p>
              </div>
              <div className="relative aspect-[3/4] w-full">
                {sortedEmployees[0] && (
                  <img 
                    src={sortedEmployees[0].photo_url || "/placeholder-user.jpg"} 
                    className="h-full w-full object-cover" 
                    alt="Líder"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#2878a8] via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-center">
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#f5ac0a]">Primer Lugar</p>
                  <h2 className="text-2xl font-black text-white uppercase italic tracking-tight">{sortedEmployees[0]?.name}</h2>
                </div>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="border-b border-slate-50">
                <CardTitle className="font-serif text-2xl italic text-[#2878a8]">Clasificación Detallada</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {sortedEmployees.map((emp, i) => (
                    <div key={emp.id} className="flex flex-col">
                      <motion.div 
                        onClick={() => toggleComments(emp.id)}
                        className={cn(
                          "flex items-center gap-4 rounded-2xl border p-4 transition-all hover:shadow-md cursor-pointer",
                          expandedId === emp.id ? "border-[#2878a8] bg-slate-50/50 shadow-inner" : "border-slate-100 bg-white"
                        )}
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5ac0a] font-black text-white shadow-sm text-sm">
                          {i + 1}
                        </div>
                        <img 
                          src={emp.photo_url || "/placeholder-user.jpg"} 
                          className="h-12 w-12 rounded-full object-cover border-2 border-white shadow-sm" 
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-black text-[#2878a8] uppercase text-sm truncate">{emp.name}</h3>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{emp.role}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="flex items-center gap-1 justify-end text-[#f5ac0a]">
                            <Star className="h-4 w-4 fill-current" />
                            <span className="text-lg font-black">{Number(emp.average_rating || 0).toFixed(1)}</span>
                          </div>
                          <p className="text-[9px] font-black text-slate-300 uppercase leading-none">{emp.total_votes || 0} votos</p>
                        </div>
                        <ChevronDown className={cn("h-4 w-4 text-slate-300 transition-transform", expandedId === emp.id && "rotate-180")} />
                      </motion.div>

                      <AnimatePresence>
                        {expandedId === emp.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="mt-2 ml-14 space-y-3 p-5 bg-white rounded-2xl border-2 border-slate-50 shadow-inner">
                              <h4 className="text-[10px] font-black text-[#2878a8] uppercase tracking-widest flex items-center gap-2 mb-4">
                                <MessageSquare size={12} className="text-[#f5ac0a]" /> Comentarios de Clientes
                              </h4>
                              
                              {loadingFeedback === emp.id ? (
                                <div className="flex justify-center p-6"><LoadingSpinner /></div>
                              ) : feedbacks[emp.id] && feedbacks[emp.id].length > 0 ? (
                                feedbacks[emp.id].map((f, idx) => (
                                  <div key={idx} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm relative group">
                                    <p className="text-[13px] text-slate-600 italic leading-relaxed pr-8 font-medium">
                                      "{f.comment}"
                                    </p>
                                    <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-50">
                                      <span className="text-[9px] font-bold text-slate-300">
                                        {new Date(f.created_at).toLocaleDateString('es-ES')}
                                      </span>
                                      <div className="flex items-center gap-1 bg-[#f5ac0a]/5 px-2 py-1 rounded-md">
                                        <Star className="h-2 w-2 text-[#f5ac0a] fill-current" />
                                        <span className="text-[10px] font-black text-[#f5ac0a] uppercase">Puntaje: {f.overall_rating}</span>
                                      </div>
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <div className="text-center p-8 border-2 border-dashed border-slate-100 rounded-xl">
                                  <p className="text-[11px] font-bold text-slate-300 uppercase tracking-widest">No hay comentarios registrados</p>
                                </div>
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
