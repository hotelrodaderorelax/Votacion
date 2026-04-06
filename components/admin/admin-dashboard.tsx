"use client"

import * as React from "react"
import useSWR from "swr"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Trophy, 
  Users, 
  Star, 
  TrendingUp,
  ArrowLeft,
  LogOut,
  MessageSquare,
  Building2,
  Sparkles,
  Clock
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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

type Feedback = {
  id: number
  comentario: string
  created_at: string
}

// NUEVO: Tipo para feedback general del hotel
type HotelFeedback = {
  id: number
  categoria: string // 'limpieza', 'servicio', 'infraestructura'
  puntuacion: number
  comentario: string
  created_at: string
}

export function AdminDashboard() {
  const router = useRouter()
  const [authorized, setAuthorized] = React.useState(false)
  
  // ESTADOS DE NAVEGACIÓN Y COMENTARIOS
  const [view, setView] = React.useState<"employees" | "hotel">("employees")
  const [expandedId, setExpandedId] = React.useState<string | null>(null)
  const [feedbacks, setFeedbacks] = React.useState<Record<string, Feedback[]>>({})
  const [loadingFeedback, setLoadingFeedback] = React.useState<string | null>(null)

  // NUEVO: Estado para comentarios del hotel
  const [hotelFeedbacks, setHotelFeedbacks] = React.useState<HotelFeedback[]>([])

  React.useEffect(() => {
    const getCookie = (name: string) => {
      if (typeof document === "undefined") return null;
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
      return null;
    };

    const auth = getCookie("admin_auth");
    if (auth !== "true") {
      router.push("/admin/login")
    } else {
      setAuthorized(true)
    }
  }, [router])

  const { data: employees, isLoading } = useSWR<Employee[]>(
    authorized ? "/api/employees" : null,
    fetcher,
    { refreshInterval: 5000 }
  )

  // NUEVO: Cargar feedback del hotel cuando se cambia de vista
  React.useEffect(() => {
    if (view === "hotel" && hotelFeedbacks.length === 0) {
      fetch("/api/hotel-feedback")
        .then(res => res.json())
        .then(data => setHotelFeedbacks(data))
        .catch(err => console.error("Error hotel feedback:", err))
    }
  }, [view])

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
        const sortedData = Array.isArray(data) 
          ? data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          : []
        setFeedbacks(prev => ({ ...prev, [id]: sortedData }))
      } catch (error) {
        console.error("Error cargando comentarios:", error)
      } finally {
        setLoadingFeedback(null)
      }
    }
  }

  const processedEmployees = React.useMemo(() => {
    if (!employees) return []
    return employees.map(emp => ({
      ...emp,
      photo_url: emp.name.includes("Lexilis") ? "/Lexilis Mejia.jpeg" : emp.photo_url,
      total_votes: Number(emp.total_votes) || 0,
      average_rating: Number(emp.average_rating) || 0
    }))
  }, [employees])

  const sortedEmployees = React.useMemo(() => {
    return [...processedEmployees].sort((a, b) => {
      if (b.average_rating !== a.average_rating) return b.average_rating - a.average_rating
      return b.total_votes - a.total_votes
    })
  }, [processedEmployees])

  const stats = React.useMemo(() => {
    const totalVotes = processedEmployees.reduce((sum, e) => sum + e.total_votes, 0)
    const avgRating = processedEmployees.filter(e => e.total_votes > 0).length > 0 
      ? processedEmployees.reduce((sum, e) => sum + e.average_rating, 0) / processedEmployees.filter(e => e.total_votes > 0).length 
      : 0
    const topPerformers = processedEmployees.filter(e => e.average_rating >= 4.5 && e.total_votes > 0).length
    return { totalVotes, avgRating, topPerformers }
  }, [processedEmployees])

  const handleLogout = () => {
    document.cookie = "admin_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    router.push("/admin/login")
  }

  if (!authorized) return null
  if (isLoading) return <div className="flex min-h-screen items-center justify-center bg-slate-50"><Spinner className="h-10 w-10 text-[#2878a8]" /></div>

  return (
    <div className="min-h-screen bg-slate-50/50 pb-12">
      <header className="border-b bg-white shadow-sm sticky top-0 z-10">
        <div className="mx-auto max-w-7xl px-4 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/"><Button variant="outline" size="icon" className="rounded-full border-[#2878a8] text-[#2878a8]"><ArrowLeft className="h-5 w-5" /></Button></Link>
            <div>
              <h1 className="font-serif text-3xl font-black text-[#2878a8] italic uppercase leading-none">
                {view === "employees" ? "Ranking Empleados" : "Métricas Hotel"}
              </h1>
              <p className="text-sm font-bold text-[#f5ac0a] uppercase tracking-widest mt-1">Hotel Rodadero Relax</p>
            </div>
          </div>

          {/* NUEVO: Selector de Vista */}
          <nav className="hidden md:flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
            <button 
              onClick={() => setView("employees")}
              className={cn("px-6 py-2 rounded-xl text-xs font-black transition-all", view === "employees" ? "bg-white text-[#2878a8] shadow-sm" : "text-slate-400 hover:text-[#2878a8]")}
            >
              EMPLEADOS
            </button>
            <button 
              onClick={() => setView("hotel")}
              className={cn("px-6 py-2 rounded-xl text-xs font-black transition-all", view === "hotel" ? "bg-white text-[#2878a8] shadow-sm" : "text-slate-400 hover:text-[#2878a8]")}
            >
              EL HOTEL
            </button>
          </nav>

          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={handleLogout} className="text-slate-400 hover:text-red-500 gap-2 font-bold text-xs uppercase tracking-tighter">
              <LogOut className="h-4 w-4" /> Cerrar Sesión
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">
        <AnimatePresence mode="wait">
          {view === "employees" ? (
            <motion.div key="emp-view" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              {/* TU GRID DE STATS ACTUAL */}
              <div className="grid gap-6 md:grid-cols-3">
                <StatCard title="Votos Totales" value={stats.totalVotes} sub="votos este mes" icon={<Users className="text-[#2878a8]" />} />
                <StatCard title="Promedio Hotel" value={stats.avgRating.toFixed(1)} sub="estrellas" icon={<Star className="text-[#f5ac0a] fill-[#f5ac0a]" />} />
                <StatCard title="Elite" value={stats.topPerformers} sub="empleados top" icon={<TrendingUp className="text-green-500" />} />
              </div>

              {/* TU SECCIÓN DE CLASIFICACIÓN ACTUAL */}
              <div className="mt-12 grid gap-8 lg:grid-cols-3">
                <div className="lg:col-span-1">
                  {/* ... Código del Ganador Provisional (mismo que ya tienes) ... */}
                  <Card className="overflow-hidden border-4 border-[#2878a8]/10 shadow-2xl">
                    <CardHeader className="bg-[#2878a8] text-white"><CardTitle className="font-serif italic tracking-tight text-xl text-center">Ganador Provisional</CardTitle></CardHeader>
                    <CardContent className="p-0">
                      {sortedEmployees[0] && (
                        <div className="relative aspect-[4/5]">
                          <img src={sortedEmployees[0].photo_url} className="h-full w-full object-cover" alt={sortedEmployees[0].name} />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#2878a8] via-transparent to-transparent" />
                          <div className="absolute bottom-6 left-6 text-white">
                            <p className="text-xs font-bold uppercase tracking-widest text-[#f5ac0a] mb-1">Primer Lugar</p>
                            <p className="text-3xl font-black leading-none">{sortedEmployees[0].name}</p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                <div className="lg:col-span-2">
                  <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
                    <CardHeader className="border-b border-slate-100"><CardTitle className="text-[#2878a8] font-serif text-2xl italic uppercase tracking-tighter">Ranking Detallado</CardTitle></CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {sortedEmployees.map((emp, i) => (
                          <div key={emp.id} className="flex flex-col">
                            <motion.div 
                              onClick={() => toggleComments(emp.id)}
                              className={cn(
                                "flex items-center gap-4 rounded-2xl border bg-white p-4 transition-all hover:shadow-md cursor-pointer",
                                expandedId === emp.id ? "border-[#2878a8] shadow-md" : "border-transparent hover:border-[#2878a8]/30"
                              )}
                            >
                              <div className={cn(
                                "flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-black text-white shadow-lg",
                                i === 0 ? "bg-[#f5ac0a]" : "bg-[#2878a8]/40"
                              )}>{i + 1}</div>
                              <img src={emp.photo_url} className="h-14 w-14 rounded-full object-cover border-2 border-[#2878a8]/10" alt={emp.name} />
                              <div className="flex-1 min-w-0">
                                <p className="font-black text-[#2878a8] truncate text-lg uppercase leading-none">{emp.name}</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-1">{emp.role}</p>
                              </div>
                              <div className="text-right bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                                <div className="flex items-center justify-end gap-1 text-[#f5ac0a]">
                                  <Star className="h-4 w-4 fill-current" />
                                  <span className="font-black text-xl">{emp.average_rating.toFixed(1)}</span>
                                </div>
                                <p className="text-[9px] font-bold text-slate-400 uppercase">{emp.total_votes} votos</p>
                              </div>
                            </motion.div>

                            <AnimatePresence>
                              {expandedId === emp.id && (
                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                  <div className="mt-2 ml-14 p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-3">
                                    <h4 className="text-[10px] font-black text-[#2878a8] uppercase tracking-widest flex items-center gap-2">
                                      <MessageSquare size={12} /> Feedback Directo
                                    </h4>
                                    {loadingFeedback === emp.id ? (
                                      <Spinner className="h-4 w-4 text-[#2878a8]" />
                                    ) : feedbacks[emp.id]?.length > 0 ? (
                                      feedbacks[emp.id].map((f) => (
                                        <div key={f.id} className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm transition-all hover:border-[#f5ac0a]/30">
                                          <p className="text-xs text-slate-600 italic leading-relaxed">"{f.comentario}"</p>
                                          <p className="text-[8px] font-bold text-slate-400 uppercase mt-2">
                                            {new Date(f.created_at).toLocaleDateString()}
                                          </p>
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
            </motion.div>
          ) : (
            /* NUEVO: VISTA DEL HOTEL */
            <motion.div key="hotel-view" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div className="grid gap-6 md:grid-cols-3">
                <StatCard title="Limpieza" value="4.8" sub="promedio general" icon={<Sparkles className="text-cyan-500" />} />
                <StatCard title="Infraestructura" value="4.5" sub="estado instalaciones" icon={<Building2 className="text-[#2878a8]" />} />
                <StatCard title="Atención" value="4.9" sub="velocidad respuesta" icon={<Clock className="text-[#f5ac0a]" />} />
              </div>

              <div className="mt-12">
                <Card className="border-none shadow-xl bg-white">
                  <CardHeader className="border-b border-slate-100 flex flex-row items-center justify-between">
                    <CardTitle className="text-[#2878a8] font-serif text-2xl italic uppercase tracking-tighter">Comentarios Generales del Hotel</CardTitle>
                    <Trophy className="text-[#f5ac0a] h-6 w-6" />
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      {hotelFeedbacks.length > 0 ? (
                        hotelFeedbacks.map((f) => (
                          <div key={f.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col gap-2">
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] font-black uppercase tracking-widest text-[#2878a8] bg-white px-3 py-1 rounded-full shadow-sm">
                                {f.categoria}
                              </span>
                              <div className="flex items-center gap-1 text-[#f5ac0a]">
                                <Star size={12} fill="#f5ac0a" />
                                <span className="font-bold text-sm">{f.puntuacion}</span>
                              </div>
                            </div>
                            <p className="text-sm text-slate-600 italic">"{f.comentario}"</p>
                            <p className="text-[8px] font-bold text-slate-400 text-right uppercase mt-2">{new Date(f.created_at).toLocaleDateString()}</p>
                          </div>
                        ))
                      ) : (
                        <div className="col-span-full py-12 text-center text-slate-400 flex flex-col items-center gap-2">
                          <MessageSquare size={40} className="opacity-20" />
                          <p className="font-bold uppercase text-xs tracking-widest">Cargando comentarios del hotel...</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}

function StatCard({ title, value, sub, icon }: { title: string, value: any, sub: string, icon: any }) {
  return (
    <Card className="border-b-4 border-b-[#2878a8] shadow-lg transition-all hover:scale-[1.02]">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-400">{title}</CardTitle>
        <div className="p-2 bg-slate-50 rounded-lg">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-black text-[#2878a8] leading-none tracking-tighter">{value}</div>
        <p className="text-[10px] font-bold uppercase text-[#f5ac0a] mt-2 tracking-tighter">{sub}</p>
      </CardContent>
    </Card>
  )
}
