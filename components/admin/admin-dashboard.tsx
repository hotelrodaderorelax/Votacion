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
  Home,
  User as UserIcon
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function AdminDashboard() {
  const router = useRouter()
  const [authorized, setAuthorized] = React.useState(false)
  
  // ESTADOS PRINCIPALES
  const [view, setView] = React.useState<'employees' | 'hotel'>('employees')
  const [expandedId, setExpandedId] = React.useState<string | null>(null)
  const [feedbacks, setFeedbacks] = React.useState<Record<string, any[]>>({})
  const [loadingFeedback, setLoadingFeedback] = React.useState<string | null>(null)

  // 1. VERIFICACIÓN DE AUTENTICACIÓN
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

  // 2. CARGA DE DATOS (SWR)
  const { data: employees, isLoading: isLoadingEmployees } = useSWR(
    authorized ? "/api/employees" : null,
    fetcher,
    { refreshInterval: 5000 }
  )

  const { data: hotelFeedback, isLoading: loadingHotel } = useSWR(
    authorized && view === 'hotel' ? "/api/employee-feedback?all=true" : null,
    fetcher
  )

  // 3. FUNCIÓN PARA COMENTARIOS INDIVIDUALES (RESTAURADA)
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
        
        // Validamos que sea un array antes de guardar
        const safeData = Array.isArray(data) ? data : []
        setFeedbacks(prev => ({ ...prev, [id]: safeData }))
      } catch (error) {
        console.error("Error cargando comentarios:", error)
        setFeedbacks(prev => ({ ...prev, [id]: [] }))
      } finally {
        setLoadingFeedback(null)
      }
    }
  }

  // 4. LÓGICA DE RANKING
  const sortedEmployees = React.useMemo(() => {
    if (!employees || !Array.isArray(employees)) return []
    return [...employees].sort((a, b) => {
      const rateA = Number(a.average_rating) || 0
      const rateB = Number(b.average_rating) || 0
      if (rateB !== rateA) return rateB - rateA
      return (Number(b.total_votes) || 0) - (Number(a.total_votes) || 0)
    })
  }, [employees])

  const stats = React.useMemo(() => {
    if (!employees || !Array.isArray(employees)) return { totalVotes: 0, avgRating: 0 }
    const totalVotes = employees.reduce((sum, e) => sum + (Number(e.total_votes) || 0), 0)
    const validRatings = employees.filter(e => (Number(e.total_votes) || 0) > 0)
    const avgRating = validRatings.length > 0 
      ? validRatings.reduce((sum, e) => sum + (Number(e.average_rating) || 0), 0) / validRatings.length 
      : 0
    return { totalVotes, avgRating }
  }, [employees])

  const handleLogout = () => {
    document.cookie = "admin_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    router.push("/admin/login")
  }

  if (!authorized) return null
  if (isLoadingEmployees) return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <Spinner className="h-10 w-10 text-[#2878a8]" />
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50/50 pb-12">
      {/* HEADER CON SELECTOR DE VISTA */}
      <header className="border-b bg-white shadow-sm sticky top-0 z-20">
        <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="outline" size="icon" className="rounded-full border-[#2878a8] text-[#2878a8]">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="font-serif text-2xl font-black text-[#2878a8] italic uppercase leading-none">Ranking de Servicio</h1>
              <p className="text-[10px] font-bold text-[#f5ac0a] uppercase tracking-widest mt-1">Hotel Rodadero Relax</p>
            </div>
          </div>

          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button 
              onClick={() => setView('hotel')}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-bold uppercase transition-all",
                view === 'hotel' ? "bg-white text-[#2878a8] shadow-sm" : "text-slate-400 hover:text-slate-600"
              )}
            >
              <Home size={14} /> Hotel
            </button>
            <button 
              onClick={() => setView('employees')}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-bold uppercase transition-all",
                view === 'employees' ? "bg-white text-[#2878a8] shadow-sm" : "text-slate-400 hover:text-slate-600"
              )}
            >
              <UserIcon size={14} /> Empleados
            </button>
          </div>

          <Button variant="ghost" onClick={handleLogout} className="text-slate-400 hover:text-red-500 gap-2 font-bold text-[10px] uppercase">
            <LogOut className="h-4 w-4" /> Salir
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">
        {/* CARDS DE ESTADÍSTICAS */}
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <StatCard title="Votos Totales" value={stats.totalVotes} sub="votos registrados" icon={<Users className="text-[#2878a8]" />} />
          <StatCard title="Calificación Hotel" value={stats.avgRating.toFixed(1)} sub="estrellas promedio" icon={<Star className="text-[#f5ac0a] fill-[#f5ac0a]" />} />
        </div>

        <AnimatePresence mode="wait">
          {view === 'employees' ? (
            <motion.div 
              key="employees" 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -10 }}
              className="grid gap-8 lg:grid-cols-3"
            >
              {/* GANADOR PROVISIONAL */}
              <div className="lg:col-span-1">
                <Card className="overflow-hidden border-4 border-[#2878a8]/10 shadow-2xl">
                  <div className="bg-[#2878a8] p-3 text-white font-black italic text-center uppercase text-sm">Ganador Provisional</div>
                  {sortedEmployees[0] && (
                    <div className="relative aspect-[4/5]">
                      <img 
                        src={sortedEmployees[0].name.includes("Lexilis") ? "/Lexilis Mejia.jpeg" : sortedEmployees[0].photo_url} 
                        className="h-full w-full object-cover" 
                        alt="Ganador" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#2878a8] via-transparent to-transparent opacity-90" />
                      <div className="absolute bottom-6 left-6 text-white">
                        <p className="text-[10px] font-bold text-[#f5ac0a] uppercase mb-1">Primer Lugar</p>
                        <p className="text-3xl font-black italic leading-tight">{sortedEmployees[0].name}</p>
                      </div>
                    </div>
                  )}
                </Card>
              </div>

              {/* LISTA DE RANKING */}
              <div className="lg:col-span-2 space-y-4">
                <h3 className="text-[#2878a8] font-serif text-xl italic font-bold px-2">Clasificación Detallada</h3>
                {sortedEmployees.map((emp, i) => (
                  <div key={emp.id} className="group">
                    <div 
                      onClick={() => toggleComments(emp.id)}
                      className={cn(
                        "flex items-center gap-4 bg-white p-4 rounded-2xl border transition-all cursor-pointer",
                        expandedId === emp.id ? "border-[#2878a8] shadow-md" : "border-slate-100 hover:border-[#2878a8]/30 shadow-sm"
                      )}
                    >
                      <div className={cn(
                        "h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-black shadow-inner",
                        i === 0 ? "bg-[#f5ac0a]" : "bg-[#2878a8]/30"
                      )}>{i + 1}</div>
                      <img 
                        src={emp.name.includes("Lexilis") ? "/Lexilis Mejia.jpeg" : emp.photo_url} 
                        className="h-12 w-12 rounded-full object-cover border-2 border-slate-50" 
                        alt={emp.name} 
                      />
                      <div className="flex-1">
                        <p className="font-black text-[#2878a8] uppercase text-sm leading-none">{emp.name}</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">{emp.role}</p>
                      </div>
                      <div className="text-right bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                        <div className="flex items-center justify-end gap-1 text-[#f5ac0a] font-black">
                          <Star size={14} fill="currentColor" /> {Number(emp.average_rating).toFixed(1)}
                        </div>
                        <p className="text-[8px] text-slate-400 font-bold uppercase">{emp.total_votes} votos</p>
                      </div>
                    </div>

                    <AnimatePresence>
                      {expandedId === emp.id && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                          <div className="mt-2 ml-12 p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                            <h4 className="text-[9px] font-black text-[#2878a8] uppercase tracking-widest flex items-center gap-2 mb-2">
                              <MessageSquare size={10} /> Comentarios Recientes
                            </h4>
                            {loadingFeedback === emp.id ? (
                              <Spinner className="h-4 w-4 text-[#2878a8]" />
                            ) : feedbacks[emp.id]?.length > 0 ? (
                              feedbacks[emp.id].slice(0, 5).map((f, idx) => (
                                <div key={idx} className="bg-white p-3 rounded-lg border border-slate-200 text-xs italic text-slate-600 shadow-sm">
                                  "{f.comentario}"
                                  <p className="text-[8px] text-slate-400 mt-2 font-bold uppercase tracking-tighter">
                                    {new Date(f.created_at).toLocaleDateString()}
                                  </p>
                                </div>
                              ))
                            ) : (
                              <p className="text-[10px] text-slate-400 italic">No hay comentarios aún.</p>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : (
            /* VISTA DEL HOTEL */
            <motion.div 
              key="hotel" 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -10 }}
              className="max-w-2xl mx-auto space-y-6"
            >
              <div className="bg-[#2878a8] p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
                <Home className="absolute -right-4 -bottom-4 h-32 w-32 text-white/10 rotate-12" />
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Experiencia del Cliente</p>
                <h2 className="text-4xl font-black italic mt-2">Muro de Comentarios</h2>
              </div>

              <div className="space-y-4">
                <h3 className="text-[#2878a8] font-black uppercase text-xs flex items-center gap-2 px-2">
                  <MessageSquare size={14} /> Últimas opiniones generales
                </h3>
                {loadingHotel ? (
                  <div className="flex justify-center py-12"><Spinner /></div>
                ) : (Array.isArray(hotelFeedback) && hotelFeedback.length > 0) ? (
                  hotelFeedback.map((f, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:border-[#f5ac0a]/50 transition-all group">
                      <p className="text-sm text-slate-700 italic leading-relaxed">"{f.comentario}"</p>
                      <div className="mt-4 flex items-center justify-between border-t border-slate-50 pt-4">
                        <span className="text-[9px] font-black text-[#2878a8] uppercase tracking-tighter">
                          {new Date(f.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}
                        </span>
                        <div className="h-1.5 w-1.5 rounded-full bg-[#f5ac0a] group-hover:scale-150 transition-transform" />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200">
                    <p className="text-slate-400 text-[10px] font-bold uppercase">Aún no se han registrado comentarios generales</p>
                  </div>
                )}
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
    <Card className="border-b-4 border-b-[#2878a8] shadow-lg overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-400">{title}</CardTitle>
        <div className="p-2 bg-slate-50 rounded-lg">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-black text-[#2878a8] leading-none">{value}</div>
        <p className="text-[10px] font-bold uppercase text-[#f5ac0a] mt-2 tracking-tight">{sub}</p>
      </CardContent>
    </Card>
  )
}
