"use client"

import * as React from "react"
import useSWR from "swr"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Trophy, Users, Star, TrendingUp, ArrowLeft, LogOut, 
  MessageSquare, ChevronDown, ChevronUp, Hotel, ClipboardList 
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
  comentario: string
  rating: number
  created_at: string
}

export function AdminDashboard() {
  const router = useRouter()
  const [authorized, setAuthorized] = React.useState(false)
  const [expandedEmp, setExpandedEmp] = React.useState<string | null>(null)
  const [empFeedbacks, setEmpFeedbacks] = React.useState<Record<string, Feedback[]>>({})

  // --- 1. PROTECCIÓN POR COOKIES ---
  React.useEffect(() => {
    const getCookie = (name: string) => {
      if (typeof document === "undefined") return null;
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
      return null;
    };
    const auth = getCookie("admin_auth");
    if (auth !== "true") router.push("/admin/login")
    else setAuthorized(true)
  }, [router])

  // --- 2. CARGA DE DATOS ---
  const { data: employees, isLoading: loadingEmp } = useSWR<Employee[]>(
    authorized ? "/api/employees" : null, fetcher, { refreshInterval: 5000 }
  )

  // Nueva carga para el feedback general del hotel (ajusta el endpoint según tu API)
  const { data: hotelStats, isLoading: loadingHotel } = useSWR(
    authorized ? "/api/hotel-stats" : null, fetcher
  )

  // --- 3. LOGICA DE COMENTARIOS DE EMPLEADOS ---
  const toggleEmployeeComments = async (id: string) => {
    if (expandedEmp === id) {
      setExpandedEmp(null)
      return
    }
    setExpandedEmp(id)
    if (!empFeedbacks[id]) {
      const res = await fetch(`/api/employee-feedback?id=${id}`)
      const data = await res.json()
      setEmpFeedbacks(prev => ({ ...prev, [id]: data }))
    }
  }

  const sortedEmployees = React.useMemo(() => {
    if (!employees) return []
    return [...employees].sort((a, b) => b.average_rating - a.average_rating || b.total_votes - a.total_votes)
  }, [employees])

  const stats = React.useMemo(() => {
    const totalVotes = sortedEmployees.reduce((sum, e) => sum + Number(e.total_votes), 0)
    const avg = sortedEmployees.length > 0 ? sortedEmployees.reduce((sum, e) => sum + Number(e.average_rating), 0) / sortedEmployees.length : 0
    return { totalVotes, avg }
  }, [sortedEmployees])

  const handleLogout = () => {
    document.cookie = "admin_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    router.push("/admin/login")
  }

  if (!authorized) return null
  if (loadingEmp) return <div className="flex min-h-screen items-center justify-center"><Spinner className="h-10 w-10 text-[#2878a8]" /></div>

  return (
    <div className="min-h-screen bg-slate-50/50 pb-12">
      <header className="border-b bg-white shadow-sm sticky top-0 z-20">
        <div className="mx-auto max-w-7xl px-4 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/"><Button variant="outline" size="icon" className="rounded-full border-[#2878a8] text-[#2878a8]"><ArrowLeft className="h-5 w-5" /></Button></Link>
            <div>
              <h1 className="font-serif text-2xl font-black text-[#2878a8] italic uppercase leading-none">Panel Administrativo</h1>
              <p className="text-[10px] font-bold text-[#f5ac0a] uppercase tracking-widest mt-1">Gestión Interna | Hotel Rodadero Relax</p>
            </div>
          </div>
          <Button variant="ghost" onClick={handleLogout} className="text-slate-400 hover:text-red-500 gap-2 font-bold text-xs uppercase tracking-tighter">
            <LogOut className="h-4 w-4" /> Cerrar Sesión
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">
        {/* RESUMEN DE PUNTUACIÓN DEL HOTEL (La encuesta general) */}
        <div className="mb-12">
          <h2 className="flex items-center gap-2 text-sm font-black text-slate-400 uppercase tracking-widest mb-4">
            <Hotel className="h-4 w-4" /> Satisfacción General del Hotel
          </h2>
          <div className="grid gap-6 md:grid-cols-4">
            <StatCard title="Promedio Hotel" value="4.8" sub="estrellas generales" icon={<Star className="text-[#f5ac0a] fill-[#f5ac0a]" />} />
            <div className="md:col-span-3 bg-white rounded-[2rem] border-2 border-[#2878a8]/5 p-6 shadow-xl flex flex-col justify-center">
              <p className="text-[10px] font-black text-slate-400 uppercase mb-3">Últimas sugerencias de clientes (Encuesta)</p>
              <div className="space-y-2">
                <p className="text-sm text-slate-600 italic font-medium">"El servicio en el restaurante es excepcional, pero podrían mejorar el tiempo de registro en recepción."</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* COLUMNA IZQUIERDA: RANKING Y COMENTARIOS */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="flex items-center gap-2 text-sm font-black text-slate-400 uppercase tracking-widest">
              <Users className="h-4 w-4" /> Clasificación de Empleados
            </h2>
            
            <div className="space-y-4">
              {sortedEmployees.map((emp, i) => (
                <div key={emp.id} className="flex flex-col gap-2">
                  <motion.div 
                    onClick={() => toggleEmployeeComments(emp.id)}
                    className={cn(
                      "flex items-center gap-4 rounded-3xl border bg-white p-4 transition-all cursor-pointer hover:shadow-lg",
                      expandedEmp === emp.id ? "border-[#2878a8] ring-4 ring-[#2878a8]/5" : "border-slate-100"
                    )}
                  >
                    <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl font-black text-white shadow-lg", 
                      i === 0 ? "bg-[#f5ac0a]" : i === 1 ? "bg-slate-400" : "bg-[#2878a8]/40")}>
                      {i + 1}
                    </div>
                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-2xl border-2 border-slate-50">
                      <img src={emp.photo_url} className="h-full w-full object-cover" alt="" />
                    </div>
                    <div className="flex-1">
                      <p className="font-black text-[#2878a8] text-lg leading-none">{emp.name}</p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">{emp.role}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center justify-end gap-1 text-[#f5ac0a]">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="font-black text-xl">{Number(emp.average_rating).toFixed(1)}</span>
                      </div>
                      <p className="text-[9px] font-black text-slate-300 uppercase">{emp.total_votes} votos</p>
                    </div>
                    <div className="pl-2 border-l border-slate-100">
                      {expandedEmp === emp.id ? <ChevronUp className="text-[#2878a8]" /> : <ChevronDown className="text-slate-300" />}
                    </div>
                  </motion.div>

                  {/* DESPLIEGUE DE COMENTARIOS DEL EMPLEADO */}
                  <AnimatePresence>
                    {expandedEmp === emp.id && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }} 
                        animate={{ height: "auto", opacity: 1 }} 
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden px-4"
                      >
                        <div className="bg-[#2878a8]/5 rounded-b-[2rem] p-6 border-x border-b border-[#2878a8]/10 space-y-3">
                          <p className="text-[9px] font-black text-[#2878a8] uppercase tracking-widest mb-2">Comentarios de huéspedes:</p>
                          {empFeedbacks[emp.id]?.length ? empFeedbacks[emp.id].map((f, idx) => (
                            <div key={idx} className="bg-white p-3 rounded-2xl shadow-sm border border-[#2878a8]/5">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-[#f5ac0a] text-[10px]">{"★".repeat(f.rating)}</span>
                                <span className="text-[8px] font-bold text-slate-300 uppercase">{new Date(f.created_at).toLocaleDateString()}</span>
                              </div>
                              <p className="text-xs text-slate-600 italic">"{f.comentario}"</p>
                            </div>
                          )) : <p className="text-xs text-slate-400 text-center py-2">Sin comentarios registrados.</p>}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>

          {/* COLUMNA DERECHA: ESTADÍSTICAS GENERALES */}
          <div className="space-y-6">
            <h2 className="flex items-center gap-2 text-sm font-black text-slate-400 uppercase tracking-widest">
              <TrendingUp className="h-4 w-4" /> Métricas del Mes
            </h2>
            <StatCard title="Votos Totales" value={stats.totalVotes} sub="participaciones" icon={<ClipboardList className="text-[#2878a8]" />} />
            
            <Card className="bg-[#2878a8] text-white overflow-hidden border-none shadow-2xl">
              <CardHeader><CardTitle className="font-serif italic text-lg">Top del Mes</CardTitle></CardHeader>
              <CardContent className="p-0">
                {sortedEmployees[0] && (
                  <div className="relative">
                    <img src={sortedEmployees[0].photo_url} className="h-64 w-full object-cover grayscale-[30%]" alt="" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#2878a8] to-transparent" />
                    <div className="absolute bottom-6 left-6">
                      <Trophy className="h-8 w-8 text-[#f5ac0a] mb-2" />
                      <p className="text-2xl font-black">{sortedEmployees[0].name}</p>
                      <p className="text-[10px] font-bold uppercase text-[#f5ac0a]">{sortedEmployees[0].role}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

function StatCard({ title, value, sub, icon }: { title: string, value: any, sub: string, icon: any }) {
  return (
    <Card className="border-none shadow-xl bg-white rounded-[2rem] hover:translate-y-[-4px] transition-all">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-400">{title}</CardTitle>
        <div className="p-2 bg-slate-50 rounded-xl">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-black text-[#2878a8]">{value}</div>
        <p className="text-[10px] font-bold uppercase text-[#f5ac0a] mt-1">{sub}</p>
      </CardContent>
    </Card>
  )
}
