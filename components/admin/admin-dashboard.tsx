"use client"

import * as React from "react"
import useSWR from "swr"
import { motion, AnimatePresence } from "framer-motion"
import { Trophy, Users, Star, TrendingUp, ArrowLeft, LogOut, MessageSquare, Home, User as UserIcon } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

type Employee = {
  id: string; name: string; role: string; photo_url: string; total_votes: number; average_rating: number;
}

type Feedback = {
  id: number; comentario: string; created_at: string;
}

export function AdminDashboard() {
  const router = useRouter()
  const [authorized, setAuthorized] = React.useState(false)
  const [view, setView] = React.useState<'employees' | 'hotel'>('employees')
  const [expandedId, setExpandedId] = React.useState<string | null>(null)
  const [feedbacks, setFeedbacks] = React.useState<Record<string, Feedback[]>>({})
  const [loadingFeedback, setLoadingFeedback] = React.useState<string | null>(null)

  React.useEffect(() => {
    const auth = document.cookie.includes("admin_auth=true");
    if (!auth) router.push("/admin/login");
    else setAuthorized(true);
  }, [router])

  // Empleados
  const { data: employees, isLoading } = useSWR<Employee[]>(authorized ? "/api/employees" : null, fetcher)

  // Feedback del Hotel (Muro)
  const { data: hotelFeedback, isLoading: loadingHotel } = useSWR<Feedback[]>(
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
        setFeedbacks(prev => ({ ...prev, [id]: Array.isArray(data) ? data : [] }))
      } catch (error) { console.error(error) } 
      finally { setLoadingFeedback(null) }
    }
  }

  const sortedEmployees = React.useMemo(() => {
    if (!employees) return []
    return [...employees].map(emp => ({
      ...emp,
      photo_url: emp.name.includes("Lexilis") ? "/Lexilis Mejia.jpeg" : emp.photo_url,
      total_votes: Number(emp.total_votes) || 0,
      average_rating: Number(emp.average_rating) || 0
    })).sort((a, b) => b.average_rating - a.average_rating || b.total_votes - a.total_votes)
  }, [employees])

  if (!authorized || isLoading) return <div className="flex min-h-screen items-center justify-center"><Spinner className="h-10 w-10 text-[#2878a8]" /></div>

  return (
    <div className="min-h-screen bg-slate-50/50 pb-12">
      <header className="border-b bg-white sticky top-0 z-20 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/"><Button variant="outline" size="icon" className="rounded-full border-[#2878a8] text-[#2878a8]"><ArrowLeft /></Button></Link>
            <div>
              <h1 className="font-serif text-2xl font-black text-[#2878a8] italic uppercase">Admin Relax</h1>
              <p className="text-[10px] font-bold text-[#f5ac0a] uppercase tracking-widest">Hotel Rodadero Relax</p>
            </div>
          </div>

          <div className="flex bg-slate-100 p-1 rounded-xl border">
            <button onClick={() => setView('hotel')} className={cn("flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-bold uppercase transition-all", view === 'hotel' ? "bg-white text-[#2878a8] shadow-sm" : "text-slate-400")}>
              <Home size={14} /> Muro Hotel
            </button>
            <button onClick={() => setView('employees')} className={cn("flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-bold uppercase transition-all", view === 'employees' ? "bg-white text-[#2878a8] shadow-sm" : "text-slate-400")}>
              <UserIcon size={14} /> Empleados
            </button>
          </div>
          
          <Button variant="ghost" onClick={() => { document.cookie = "admin_auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"; router.push("/admin/login"); }} className="text-slate-400 hover:text-red-500 text-[10px] font-bold uppercase">
            <LogOut className="h-4 w-4 mr-2" /> Salir
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">
        <AnimatePresence mode="wait">
          {view === 'employees' ? (
            <motion.div key="emps" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid gap-8 lg:grid-cols-3">
              <div className="lg:col-span-1">
                <Card className="overflow-hidden border-4 border-[#2878a8]/10 shadow-2xl">
                  <div className="bg-[#2878a8] p-3 text-white font-black italic text-center uppercase text-sm">Ganador Provisional</div>
                  {sortedEmployees[0] && <img src={sortedEmployees[0].photo_url} className="aspect-[4/5] w-full object-cover" />}
                </Card>
              </div>

              <div className="lg:col-span-2 space-y-4">
                {sortedEmployees.map((emp, i) => (
                  <div key={emp.id}>
                    <div onClick={() => toggleComments(emp.id)} className={cn("flex items-center gap-4 bg-white p-4 rounded-2xl border cursor-pointer transition-all", expandedId === emp.id ? "border-[#2878a8] shadow-md" : "border-transparent shadow-sm")}>
                      <div className={cn("h-10 w-10 rounded-full flex items-center justify-center text-white text-xs font-black", i === 0 ? "bg-[#f5ac0a]" : "bg-[#2878a8]/40")}>{i + 1}</div>
                      <img src={emp.photo_url} className="h-14 w-14 rounded-full object-cover" />
                      <div className="flex-1">
                        <p className="font-black text-[#2878a8] uppercase text-lg">{emp.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">{emp.role}</p>
                      </div>
                      <div className="text-right">
                         <div className="flex items-center text-[#f5ac0a] font-black text-xl"><Star className="h-4 w-4 fill-current mr-1" /> {emp.average_rating.toFixed(1)}</div>
                         <p className="text-[9px] text-slate-400 uppercase font-bold">{emp.total_votes} votos</p>
                      </div>
                    </div>
                    {expandedId === emp.id && (
                      <div className="ml-14 mt-2 p-4 bg-slate-50 rounded-xl border space-y-2">
                        {loadingFeedback === emp.id ? <Spinner className="h-4 w-4" /> : feedbacks[emp.id]?.map(f => (
                          <div key={f.id} className="bg-white p-3 rounded-lg border text-xs italic">
                            "{f.comentario}"
                            <div className="text-[8px] text-slate-400 mt-1 not-italic font-bold">{new Date(f.created_at).toLocaleDateString()}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div key="hotel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-2xl mx-auto space-y-6">
              <div className="bg-[#2878a8] p-8 rounded-3xl text-white shadow-xl">
                <h2 className="text-5xl font-black italic">Muro del Hotel</h2>
                <p className="text-[10px] font-bold uppercase tracking-widest mt-2 opacity-80">Feedback Reciente de Clientes</p>
              </div>
              <div className="space-y-4">
                {loadingHotel ? <Spinner /> : hotelFeedback?.length ? hotelFeedback.map((f, i) => (
                  <div key={i} className="bg-white p-6 rounded-2xl border shadow-sm border-slate-100">
                    <p className="text-sm text-slate-700 italic">"{f.comentario}"</p>
                    <div className="mt-4 pt-4 border-t text-[9px] font-black text-[#2878a8] uppercase">
                      {new Date(f.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'long' })}
                    </div>
                  </div>
                )) : <p className="text-center text-slate-400 font-bold uppercase text-[10px] py-10">No hay comentarios generales</p>}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
