"use client"

import * as React from "react"
import useSWR from "swr"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Star,  
  ArrowLeft,
  LogOut,
  MessageSquare,
  Home,
  User as UserIcon,
  Sparkles,
  Building2,
  Clock,
  Calendar
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
  image_url: string
  total_votes: number
  average_rating: number
}

const getEmployeePhoto = (name: string) => {
  if (!name) return "/placeholder-user.jpg";
  const n = name.toUpperCase();
  if (n.includes("LEXILIS")) return "/LEXILIS-1.jpeg";
  if (n.includes("EZLATNE")) return "/EZLATNE-1.jpeg";
  if (n.includes("VIRGINIA")) return "/VIRGINIA-1.jpeg";
  if (n.includes("ANDREINA")) return "/ANDREINA-1.jpg.jpeg";
  if (n.includes("MIGUEL")) return "/MIGUEL-1.jpeg";
  return "/placeholder-user.jpg";
}

export function AdminDashboard() {
  const router = useRouter()
  const [authorized, setAuthorized] = React.useState(false)
  const [view, setView] = React.useState<'employees' | 'hotel'>('employees')
  const [expandedId, setExpandedId] = React.useState<string | null>(null)
  const [feedbacks, setFeedbacks] = React.useState<Record<string, any[]>>({})
  const [loadingFeedback, setLoadingFeedback] = React.useState<string | null>(null)
  
  // ESTADO PARA EL MES (Reinicia visualmente cada mes)
  const [selectedMonth, setSelectedMonth] = React.useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  });

  React.useEffect(() => {
    const getCookie = (name: string) => {
      if (typeof document === "undefined") return null;
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
      return null;
    };
    const auth = getCookie("admin_auth");
    if (auth !== "true") router.push("/admin/login");
    else setAuthorized(true);
  }, [router])

  // Pasamos el mes a la API para filtrar
  const { data: employees, isLoading } = useSWR<Employee[]>(
    authorized ? `/api/employees?month=${selectedMonth}` : null,
    fetcher,
    { refreshInterval: 5000 }
  )

  const { data: hotelResponse, isLoading: loadingHotel } = useSWR(
    authorized && view === 'hotel' ? `/api/hotel-feedback?month=${selectedMonth}` : null,
    fetcher
  )

  const hotelData = hotelResponse?.data || []
  const hotelStats = hotelResponse?.stats || { limpieza: "0.0", infraestructura: "0.0", atencion: "0.0" }

  const toggleComments = async (id: string) => {
    if (expandedId === id) { setExpandedId(null); return; }
    setExpandedId(id)
    if (!feedbacks[id]) {
      setLoadingFeedback(id)
      try {
        const res = await fetch(`/api/employee-feedback?id=${id}&month=${selectedMonth}`)
        const data = await res.json()
        setFeedbacks(prev => ({ ...prev, [id]: Array.isArray(data) ? data : [] }))
      } catch (error) { console.error(error) } finally { setLoadingFeedback(null) }
    }
  }

  const processedEmployees = React.useMemo(() => {
    if (!employees) return []
    return employees.map(emp => ({
      ...emp,
      display_photo: getEmployeePhoto(emp.name),
      total_votes: Number(emp.total_votes) || 0,
      average_rating: Number(emp.average_rating) || 0
    }))
  }, [employees])

  // LÓGICA DE ORDENAMIENTO CON DESEMPATE POR VOTOS
  const sortedEmployees = React.useMemo(() => {
    return [...processedEmployees].sort((a, b) => {
      if (b.average_rating !== a.average_rating) {
        return b.average_rating - a.average_rating; // Prioridad 1: Estrellas
      }
      return b.total_votes - a.total_votes; // Prioridad 2: Más votos (Desempate)
    })
  }, [processedEmployees])

  const stats = React.useMemo(() => {
    const totalVotes = processedEmployees.reduce((sum, e) => sum + e.total_votes, 0)
    const validEmps = processedEmployees.filter(e => e.total_votes > 0)
    const avgRating = validEmps.length > 0 ? processedEmployees.reduce((sum, e) => sum + e.average_rating, 0) / validEmps.length : 0
    return { totalVotes, avgRating, topPerformers: processedEmployees.filter(e => e.average_rating >= 4.5).length }
  }, [processedEmployees])

  if (!authorized) return null
  if (isLoading) return <div className="flex min-h-screen items-center justify-center bg-slate-50"><Spinner className="h-10 w-10 text-[#2878a8]" /></div>

  return (
    <div className="min-h-screen bg-slate-50/50 pb-12">
      <header className="border-b bg-white shadow-sm sticky top-0 z-20">
        <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/"><Button variant="outline" size="icon" className="rounded-full border-[#2878a8] text-[#2878a8]"><ArrowLeft className="h-5 w-5" /></Button></Link>
            <div>
              <h1 className="font-serif text-2xl font-black text-[#2878a8] italic uppercase leading-none">Admin Relax</h1>
              <div className="flex items-center gap-2 mt-1">
                 <Calendar size={10} className="text-[#f5ac0a]" />
                 <input 
                  type="month" 
                  value={selectedMonth}
                  onChange={(e) => { setSelectedMonth(e.target.value); setFeedbacks({}); }}
                  className="text-[10px] font-bold text-[#f5ac0a] uppercase bg-transparent border-none focus:ring-0 cursor-pointer"
                 />
              </div>
            </div>
          </div>

          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button onClick={() => setView('hotel')} className={cn("px-4 py-2 rounded-lg text-[10px] font-bold uppercase transition-all", view === 'hotel' ? "bg-white text-[#2878a8] shadow-sm" : "text-slate-400")}>EL HOTEL</button>
            <button onClick={() => setView('employees')} className={cn("px-4 py-2 rounded-lg text-[10px] font-bold uppercase transition-all", view === 'employees' ? "bg-white text-[#2878a8] shadow-sm" : "text-slate-400")}>EMPLEADOS</button>
          </div>

          <Button variant="ghost" onClick={() => { document.cookie = "admin_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;"; router.push("/admin/login") }} className="text-slate-400 font-bold text-[10px] uppercase"><LogOut size={16} /></Button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">
        {/* Los StatsCards y el resto del grid se mantienen exactamente igual a tu diseño original */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <StatCard title={view === 'hotel' ? "Limpieza" : "Votos Totales"} value={view === 'hotel' ? hotelStats.limpieza : stats.totalVotes} sub="Promedio" icon={<Sparkles className="text-[#2878a8]" />} />
          <StatCard title={view === 'hotel' ? "Infraestructura" : "Promedio Hotel"} value={view === 'hotel' ? hotelStats.infraestructura : stats.avgRating.toFixed(1)} sub="Estrellas" icon={<Building2 className="text-[#f5ac0a]" />} />
          <StatCard title={view === 'hotel' ? "Atención" : "Elite"} value={view === 'hotel' ? hotelStats.atencion : stats.topPerformers} sub="Rendimiento" icon={<Clock className="text-green-500" />} />
        </div>

        <AnimatePresence mode="wait">
          {view === 'employees' ? (
            <motion.div key="employees" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid gap-8 lg:grid-cols-3">
              <div className="lg:col-span-1">
                <Card className="overflow-hidden border-4 border-[#2878a8]/10 shadow-2xl">
                  <div className="bg-[#2878a8] p-3 text-white font-black italic text-center uppercase text-sm tracking-tighter">Líder del Mes</div>
                  {sortedEmployees[0] && (
                    <div className="relative aspect-[4/5]">
                      <img src={sortedEmployees[0].display_photo} className="h-full w-full object-cover" alt="Líder" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#2878a8] via-transparent to-transparent opacity-80" />
                      <div className="absolute bottom-6 left-6 text-white">
                        <p className="text-[10px] font-bold text-[#f5ac0a] uppercase mb-1">Primer Lugar</p>
                        <p className="text-3xl font-black italic uppercase">{sortedEmployees[0].name}</p>
                      </div>
                    </div>
                  )}
                </Card>
              </div>
              <div className="lg:col-span-2 space-y-4">
                {sortedEmployees.map((emp, i) => (
                  <div key={emp.id} onClick={() => toggleComments(emp.id)} className="flex flex-col cursor-pointer bg-white p-4 rounded-2xl border border-transparent hover:border-[#2878a8]/30 shadow-sm transition-all">
                    <div className="flex items-center gap-4">
                      <div className={cn("h-10 w-10 rounded-full flex items-center justify-center text-white text-xs font-black", i === 0 ? "bg-[#f5ac0a]" : "bg-[#2878a8]/40")}>{i + 1}</div>
                      <img src={emp.display_photo} className="h-14 w-14 rounded-full object-cover border-2 border-slate-100" />
                      <div className="flex-1">
                        <p className="font-black text-[#2878a8] uppercase text-lg leading-none">{emp.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">{emp.role}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center justify-end gap-1 text-[#f5ac0a]">
                          <Star className="h-4 w-4 fill-current" />
                          <span className="font-black text-xl">{emp.average_rating.toFixed(1)}</span>
                        </div>
                        <p className="text-[9px] font-bold text-slate-400 uppercase">{emp.total_votes} votos</p>
                      </div>
                    </div>
                    {expandedId === emp.id && (
                      <div className="mt-4 ml-14 p-4 bg-slate-50 rounded-xl space-y-2 border border-slate-100">
                        {loadingFeedback === emp.id ? <Spinner className="h-4 w-4" /> : feedbacks[emp.id]?.length > 0 ? (
                          feedbacks[emp.id].map((f, idx) => (
                            <div key={idx} className="bg-white p-3 rounded-lg border text-xs italic shadow-sm">"{f.comentario}"</div>
                          ))
                        ) : <p className="text-[9px] text-slate-400 uppercase text-center py-2">Sin comentarios este mes</p>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div key="hotel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-4xl mx-auto space-y-6">
               <div className="bg-white p-6 rounded-2xl border-b-4 border-[#2878a8] shadow-sm">
                  <h3 className="text-[#2878a8] font-black italic uppercase text-lg flex items-center gap-2 mb-6"><MessageSquare size={18} /> Muro de Experiencias</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    {loadingHotel ? <Spinner /> : hotelData.map((f: any, i: number) => (
                      <div key={i} className="bg-slate-50/50 p-4 rounded-xl border border-slate-100 shadow-sm">
                        <div className="flex justify-between mb-2">
                           <span className="text-[9px] font-black text-[#2878a8] bg-white px-2 py-1 rounded border uppercase">General</span>
                           <div className="flex text-[#f5ac0a] items-center gap-1"><Star size={12} fill="currentColor"/> <span className="font-bold text-xs">5.0</span></div>
                        </div>
                        <p className="text-xs text-slate-700 italic">"{f.mejoras_sugerencias || f.comentario || "Sin comentarios"}"</p>
                      </div>
                    ))}
                  </div>
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
    <Card className="border-b-4 border-b-[#2878a8] shadow-lg group">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-[10px] font-black uppercase text-slate-400">{title}</CardTitle>
        <div className="p-2 bg-slate-50 rounded-lg">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-black text-[#2878a8]">{value}</div>
        <p className="text-[10px] font-bold uppercase text-[#f5ac0a] mt-2">{sub}</p>
      </CardContent>
    </Card>
  )
}
