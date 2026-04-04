"use client"

import * as React from "react"
import useSWR from "swr"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Trophy, Users, Star, TrendingUp, LogOut, MessageSquare, ChevronDown 
} from "lucide-react"
import { useRouter } from "next/navigation"

// --- COMPONENTES LOCALES PARA EVITAR ERRORES DE IMPORTACIÓN ---
const LocalCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-slate-100 ${className}`}>{children}</div>
)

const LocalSpinner = () => (
  <div className="flex h-5 w-5 animate-spin rounded-full border-2 border-[#2878a8] border-t-transparent" />
)

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function AdminDashboard() {
  const router = useRouter()
  const [authorized, setAuthorized] = React.useState(false)
  const [expandedId, setExpandedId] = React.useState<string | null>(null)
  const [feedbacks, setFeedbacks] = React.useState<Record<string, any[]>>({})
  const [loadingFeedback, setLoadingFeedback] = React.useState<string | null>(null)

  React.useEffect(() => {
    const auth = document.cookie.split('; ').find(row => row.startsWith('admin_auth='))?.split('=')[1]
    if (auth !== "true") {
      router.push("/admin/login")
    } else {
      setAuthorized(true)
    }
  }, [router])

  const { data: employees, isLoading } = useSWR(authorized ? "/api/employees" : null, fetcher)

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
        setFeedbacks(prev => ({ ...prev, [id]: Array.isArray(data) ? data : [] }))
      } catch (e) {
        console.error("Error:", e)
      } finally {
        setLoadingFeedback(null)
      }
    }
  }

  const sortedEmployees = React.useMemo(() => {
    if (!employees || !Array.isArray(employees)) return []
    return [...employees].sort((a, b) => (b.average_rating || 0) - (a.average_rating || 0))
  }, [employees])

  const stats = React.useMemo(() => {
    if (!employees || !Array.isArray(employees)) return { totalVotes: 0, avgHotel: 0 }
    const total = employees.reduce((acc, curr) => acc + (curr.total_votes || 0), 0)
    const avg = employees.reduce((acc, curr) => acc + (curr.average_rating || 0), 0) / (employees.length || 1)
    return { totalVotes: total, avgHotel: avg }
  }, [employees])

  const handleLogout = () => {
    document.cookie = "admin_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;"
    router.push("/admin/login")
  }

  if (!authorized || isLoading) {
    return <div className="flex min-h-screen items-center justify-center bg-slate-50"><LocalSpinner /></div>
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-12 font-sans">
      <header className="sticky top-0 z-50 w-full border-b bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Trophy className="text-[#f5ac0a] h-6 w-6" />
            <div>
              <h1 className="font-serif text-xl italic text-[#2878a8]">RANKING DE SERVICIO</h1>
              <p className="text-[10px] font-black uppercase tracking-widest text-[#f5ac0a]">Hotel Rodadero Relax</p>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-[10px] font-black text-slate-400 hover:text-red-500 transition-colors uppercase">
            <LogOut className="h-4 w-4" /> Cerrar Sesión
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <LocalCard className="p-6">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Votos Totales</span>
              <Users className="h-4 w-4 text-[#2878a8]" />
            </div>
            <div className="text-3xl font-black text-[#2878a8]">{stats.totalVotes}</div>
          </LocalCard>
          
          <LocalCard className="p-6">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Promedio Hotel</span>
              <Star className="h-4 w-4 text-[#f5ac0a]" />
            </div>
            <div className="text-3xl font-black text-[#2878a8]">{stats.avgHotel.toFixed(1)}</div>
          </LocalCard>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <div className="sticky top-28 rounded-2xl overflow-hidden shadow-2xl">
              <div className="bg-[#2878a8] p-3 text-center text-[10px] font-black text-white uppercase tracking-widest">Ganador Actual</div>
              <div className="relative aspect-[3/4]">
                <img src={sortedEmployees[0]?.photo_url || ""} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2878a8] to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <p className="text-[10px] font-bold text-[#f5ac0a] uppercase tracking-widest">Primer Puesto</p>
                  <h2 className="text-2xl font-black italic uppercase">{sortedEmployees[0]?.name}</h2>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <LocalCard className="overflow-hidden">
              <div className="p-6 border-b border-slate-50">
                <h2 className="font-serif text-2xl italic text-[#2878a8]">Clasificación Detallada</h2>
              </div>
              <div className="p-6 space-y-4">
                {sortedEmployees.map((emp, i) => (
                  <div key={emp.id} className="flex flex-col">
                    <div 
                      onClick={() => toggleComments(emp.id)}
                      className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${expandedId === emp.id ? 'border-[#2878a8] bg-slate-50' : 'border-slate-100 bg-white hover:border-[#f5ac0a]/50'}`}
                    >
                      <div className="h-8 w-8 rounded-full bg-[#f5ac0a] flex items-center justify-center text-white font-black text-xs">{i + 1}</div>
                      <img src={emp.photo_url} className="h-12 w-12 rounded-full object-cover border-2 border-white shadow-sm" />
                      <div className="flex-1">
                        <h3 className="font-black text-[#2878a8] text-sm uppercase">{emp.name}</h3>
                        <p className="text-[9px] font-bold text-slate-400 uppercase">{emp.role}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-[#f5ac0a]">
                          <Star className="h-3 w-3 fill-current" />
                          <span className="font-black">{Number(emp.average_rating).toFixed(1)}</span>
                        </div>
                        <p className="text-[9px] font-black text-slate-300 uppercase">{emp.total_votes} votos</p>
                      </div>
                    </div>

                    <AnimatePresence>
                      {expandedId === emp.id && (
                        <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                          <div className="mt-2 ml-12 p-4 bg-white rounded-xl border border-slate-100 space-y-3">
                            <p className="text-[10px] font-black text-[#2878a8] uppercase tracking-widest flex items-center gap-2">
                              <MessageSquare size={12} /> Opiniones de Clientes
                            </p>
                            {loadingFeedback === emp.id ? <LocalSpinner /> : feedbacks[emp.id]?.map((f, idx) => (
                              <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                                <p className="text-xs text-slate-600 italic">"{f.comment}"</p>
                                <div className="flex justify-between mt-2 pt-2 border-t border-slate-200/50">
                                  <span className="text-[9px] font-bold text-slate-400">{new Date(f.created_at).toLocaleDateString()}</span>
                                  <span className="text-[9px] font-black text-[#f5ac0a]">CALIFICACIÓN: {f.overall_rating}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </LocalCard>
          </div>
        </div>
      </main>
    </div>
  )
}
