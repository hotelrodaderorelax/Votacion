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
  MessageSquare
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
  comentario?: string // Soporta ambas versiones de nombre de columna
  comment?: string
  created_at: string
}

export default function AdminDashboard() {
  const router = useRouter()
  const [authorized, setAuthorized] = React.useState(false)
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

  const { data: employees, isLoading } = useSWR<Employee[]>(
    authorized ? "/api/employees" : null,
    fetcher,
    { refreshInterval: 5000 }
  )

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
        
        // Ordenar por fecha: más reciente primero
        const sortedData = Array.isArray(data) 
          ? data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          : []
          
        setFeedbacks(prev => ({ ...prev, [id]: sortedData }))
      } catch (error) {
        console.error("Error:", error)
      } finally {
        setLoadingFeedback(null)
      }
    }
  }

  const sortedEmployees = React.useMemo(() => {
    if (!employees) return []
    return [...employees]
      .map(emp => ({
        ...emp,
        photo_url: emp.name.includes("Lexilis") ? "/Lexilis Mejia.jpeg" : emp.photo_url,
        total_votes: Number(emp.total_votes) || 0,
        average_rating: Number(emp.average_rating) || 0
      }))
      .sort((a, b) => b.average_rating - a.average_rating || b.total_votes - a.total_votes)
  }, [employees])

  const stats = React.useMemo(() => {
    const totalVotes = sortedEmployees.reduce((sum, e) => sum + e.total_votes, 0)
    const avgRating = sortedEmployees.length > 0 
      ? sortedEmployees.reduce((sum, e) => sum + e.average_rating, 0) / sortedEmployees.length 
      : 0
    return { totalVotes, avgRating }
  }, [sortedEmployees])

  if (!authorized) return null
  if (isLoading) return <div className="flex min-h-screen items-center justify-center bg-slate-50"><Spinner className="h-10 w-10 text-[#2878a8]" /></div>

  return (
    <div className="min-h-screen bg-slate-50/50 pb-12 font-sans">
      <header className="border-b bg-white shadow-sm sticky top-0 z-10 p-4">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="outline" size="icon" className="rounded-full border-[#2878a8] text-[#2878a8]">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-black text-[#2878a8] italic uppercase leading-none">Ranking de Servicio</h1>
              <p className="text-[10px] font-bold text-[#f5ac0a] uppercase tracking-widest mt-1">Hotel Rodadero Relax</p>
            </div>
          </div>
          <Button variant="ghost" onClick={() => { document.cookie = "admin_auth=; path=/; expires=Thu, 01 Jan 1970"; router.push("/admin/login") }} className="text-[10px] font-bold text-slate-400 hover:text-red-500 uppercase flex items-center gap-2">
            <LogOut size={14} /> Cerrar Sesión
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <StatCard title="Votos Totales" value={stats.totalVotes} sub="Votos este mes" icon={<Users className="text-[#2878a8]" />} />
          <StatCard title="Promedio General" value={stats.avgRating.toFixed(1)} sub="Estrellas" icon={<Star className="text-[#f5ac0a] fill-[#f5ac0a]" />} />
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <Card className="overflow-hidden border-4 border-[#2878a8]/10 shadow-2xl">
              <div className="bg-[#2878a8] p-4 text-white font-serif italic text-lg text-center font-bold">Ganador Provisional</div>
              {sortedEmployees[0] && (
                <div className="relative aspect-[4/5]">
                  <img src={sortedEmployees[0].photo_url} className="h-full w-full object-cover" alt="Ganador" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2878a8] via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 text-white">
                    <p className="text-[10px] font-bold text-[#f5ac0a] uppercase">Primer Lugar</p>
                    <p className="text-3xl font-black">{sortedEmployees[0].name}</p>
                  </div>
                </div>
              )}
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-[#2878a8] font-serif text-2xl italic font-bold mb-4">Clasificación Detallada</h2>
            {sortedEmployees.map((emp, i) => (
              <div key={emp.id} className="flex flex-col">
                <motion.div 
                  onClick={() => toggleComments(emp.id)}
                  className={cn(
                    "flex items-center gap-4 bg-white p-4 rounded-2xl border transition-all cursor-pointer hover:shadow-md",
                    expandedId === emp.id ? 'border-[#2878a8] shadow-md' : 'border-transparent'
                  )}
                >
                  <div className={cn("h-10 w-10 rounded-full flex items-center justify-center text-white font-bold shadow-lg", i === 0 ? 'bg-[#f5ac0a]' : 'bg-[#2878a8]/40')}>{i + 1}</div>
                  <img src={emp.photo_url} className="h-14 w-14 rounded-full object-cover border-2 border-[#2878a8]/10" alt={emp.name} />
                  <div className="flex-1">
                    <p className="font-black text-[#2878a8] uppercase text-lg leading-none">{emp.name}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">{emp.role}</p>
                  </div>
                  <div className="text-right bg-slate-50 px-4 py-2 rounded-xl">
                    <div className="flex items-center gap-1 text-[#f5ac0a] font-black text-xl">
                      <Star size={18} fill="currentColor" /> {emp.average_rating.toFixed(1)}
                    </div>
                    <p className="text-[9px] text-slate-400 font-bold uppercase">{emp.total_votes} votos</p>
                  </div>
                </motion.div>

                <AnimatePresence>
                  {expandedId === emp.id && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="mt-2 ml-14 p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-3">
                        <h4 className="text-[10px] font-black text-[#2878a8] uppercase flex items-center gap-2"><MessageSquare size={12} /> Comentarios Recientes</h4>
                        {loadingFeedback === emp.id ? <Spinner className="h-4 w-4 text-[#2878a8]" /> : feedbacks[emp.id]?.length > 0 ? (
                          feedbacks[emp.id].slice(0, 5).map((f, idx) => (
                            <div key={idx} className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                              <p className="text-xs text-slate-600 italic">"{f.comentario || f.comment || "Sin comentario"}"</p>
                              <p className="text-[8px] text-slate-400 mt-2 font-bold uppercase">{new Date(f.created_at).toLocaleDateString()}</p>
                            </div>
                          ))
                        ) : <p className="text-xs text-slate-400 italic">No hay comentarios aún.</p>}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

function StatCard({ title, value, sub, icon }: { title: string, value: any, sub: string, icon: any }) {
  return (
    <Card className="border-b-4 border-[#2878a8] shadow-lg">
      <CardContent className="p-6 flex items-center justify-between">
        <div>
          <p className="text-xs font-black uppercase text-slate-400 tracking-widest">{title}</p>
          <div className="text-4xl font-black text-[#2878a8] my-1">{value}</div>
          <p className="text-[10px] font-bold uppercase text-[#f5ac0a]">{sub}</p>
        </div>
        <div className="h-12 w-12 bg-slate-50 rounded-2xl flex items-center justify-center">{icon}</div>
      </CardContent>
    </Card>
  )
}
