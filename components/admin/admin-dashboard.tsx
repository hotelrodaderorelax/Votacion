"use client"

import * as React from "react"
import useSWR from "swr"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Trophy, Users, Star, TrendingUp, LogOut, MessageSquare, ChevronDown 
} from "lucide-react"
import { useRouter } from "next/navigation"

// --- COMPONENTES LOCALES (Sustituyen a la carpeta UI para evitar errores de importación) ---
const LocalCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-slate-100 ${className}`}>{children}</div>
)

const LocalSpinner = () => (
  <div className="flex h-10 w-10 animate-spin rounded-full border-4 border-[#2878a8] border-t-transparent" />
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
        console.error("Error cargando comentarios:", e)
      } finally {
        setLoadingFeedback(null)
      }
    }
  }

  const sortedEmployees = React.useMemo(() => {
    if (!employees || !Array.isArray(employees)) return []
    return [...employees].sort((a, b) => (b.average_rating || 0) - (a.average_rating || 0))
  }, [employees])

  if (!authorized || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <LocalSpinner />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-12 font-sans">
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md px-6">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <Trophy className="text-[#f5ac0a] h-6 w-6" />
            <h1 className="font-serif text-xl italic text-[#2878a8]">RANKING DE SERVICIO</h1>
          </div>
          <button 
            onClick={() => {
              document.cookie = "admin_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;"
              router.push("/admin/login")
            }}
            className="text-[10px] font-black uppercase text-slate-400 hover:text-red-500 flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" /> Cerrar Sesión
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <LocalCard className="p-6">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Promedio General</p>
            <div className="text-3xl font-black text-[#2878a8]">
              {(sortedEmployees.reduce((acc, curr) => acc + (curr.average_rating || 0), 0) / (sortedEmployees.length || 1)).toFixed(1)}
            </div>
          </LocalCard>
          <LocalCard className="p-6">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Votos Registrados</p>
            <div className="text-3xl font-black text-[#2878a8]">
              {sortedEmployees.reduce((acc, curr) => acc + (curr.total_votes || 0), 0)}
            </div>
          </LocalCard>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-1">
             <LocalCard className="overflow-hidden sticky top-28 shadow-xl">
                <div className="bg-[#2878a8] p-3 text-center text-[10px] font-black text-white uppercase italic">Líder del Mes</div>
                <div className="relative aspect-[3/4]">
                  <img src={sortedEmployees[0]?.photo_url} className="h-full w-full object-cover" alt="Ganador" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2878a8] via-transparent" />
                  <div className="absolute bottom-6 left-6 text-white">
                    <h2 className="text-2xl font-black uppercase italic">{sortedEmployees[0]?.name}</h2>
                    <p className="text-[#f5ac0a] text-xs font-bold uppercase tracking-widest">Primer Lugar</p>
                  </div>
                </div>
             </LocalCard>
          </div>

          <div className="lg:col-span-2">
            <LocalCard className="p-6">
              <h2 className="font-serif text-2xl italic text-[#2878a8] mb-6">Clasificación Detallada</h2>
              <div className="space-y-4">
                {sortedEmployees.map((emp, i) => (
                  <div key={emp.id}>
                    <div 
                      onClick={() => toggleComments(emp.id)}
                      className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${expandedId === emp.id ? 'border-[#2878a8] bg-slate-50' : 'border-slate-100 bg-white hover:border-[#f5ac0a]'}`}
                    >
                      <div className="h-8 w-8 rounded-full bg-[#f5ac0a] flex items-center justify-center text-white font-black text-xs">{i + 1}</div>
                      <img src={emp.photo_url} className="h-12 w-12 rounded-full object-cover border-2 border-white shadow-sm" />
                      <div className="flex-1">
                        <h3 className="font-black text-[#2878a8] text-sm uppercase">{emp.name}</h3>
                        <p className="text-[9px] font-bold text-slate-400 uppercase">{emp.role}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-[#f5ac0a] justify-end">
                          <Star className="h-3 w-3 fill-current" />
                          <span className="font-black text-lg">{Number(emp.average_rating || 0).toFixed(1)}</span>
                        </div>
                        <p className="text-[9px] font-black text-slate-300 uppercase">{emp.total_votes || 0} votos</p>
                      </div>
                      <ChevronDown className={`h-4 w-4 text-slate-300 transition-transform ${expandedId === emp.id ? 'rotate-180' : ''}`} />
                    </div>

                    <AnimatePresence>
                      {expandedId === emp.id && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                          <div className="mt-2 ml-12 p-4 bg-white border border-slate-100 rounded-xl space-y-3 shadow-inner">
                            <p className="text-[10px] font-black text-[#2878a8] uppercase flex items-center gap-2"><MessageSquare size={12} /> Comentarios Recientes</p>
                            {loadingFeedback === emp.id ? <div className="p-4 flex justify-center"><LocalSpinner /></div> : feedbacks[emp.id]?.length > 0 ? (
                              feedbacks[emp.id].map((f, idx) => (
                                <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                                  <p className="text-xs text-slate-600 italic">"{f.comment}"</p>
                                  <div className="flex justify-between mt-2 pt-2 border-t border-slate-200/50">
                                    <span className="text-[9px] font-bold text-slate-400">{new Date(f.created_at).toLocaleDateString()}</span>
                                    <span className="text-[9px] font-black text-[#f5ac0a]">CALIFICACIÓN: {f.overall_rating}</span>
                                  </div>
                                </div>
                              ))
                            ) : <p className="text-[10px] text-slate-400 uppercase text-center py-4">No hay comentarios aún</p>}
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
