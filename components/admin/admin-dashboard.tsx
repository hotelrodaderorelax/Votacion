"use client"

import * as React from "react"
import useSWR from "swr"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Trophy, 
  Users, 
  Star, 
  ArrowLeft,
  LogOut,
  MessageSquare,
  ChevronDown,
  Building2,
  LayoutDashboard
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
  photo_url: string
  total_votes: number
  average_rating: number
}

type Feedback = {
  id: number
  comentario: string
  comment?: string // Por si la API manda el nombre original
  created_at: string
  overall_rating?: number
}

export default function AdminDashboard() {
  const router = useRouter()
  const [authorized, setAuthorized] = React.useState(false)
  const [view, setView] = React.useState<'ranking' | 'hotel'>('ranking')
  const [expandedId, setExpandedId] = React.useState<string | null>(null)
  const [feedbacks, setFeedbacks] = React.useState<Record<string, Feedback[]>>({})
  const [loadingFeedback, setLoadingFeedback] = React.useState<string | null>(null)

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

  // 1. Datos de Empleados
  const { data: employees, isLoading: loadingEmps } = useSWR<Employee[]>(
    authorized ? "/api/employees" : null,
    fetcher,
    { refreshInterval: 5000 }
  )

  // 2. Todos los comentarios del Hotel (Para la nueva vista)
  const { data: allHotelFeedback, isLoading: loadingHotel } = useSWR<Feedback[]>(
    authorized && view === 'hotel' ? "/api/employee-feedback?all=true" : null,
    fetcher
  )

  const toggleComments = async (id: string) => {
    if (expandedId === id) { setExpandedId(null); return; }
    setExpandedId(id)
    if (!feedbacks[id]) {
      setLoadingFeedback(id)
      try {
        const res = await fetch(`/api/employee-feedback?id=${id}`)
        const data = await res.json()
        setFeedbacks(prev => ({ ...prev, [id]: data }))
      } catch (error) { console.error(error) } finally { setLoadingFeedback(null) }
    }
  }

  const sortedEmployees = React.useMemo(() => {
    if (!employees) return []
    return [...employees].sort((a, b) => b.average_rating - a.average_rating || b.total_votes - a.total_votes)
  }, [employees])

  const hotelStats = React.useMemo(() => {
    if (!employees) return { avg: 0, total: 0 }
    const total = employees.reduce((sum, e) => sum + e.total_votes, 0)
    const avg = employees.length > 0 ? employees.reduce((sum, e) => sum + e.average_rating, 0) / employees.length : 0
    return { avg, total }
  }, [employees])

  if (!authorized) return null

  return (
    <div className="min-h-screen bg-slate-50/50 pb-12 font-sans">
      <header className="border-b bg-white shadow-sm sticky top-0 z-20 p-4">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/"><Button variant="outline" size="icon" className="rounded-full border-[#2878a8] text-[#2878a8]"><ArrowLeft size={20}/></Button></Link>
            <div>
              <h1 className="text-xl font-black text-[#2878a8] italic uppercase leading-none">Panel Administrativo</h1>
              <p className="text-[10px] font-bold text-[#f5ac0a] uppercase mt-1">Hotel Rodadero Relax</p>
            </div>
          </div>
          
          {/* Selector de Vista */}
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button 
              onClick={() => setView('ranking')}
              className={cn("px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all flex items-center gap-2", view === 'ranking' ? "bg-white text-[#2878a8] shadow-sm" : "text-slate-400")}
            >
              <Trophy size={14}/> Ranking
            </button>
            <button 
              onClick={() => setView('hotel')}
              className={cn("px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all flex items-center gap-2", view === 'hotel' ? "bg-white text-[#2878a8] shadow-sm" : "text-slate-400")}
            >
              <Building2 size={14}/> Hotel
            </button>
          </div>

          <Button variant="ghost" onClick={() => { document.cookie = "admin_auth=; path=/; expires=Thu, 01 Jan 1970"; router.push("/admin/login") }} className="text-[10px] font-bold text-slate-400 hover:text-red-500 uppercase">
            <LogOut size={14} className="mr-2"/> Salir
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">
        {view === 'ranking' ? (
          // VISTA DE RANKING (TU CÓDIGO ACTUAL OPTIMIZADO)
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <StatCard title="Promedio Hotel" value={hotelStats.avg.toFixed(1)} sub="Estrellas Globales" icon={<Star className="text-[#f5ac0a] fill-[#f5ac0a]"/>} />
              <div className="mt-6">
                <Card className="overflow-hidden border-4 border-[#2878a8]/10 shadow-xl">
                  <div className="bg-[#2878a8] p-2 text-white text-center text-[10px] font-black uppercase">Líder del Mes</div>
                  {sortedEmployees[0] && (
                    <div className="relative aspect-square">
                      <img src={sortedEmployees[0].name.includes("Lexilis") ? "/Lexilis Mejia.jpeg" : sortedEmployees[0].photo_url} className="h-full w-full object-cover" alt="Lider"/>
                      <div className="absolute inset-0 bg-gradient-to-t from-[#2878a8] to-transparent opacity-60" />
                      <p className="absolute bottom-4 left-4 text-white font-black text-xl uppercase italic">{sortedEmployees[0].name}</p>
                    </div>
                  )}
                </Card>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-3">
              {loadingEmps ? <div className="flex justify-center py-10"><Spinner/></div> : sortedEmployees.map((emp, i) => (
                <div key={emp.id} className="group">
                  <div onClick={() => toggleComments(emp.id)} className={cn("flex items-center gap-4 bg-white p-4 rounded-2xl border transition-all cursor-pointer hover:border-[#2878a8]/50", expandedId === emp.id ? "border-[#2878a8] shadow-md" : "border-slate-100 shadow-sm")}>
                    <div className={cn("h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-black", i === 0 ? "bg-[#f5ac0a]" : "bg-[#2878a8]/30")}>{i + 1}</div>
                    <img src={emp.name.includes("Lexilis") ? "/Lexilis Mejia.jpeg" : emp.photo_url} className="h-10 w-10 rounded-full object-cover" alt={emp.name}/>
                    <div className="flex-1"><p className="font-black text-[#2878a8] uppercase text-sm">{emp.name}</p></div>
                    <div className="text-right">
                      <p className="text-sm font-black text-[#f5ac0a]">{emp.average_rating.toFixed(1)} ★</p>
                      <p className="text-[8px] font-bold text-slate-300 uppercase">{emp.total_votes} votos</p>
                    </div>
                    <ChevronDown size={14} className={cn("text-slate-300 transition-transform", expandedId === emp.id && "rotate-180")}/>
                  </div>
                  <AnimatePresence>
                    {expandedId === emp.id && (
                      <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                        <div className="mt-2 ml-12 p-4 bg-white rounded-xl border border-slate-100 shadow-inner space-y-2">
                          <p className="text-[9px] font-black text-[#2878a8] uppercase flex items-center gap-2"><MessageSquare size={10}/> Últimos Comentarios</p>
                          {loadingFeedback === emp.id ? <Spinner/> : feedbacks[emp.id]?.slice(0, 5).map((f, idx) => (
                            <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs italic text-slate-600">
                              "{f.comentario || f.comment}"
                              <p className="text-[8px] font-bold text-slate-400 mt-2 uppercase">{new Date(f.created_at).toLocaleDateString()}</p>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        ) : (
          // NUEVA VISTA: FEEDBACK DEL HOTEL
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-[#2878a8] p-8 rounded-3xl text-white shadow-2xl relative overflow-hidden">
              <Building2 className="absolute -right-4 -bottom-4 h-32 w-32 text-white/10 rotate-12" />
              <p className="text-xs font-bold uppercase tracking-[0.2em] opacity-80">Reputación General</p>
              <div className="flex items-end gap-2 mt-2">
                <h2 className="text-6xl font-black italic">{hotelStats.avg.toFixed(1)}</h2>
                <div className="mb-2">
                  <div className="flex text-[#f5ac0a] mb-1"><Star fill="currentColor" size={16}/><Star fill="currentColor" size={16}/><Star fill="currentColor" size={16}/><Star fill="currentColor" size={16}/><Star fill="currentColor" size={16}/></div>
                  <p className="text-[10px] font-bold uppercase">Basado en {hotelStats.total} experiencias</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-[#2878a8] font-black uppercase text-sm flex items-center gap-2 px-2">
                <MessageSquare size={16}/> Muro de Comentarios Recientes
              </h3>
              {loadingHotel ? <div className="flex justify-center py-10"><Spinner/></div> : allHotelFeedback?.map((f, i) => (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative group hover:border-[#f5ac0a]/30 transition-all">
                  <div className="absolute top-6 right-6 text-[#f5ac0a] font-black text-sm flex items-center gap-1">
                    {f.overall_rating} <Star size={12} fill="currentColor"/>
                  </div>
                  <p className="text-sm text-slate-700 italic leading-relaxed pr-10">"{f.comentario || f.comment}"</p>
                  <div className="mt-4 flex items-center justify-between border-t border-slate-50 pt-4">
                    <p className="text-[9px] font-black text-[#2878a8] uppercase tracking-widest">{new Date(f.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                    <div className="h-1.5 w-1.5 rounded-full bg-[#f5ac0a]" />
                  </div>
                </motion.div>
              ))}
              {allHotelFeedback?.length === 0 && <p className="text-center text-slate-400 py-10 italic">Aún no hay comentarios sobre el hotel.</p>}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

function StatCard({ title, value, sub, icon }: { title: string, value: string, sub: string, icon: any }) {
  return (
    <Card className="p-6 border-b-4 border-[#2878a8] shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[10px] font-black uppercase text-slate-400 tracking-tighter">{title}</p>
        <div className="p-2 bg-slate-50 rounded-lg">{icon}</div>
      </div>
      <p className="text-4xl font-black text-[#2878a8] leading-none">{value}</p>
      <p className="text-[9px] font-bold text-[#f5ac0a] uppercase mt-2">{sub}</p>
    </Card>
  )
}
