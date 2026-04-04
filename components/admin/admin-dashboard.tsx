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

  const { data: employees, isLoading } = useSWR("/api/employees", fetcher, { refreshInterval: 5000 })

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
    <div className="min-h-screen bg-slate-50 pb-12">
      {/* HEADER ORIGINAL */}
      <header className="border-b bg-white shadow-sm sticky top-0 z-10">
        <div className="mx-auto max-w-7xl px-4 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/"><Button variant="outline" size="icon" className="rounded-full border-[#2878a8] text-[#2878a8]"><ArrowLeft className="h-5 w-5" /></Button></Link>
            <div>
              <h1 className="font-serif text-3xl font-black text-[#2878a8] italic uppercase leading-none">Ranking de Servicio</h1>
              <p className="text-sm font-bold text-[#f5ac0a] uppercase tracking-widest mt-1">Hotel Rodadero Relax</p>
            </div>
          </div>
          <Button variant="ghost" onClick={() => { document.cookie = "admin_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;"; router.push("/admin/login"); }} className="text-slate-400 hover:text-red-500 gap-2 font-bold text-xs uppercase tracking-tighter">
            <LogOut className="h-4 w-4" /> Cerrar Sesión
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">
        {/* STAT CARDS ORIGINALES */}
        <div className="grid gap-6 md:grid-cols-3 mb-12">
          <StatCard title="Votos Totales" value={sortedEmployees.reduce((s, e) => s + e.total_votes, 0)} sub="votos este mes" icon={<Users className="text-[#2878a8]" />} />
          <StatCard title="Promedio Hotel" value="5.0" sub="estrellas" icon={<Star className="text-[#f5ac0a] fill-[#f5ac0a]" />} />
          <StatCard title="Elite" value={sortedEmployees.filter(e => e.average_rating >= 4.5).length} sub="empleados top" icon={<TrendingUp className="text-green-500" />} />
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* GANADOR PROVISIONAL (Estilo original) */}
          <div className="lg:col-span-1">
            {sortedEmployees[0] && (
              <Card className="overflow-hidden border-4 border-[#2878a8]/10 shadow-2xl">
                <CardHeader className="bg-[#2878a8] text-white"><CardTitle className="font-serif italic tracking-tight text-xl">Ganador Provisional</CardTitle></CardHeader>
                <CardContent className="p-0">
                  <div className="relative aspect-[4/5]">
                    <img src={sortedEmployees[0].photo_url} className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#2878a8] via-transparent to-transparent" />
                    <div className="absolute bottom-6 left-6 text-white">
                      <p className="text-xs font-bold uppercase tracking-widest text-[#f5ac0a] mb-1">Primer Lugar</p>
                      <p className="text-3xl font-black">{sortedEmployees[0].name}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* CLASIFICACIÓN DETALLADA (Estilo original + toggle de comentarios) */}
          <div className="lg:col-span-2">
            <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="border-b border-slate-100"><CardTitle className="text-[#2878a8] font-serif text-2xl italic">Clasificación Detallada</CardTitle></CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {sortedEmployees.map((emp, i) => (
                    <div key={emp.id}>
                      <motion.div onClick={() => toggleComments(emp.id)} className="flex items-center gap-4 rounded-2xl border bg-white p-4 transition-all hover:shadow-md hover:border-[#2878a8]/30 cursor-pointer">
                        <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-black text-white shadow-lg", i === 0 ? "bg-[#f5ac0a]" : "bg-[#2878a8]/40")}>{i + 1}</div>
                        <img src={emp.photo_url} className="h-14 w-14 rounded-full object-cover border-2 border-[#2878a8]/10" />
                        <div className="flex-1 min-w-0">
                          <p className="font-black text-[#2878a8] truncate text-lg">{emp.name}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{emp.role}</p>
                        </div>
                        <div className="text-right bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                          <div className="flex items-center justify-end gap-1 text-[#f5ac0a]"><Star className="h-4 w-4 fill-current" /><span className="font-black text-xl">{Number(emp.average_rating).toFixed(1)}</span></div>
                        </div>
                      </motion.div>
                      {/* Feedback oculto/desplegable */}
                      <AnimatePresence>
                        {expandedId === emp.id && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                            <div className="bg-slate-50 p-4 mt-2 rounded-xl space-y-2 border border-slate-100">
                              {feedbacks[emp.id]?.map((f, idx) => (
                                <p key={idx} className="text-xs text-slate-600 italic">"{f.comentario}"</p>
                              ))}
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
      </main>
    </div>
  )
}

function StatCard({ title, value, sub, icon }: any) {
  return (
    <Card className="border-b-4 border-b-[#2878a8] shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-400">{title}</CardTitle>
        <div className="p-2 bg-slate-50 rounded-lg">{icon}</div>
      </CardHeader>
      <CardContent><div className="text-4xl font-black text-[#2878a8]">{value}</div><p className="text-[10px] font-bold uppercase text-[#f5ac0a] mt-1">{sub}</p></CardContent>
    </Card>
  )
}
