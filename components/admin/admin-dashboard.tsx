"use client"

import * as React from "react"
import useSWR from "swr"
import { motion, AnimatePresence } from "framer-motion"
import { Trophy, Users, Star, TrendingUp, ArrowLeft, LogOut, MessageSquare } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function AdminDashboard() {
  const router = useRouter()
  const [authorized, setAuthorized] = React.useState(false)
  const [expandedId, setExpandedId] = React.useState<string | null>(null)
  const [feedbacks, setFeedbacks] = React.useState<Record<string, any[]>>({})

  React.useEffect(() => {
    const auth = document.cookie.includes("admin_auth=true")
    if (!auth) router.push("/admin/login")
    else setAuthorized(true)
  }, [router])

  const { data: employees, isLoading, mutate } = useSWR("/api/employees", fetcher, { refreshInterval: 5000 })

  const sortedEmployees = React.useMemo(() => {
    if (!employees) return []
    return [...employees].sort((a, b) => b.average_rating - a.average_rating)
  }, [employees])

  const toggleComments = async (id: string) => {
    if (expandedId === id) { setExpandedId(null); return; }
    setExpandedId(id)
    if (!feedbacks[id]) {
      const res = await fetch(`/api/employee-feedback?id=${id}`)
      const data = await res.json()
      setFeedbacks(prev => ({ ...prev, [id]: data }))
    }
  }

  if (!authorized || isLoading) return <div className="flex min-h-screen items-center justify-center"><Spinner className="h-10 w-10 text-[#2878a8]" /></div>

  return (
    <div className="min-h-screen bg-slate-50/50 pb-12 font-sans">
      <header className="border-b bg-white p-6 sticky top-0 z-10">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/"><Button variant="outline" size="icon" className="rounded-full border-[#2878a8] text-[#2878a8]"><ArrowLeft size={20} /></Button></Link>
            <div>
              <h1 className="text-3xl font-black text-[#2878a8] uppercase italic leading-none">Ranking de Servicio</h1>
              <p className="text-[10px] font-bold text-[#f5ac0a] uppercase tracking-[0.2em] mt-1">Hotel Rodadero Relax</p>
            </div>
          </div>
          <Button variant="ghost" onClick={() => { document.cookie = "admin_auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"; router.push("/admin/login"); }} className="text-slate-400 font-bold text-xs uppercase"><LogOut className="mr-2 h-4 w-4" /> Salir</Button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">
        {/* Stats Originales */}
        <div className="grid gap-6 md:grid-cols-3 mb-12">
          <StatCard title="Votos Totales" value={sortedEmployees.reduce((s, e) => s + e.total_votes, 0)} sub="votos registrados" icon={<Users className="text-[#2878a8]" />} />
          <StatCard title="Promedio" value="5.0" sub="estrellas" icon={<Star className="text-[#f5ac0a] fill-[#f5ac0a]" />} />
          <StatCard title="Elite" value={sortedEmployees.filter(e => e.average_rating >= 4.5).length} sub="top empleados" icon={<TrendingUp className="text-green-500" />} />
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Ganador con el Estilo de Carta */}
          <div className="lg:col-span-1">
            {sortedEmployees[0] && (
              <Card className="overflow-hidden border-4 border-[#2878a8]/10 shadow-2xl rounded-[3rem]">
                <div className="relative aspect-[4/5]">
                  <img src={sortedEmployees[0].photo_url} className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2878a8] via-transparent" />
                  <div className="absolute bottom-8 left-8 text-white">
                    <Trophy className="h-10 w-10 text-[#f5ac0a] mb-2 animate-bounce" />
                    <p className="text-3xl font-black uppercase italic leading-tight">{sortedEmployees[0].name}</p>
                    <div className="flex items-center gap-2 mt-2 bg-white/20 backdrop-blur-md w-fit px-3 py-1 rounded-full">
                      <Star className="h-4 w-4 fill-[#f5ac0a] text-[#f5ac0a]" />
                      <span className="font-bold">{Number(sortedEmployees[0].average_rating).toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Lista de Clasificación Limpia */}
          <div className="lg:col-span-2 space-y-4">
            {sortedEmployees.map((emp, i) => (
              <div key={emp.id}>
                <motion.div 
                  onClick={() => toggleComments(emp.id)}
                  className="flex items-center gap-4 bg-white p-4 rounded-3xl border border-slate-100 hover:shadow-lg transition-all cursor-pointer"
                >
                  <div className={cn("h-10 w-10 rounded-full flex items-center justify-center font-black text-white shadow-md", i === 0 ? "bg-[#f5ac0a]" : "bg-[#2878a8]/40")}>{i + 1}</div>
                  <img src={emp.photo_url} className="h-14 w-14 rounded-2xl object-cover border-2 border-slate-50" />
                  <div className="flex-1">
                    <p className="font-black text-[#2878a8] uppercase text-lg">{emp.name}</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{emp.role}</p>
                  </div>
                  <div className="text-right flex items-center gap-4">
                    <div>
                      <div className="flex items-center justify-end gap-1 text-[#f5ac0a]">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="font-black text-xl">{Number(emp.average_rating).toFixed(1)}</span>
                      </div>
                      <p className="text-[9px] font-bold text-slate-300 uppercase">{emp.total_votes} votos</p>
                    </div>
                  </div>
                </motion.div>

                {/* Comentarios Minimalistas Desplegables */}
                <AnimatePresence>
                  {expandedId === emp.id && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="p-4 pt-2 space-y-2 bg-slate-50/50 rounded-b-3xl mx-4 border-x border-b border-slate-100">
                        {feedbacks[emp.id]?.map((f, idx) => (
                          <div key={idx} className="bg-white p-3 rounded-2xl text-xs text-slate-600 shadow-sm border border-slate-50 flex gap-3 items-start">
                             <MessageSquare size={14} className="text-[#2878a8] mt-1 shrink-0" />
                             <p>"{f.comentario}"</p>
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
      </main>
    </div>
  )
}

function StatCard({ title, value, sub, icon }: any) {
  return (
    <Card className="border-none shadow-xl rounded-[2rem] p-6 bg-white">
      <div className="flex justify-between items-start mb-4">
        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{title}</p>
        <div className="p-2 bg-slate-50 rounded-xl">{icon}</div>
      </div>
      <p className="text-4xl font-black text-[#2878a8]">{value}</p>
      <p className="text-[10px] font-bold text-[#f5ac0a] uppercase mt-1">{sub}</p>
    </Card>
  )
}
