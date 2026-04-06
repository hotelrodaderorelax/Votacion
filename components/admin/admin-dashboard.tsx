"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
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

// Tipos para asegurar el correcto funcionamiento de las funciones
interface HotelFeedback {
  id: string;
  comentarios_sugerencias: string;
  habitacion_limpieza: number;
  created_at: string;
}

export default function AdminDashboard() {
  const router = useRouter()
  const [view, setView] = React.useState<"employees" | "hotel">("employees")
  const [expandedId, setExpandedId] = React.useState<string | null>(null)
  const [employees, setEmployees] = React.useState<any[]>([])
  const [feedbacks, setFeedbacks] = React.useState<Record<string, any[]>>({})
  const [loading, setLoading] = React.useState(true)
  const [loadingFeedback, setLoadingFeedback] = React.useState<string | null>(null)

  // Estado para datos del Hotel (Escala 1-3)
  const [hotelData, setHotelData] = React.useState<{stats: any, data: HotelFeedback[]}>({
    stats: { limpieza: "0.0", infraestructura: "0.0", atencion: "0.0" },
    data: []
  })

  // Carga inicial de datos
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [empRes, hotelRes] = await Promise.all([
          fetch("/api/employees"),
          fetch("/api/hotel-feedback")
        ])
        
        const empData = await empRes.json()
        const hData = await hotelRes.json()
        
        setEmployees(empData)
        setHotelData(hData)
      } catch (err) {
        console.error("Error cargando datos:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Definición de funciones faltantes en tu error de consola
  const toggleComments = async (id: string) => {
    if (expandedId === id) return setExpandedId(null)
    setExpandedId(id)
    
    if (!feedbacks[id]) {
      setLoadingFeedback(id)
      try {
        const res = await fetch(`/api/employee-feedback?id=${id}`)
        const data = await res.json()
        setFeedbacks(prev => ({ ...prev, [id]: data }))
      } catch (error) {
        console.error("Error feedback empleado:", error)
      } finally {
        setLoadingFeedback(null)
      }
    }
  }

  const handleLogout = () => {
    document.cookie = "admin_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;"
    router.push("/admin/login")
  }

  const sortedEmployees = React.useMemo(() => {
    return [...employees].sort((a, b) => (b.average_rating || 0) - (a.average_rating || 0))
  }, [employees])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#2878a8] border-t-transparent" />
          <p className="font-black text-[#2878a8] uppercase italic">Sincronizando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-12">
      <header className="border-b bg-white shadow-sm sticky top-0 z-10 px-4 py-6">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="outline" size="icon" className="rounded-full border-[#2878a8] text-[#2878a8]">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-black text-[#2878a8] uppercase italic leading-none">
                {view === "employees" ? "Ranking Staff" : "Métricas Hotel"}
              </h1>
              <p className="text-[10px] font-bold text-[#f5ac0a] uppercase tracking-widest mt-1">Rodadero Relax</p>
            </div>
          </div>

          <nav className="flex bg-slate-100 p-1 rounded-2xl border">
            <button 
              onClick={() => setView("employees")} 
              className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${view === "employees" ? "bg-white text-[#2878a8] shadow-sm" : "text-slate-400"}`}
            >
              Empleados
            </button>
            <button 
              onClick={() => setView("hotel")} 
              className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${view === "hotel" ? "bg-white text-[#2878a8] shadow-sm" : "text-slate-400"}`}
            >
              El Hotel
            </button>
          </nav>

          <Button variant="ghost" onClick={handleLogout} className="text-slate-400 hover:text-red-500 font-bold text-[10px] uppercase">
            <LogOut className="h-4 w-4 mr-2" /> Salir
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">
        {view === "employees" ? (
          <div className="space-y-8">
            <div className="grid gap-6 md:grid-cols-3">
              <StatCard title="Votos Totales" value={employees.reduce((s, e) => s + (e.total_votes || 0), 0)} sub="votos mes" icon={<Users className="text-[#2878a8]" />} />
              <StatCard title="Promedio Staff" value={(employees.reduce((s, e) => s + (e.average_rating || 0), 0) / (employees.length || 1)).toFixed(1)} sub="estrellas (max 3)" icon={<Star className="text-[#f5ac0a] fill-[#f5ac0a]" />} />
              <StatCard title="Elite" value={employees.filter(e => e.average_rating >= 2.8).length} sub="top performers" icon={<TrendingUp className="text-green-500" />} />
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
              <div className="lg:col-span-1">
                <Card className="overflow-hidden border-4 border-[#2878a8]/10 shadow-2xl rounded-[2.5rem]">
                  <CardHeader className="bg-[#2878a8] text-white text-center py-4">
                    <CardTitle className="italic text-lg uppercase font-black">Ganador Provisional</CardTitle>
                  </CardHeader>
                  <div className="relative aspect-[4/5] bg-slate-200">
                    {sortedEmployees[0] && (
                      <>
                        <img src={sortedEmployees[0].photo_url} className="h-full w-full object-cover" alt="top" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#2878a8] via-transparent to-transparent" />
                        <div className="absolute bottom-6 left-6 text-white">
                          <p className="text-4xl font-black leading-none uppercase italic">{sortedEmployees[0].name}</p>
                        </div>
                      </>
                    )}
                  </div>
                </Card>
              </div>

              <div className="lg:col-span-2 space-y-4">
                {sortedEmployees.map((emp, i) => (
                  <div key={emp.id} className="flex flex-col">
                    <div 
                      onClick={() => toggleComments(emp.id)} 
                      className={`flex items-center gap-4 rounded-[2rem] border bg-white p-4 cursor-pointer transition-all hover:shadow-md ${expandedId === emp.id ? "border-[#2878a8]" : "border-transparent"}`}
                    >
                      <div className={`h-10 w-10 flex items-center justify-center rounded-full font-black text-white ${i === 0 ? "bg-[#f5ac0a]" : "bg-[#2878a8]/30"}`}>{i + 1}</div>
                      <img src={emp.photo_url} className="h-14 w-14 rounded-full object-cover border-2 border-slate-100" alt="p" />
                      <div className="flex-1">
                        <p className="font-black text-[#2878a8] uppercase text-lg leading-none">{emp.name}</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">{emp.role}</p>
                      </div>
                      <div className="text-right px-4 py-2 bg-slate-50 rounded-2xl border">
                        <div className="flex items-center gap-1 text-[#f5ac0a] font-black text-xl"><Star size={16} fill="currentColor" /> {Number(emp.average_rating || 0).toFixed(1)}</div>
                        <p className="text-[8px] font-bold text-slate-400 uppercase">{emp.total_votes} VOTOS</p>
                      </div>
                    </div>
                    {expandedId === emp.id && (
                      <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} className="ml-14 mt-2 p-4 bg-white rounded-2xl border border-slate-100 shadow-inner space-y-2">
                        {loadingFeedback === emp.id ? (
                           <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#2878a8] border-t-transparent" />
                        ) : feedbacks[emp.id]?.length ? feedbacks[emp.id].map((f:any) => (
                          <div key={f.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <p className="text-xs text-slate-600 italic">"{f.comentario}"</p>
                          </div>
                        )) : <p className="text-[10px] text-slate-400 italic text-center">No hay comentarios aún.</p>}
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid gap-6 md:grid-cols-3">
              <StatCard title="Limpieza" value={hotelData.stats.limpieza} sub="escala 1 a 3" icon={<Sparkles className="text-cyan-500" />} />
              <StatCard title="Infraestructura" value={hotelData.stats.infraestructura} sub="escala 1 a 3" icon={<Building2 className="text-[#2878a8]" />} />
              <StatCard title="Atención" value={hotelData.stats.atencion} sub="escala 1 a 3" icon={<Clock className="text-[#f5ac0a]" />} />
            </div>
            <Card className="border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
              <CardHeader className="border-b p-6 flex flex-row items-center justify-between">
                <CardTitle className="text-[#2878a8] font-black italic uppercase text-2xl">Muro de Experiencias</CardTitle>
                <MessageSquare className="text-[#f5ac0a]" />
              </CardHeader>
              <CardContent className="p-6 grid md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto">
                {hotelData.data?.filter(i => i.comentarios_sugerencias).map((item) => (
                  <div key={item.id} className="p-5 rounded-3xl bg-slate-50 border border-slate-100 hover:border-[#2878a8]/20 transition-all">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex gap-1 text-[#f5ac0a]">
                        {[1, 2, 3].map((s) => (
                          <Star key={s} size={12} fill={s <= item.habitacion_limpieza ? "#f5ac0a" : "none"} stroke="currentColor" />
                        ))}
                      </div>
                      <span className="text-[9px] font-bold text-slate-400">{new Date(item.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm text-slate-600 font-medium italic">"{item.comentarios_sugerencias}"</p>
                  </div>
                ))}
                {hotelData.data.length === 0 && (
                  <p className="col-span-full text-center text-slate-400 py-10 font-bold uppercase text-xs italic">No hay comentarios generales registrados</p>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}

function StatCard({ title, value, sub, icon }: any) {
  return (
    <Card className="border-none shadow-lg rounded-[2rem] transition-all hover:scale-[1.02] bg-white overflow-hidden">
      <div className="h-1.5 w-full bg-[#2878a8]" />
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-400">{title}</CardTitle>
        <div className="p-2 bg-slate-50 rounded-xl">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-5xl font-black text-[#2878a8] tracking-tighter">{value}</div>
        <p className="text-[9px] font-black uppercase text-[#f5ac0a] mt-2 tracking-widest">{sub}</p>
      </CardContent>
    </Card>
  )
}
