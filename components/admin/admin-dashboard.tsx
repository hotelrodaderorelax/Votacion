"use client"

import * as React from "react"
import useSWR from "swr"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Users, 
  Star, 
  TrendingUp,
  ArrowLeft,
  LogOut,
  MessageSquare,
  Home,
  User as UserIcon,
  Sparkles,
  Building2,
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
  photo_url: string
  total_votes: number
  average_rating: number
}

export function AdminDashboard() {
  const router = useRouter()
  const [authorized, setAuthorized] = React.useState(false)
  const [view, setView] = React.useState<'employees' | 'hotel'>('employees')
  const [expandedId, setExpandedId] = React.useState<string | null>(null)
  const [feedbacks, setFeedbacks] = React.useState<Record<string, any[]>>({})
  const [loadingFeedback, setLoadingFeedback] = React.useState<string | null>(null)

  React.useEffect(() => {
    const auth = document.cookie.includes("admin_auth=true")
    if (!auth) {
      router.push("/admin/login")
    } else {
      setAuthorized(true)
    }
  }, [router])

  // 1. Carga de Empleados
  const { data: employees, isLoading } = useSWR<Employee[]>(
    authorized ? "/api/employees" : null,
    fetcher,
    { refreshInterval: 5000 }
  )

  // 2. Carga de Feedback del Hotel (API Corregida)
  const { data: hotelData, isLoading: loadingHotel } = useSWR(
    authorized && view === 'hotel' ? "/api/hotel-feedback" : null,
    fetcher
  )

  // Función para comentarios de empleados
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
        console.error("Error:", error)
      } finally {
        setLoadingFeedback(null)
      }
    }
  }

  const sortedEmployees = React.useMemo(() => {
    if (!employees) return []
    return [...employees].sort((a, b) => (Number(b.average_rating) || 0) - (Number(a.average_rating) || 0))
  }, [employees])

  const handleLogout = () => {
    document.cookie = "admin_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    router.push("/admin/login")
  }

  if (!authorized) return null
  if (isLoading) return <div className="flex min-h-screen items-center justify-center bg-slate-50"><Spinner className="h-10 w-10 text-[#2878a8]" /></div>

  return (
    <div className="min-h-screen bg-slate-50/50 pb-12">
      <header className="border-b bg-white shadow-sm sticky top-0 z-20 px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/"><Button variant="outline" size="icon" className="rounded-full border-[#2878a8] text-[#2878a8]"><ArrowLeft className="h-5 w-5" /></Button></Link>
          <div>
            <h1 className="font-black text-2xl text-[#2878a8] italic uppercase leading-none">Admin Relax</h1>
            <p className="text-[10px] font-bold text-[#f5ac0a] uppercase tracking-widest mt-1">Hotel Rodadero Relax</p>
          </div>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button onClick={() => setView('hotel')} className={cn("flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all", view === 'hotel' ? "bg-white text-[#2878a8] shadow-sm" : "text-slate-400")}>
            <Home size={14} /> El Hotel
          </button>
          <button onClick={() => setView('employees')} className={cn("flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all", view === 'employees' ? "bg-white text-[#2878a8] shadow-sm" : "text-slate-400")}>
            <UserIcon size={14} /> Empleados
          </button>
        </div>

        <Button variant="ghost" onClick={handleLogout} className="text-slate-400 hover:text-red-500 font-bold text-[10px] uppercase">
          <LogOut className="h-4 w-4 mr-2" /> Salir
        </Button>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">
        <AnimatePresence mode="wait">
          {view === 'employees' ? (
            <motion.div key="emp" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
              {/* Stats Rápidos Empleados */}
              <div className="grid gap-6 md:grid-cols-3">
                <StatCard title="Votos Staff" value={employees?.reduce((s, e) => s + (Number(e.total_votes) || 0), 0)} sub="votos totales" icon={<Users className="text-[#2878a8]" />} />
                <StatCard title="Top Rating" value={sortedEmployees[0]?.average_rating.toFixed(1) || "0.0"} sub="max 3.0 estrellas" icon={<Star className="text-[#f5ac0a] fill-[#f5ac0a]" />} />
                <StatCard title="Elite" value={employees?.filter(e => e.average_rating >= 2.8).length} sub="excelencia" icon={<TrendingUp className="text-green-500" />} />
              </div>

              <div className="grid gap-8 lg:grid-cols-3">
                <div className="lg:col-span-1">
                  <Card className="overflow-hidden border-4 border-[#2878a8]/10 shadow-2xl rounded-[2.5rem]">
                    <div className="bg-[#2878a8] p-3 text-white font-black italic text-center uppercase text-sm">Ganador Provisional</div>
                    {sortedEmployees[0] && (
                      <div className="relative aspect-[4/5]">
                        <img src={sortedEmployees[0].photo_url} className="h-full w-full object-cover" alt="Líder" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#2878a8] to-transparent opacity-60" />
                        <div className="absolute bottom-6 left-6 text-white">
                          <p className="text-3xl font-black italic uppercase leading-none">{sortedEmployees[0].name}</p>
                        </div>
                      </div>
                    )}
                  </Card>
                </div>

                <div className="lg:col-span-2 space-y-4">
                  {sortedEmployees.map((emp, i) => (
                    <div key={emp.id} className="flex flex-col">
                      <div onClick={() => toggleComments(emp.id)} className={cn("flex items-center gap-4 bg-white p-4 rounded-2xl border transition-all cursor-pointer", expandedId === emp.id ? "border-[#2878a8] shadow-md" : "border-transparent hover:border-[#2878a8]/30")}>
                        <div className={cn("h-10 w-10 rounded-full flex items-center justify-center text-white text-xs font-black", i === 0 ? "bg-[#f5ac0a]" : "bg-[#2878a8]/40")}>{i + 1}</div>
                        <img src={emp.photo_url} className="h-14 w-14 rounded-full object-cover border-2 border-slate-100" alt={emp.name} />
                        <div className="flex-1 min-w-0">
                          <p className="font-black text-[#2878a8] uppercase text-lg leading-none">{emp.name}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">{emp.role}</p>
                        </div>
                        <div className="text-right bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                          <div className="flex items-center justify-end gap-1 text-[#f5ac0a]">
                            <Star className="h-4 w-4 fill-current" />
                            <span className="font-black text-xl">{Number(emp.average_rating || 0).toFixed(1)}</span>
                          </div>
                          <p className="text-[9px] font-bold text-slate-400 uppercase">{emp.total_votes} votos</p>
                        </div>
                      </div>
                      {expandedId === emp.id && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="mt-2 ml-14 p-4 bg-slate-50 rounded-xl space-y-2 border border-slate-100 shadow-inner">
                          {loadingFeedback === emp.id ? <Spinner className="h-4 w-4" /> : feedbacks[emp.id]?.length ? feedbacks[emp.id].map((f, idx) => (
                            <div key={idx} className="bg-white p-3 rounded-lg border border-slate-100"><p className="text-xs text-slate-600 italic">"{f.comentario}"</p></div>
                          )) : <p className="text-xs text-slate-400 italic">Sin comentarios.</p>}
                        </motion.div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div key="hotel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              {/* Métricas del Hotel Escala 1-3 */}
              <div className="grid gap-6 md:grid-cols-3">
                <StatCard title="Limpieza" value={hotelData?.stats?.limpieza || "0.0"} sub="promedio (max 3)" icon={<Sparkles className="text-cyan-500" />} />
                <StatCard title="Infraestructura" value={hotelData?.stats?.infraestructura || "0.0"} sub="promedio (max 3)" icon={<Building2 className="text-[#2878a8]" />} />
                <StatCard title="Atención" value={hotelData?.stats?.atencion || "0.0"} sub="promedio (max 3)" icon={<Clock className="text-[#f5ac0a]" />} />
              </div>

              <Card className="rounded-[2.5rem] bg-white shadow-xl overflow-hidden border-none">
                <div className="bg-[#2878a8] p-6 text-white flex justify-between items-center">
                  <h2 className="text-2xl font-black italic uppercase">Muro de Experiencias</h2>
                  <MessageSquare />
                </div>
                <CardContent className="p-6 grid md:grid-cols-2 gap-4">
                  {loadingHotel ? <Spinner /> : hotelData?.data?.filter((f:any) => f.mejoras_sugerencias || f.comentarios_sugerencias).map((f:any, i:number) => (
                    <div key={i} className="bg-slate-50 p-5 rounded-3xl border border-slate-100 hover:border-[#2878a8]/20 transition-all">
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex gap-1 text-[#f5ac0a]">
                           {[1,2,3].map(s => <Star key={s} size={12} fill={s <= (f.habitacion_limpieza || 0) ? "currentColor" : "none"} />)}
                        </div>
                        <span className="text-[9px] font-bold text-slate-400">{new Date(f.created_at).toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm text-slate-700 italic">"{f.mejoras_sugerencias || f.comentarios_sugerencias}"</p>
                    </div>
                  )) || <p className="text-center text-slate-400 py-10 uppercase text-xs font-bold italic">No hay comentarios aún</p>}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}

function StatCard({ title, value, sub, icon }: { title: string, value: any, sub: string, icon: any }) {
  return (
    <Card className="border-none shadow-lg rounded-[2rem] overflow-hidden bg-white">
      <div className="h-1.5 w-full bg-[#2878a8]" />
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-400">{title}</CardTitle>
        <div className="p-2 bg-slate-50 rounded-xl">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-black text-[#2878a8]">{value}</div>
        <p className="text-[9px] font-black uppercase text-[#f5ac0a] mt-2 tracking-widest">{sub}</p>
      </CardContent>
    </Card>
  )
}
