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
  MessageSquare,
  ChevronDown
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

// --- COMPONENTES LOCALES PARA EVITAR ERRORES DE IMPORTACIÓN ---
const LocalCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`bg-white rounded-2xl shadow-sm border border-slate-100 ${className}`}>{children}</div>
)

const LocalSpinner = () => (
  <div className="flex h-5 w-5 animate-spin rounded-full border-2 border-[#2878a8] border-t-transparent" />
)

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
  comment: string 
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
        setFeedbacks(prev => ({ ...prev, [id]: Array.isArray(data) ? data : [] }))
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

  if (!authorized) return null
  if (isLoading) return <div className="flex min-h-screen items-center justify-center bg-slate-50"><LocalSpinner /></div>

  return (
    <div className="min-h-screen bg-slate-50/50 pb-12 font-sans">
      <header className="border-b bg-white shadow-sm sticky top-0 z-10 p-4">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 border border-[#2878a8] rounded-full text-[#2878a8] hover:bg-slate-50">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-black text-[#2878a8] italic uppercase leading-none">Ranking de Servicio</h1>
              <p className="text-[10px] font-bold text-[#f5ac0a] uppercase tracking-widest">Hotel Rodadero Relax</p>
            </div>
          </div>
          <button onClick={() => { document.cookie = "admin_auth=; path=/; expires=Thu, 01 Jan 1970"; router.push("/admin/login") }} className="text-[10px] font-bold text-slate-400 hover:text-red-500 uppercase flex items-center gap-2">
            <LogOut size={14} /> Cerrar Sesión
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* GANADOR */}
          <div className="lg:col-span-1">
            <LocalCard className="overflow-hidden border-4 border-[#2878a8]/10">
              <div className="bg-[#2878a8] p-4 text-white font-serif italic text-lg text-center font-bold">Ganador Provisional</div>
              {sortedEmployees[0] && (
                <div className="relative aspect-[4/5]">
                  <img src={sortedEmployees[0].photo_url} className="h-full w-full object-cover" alt="Ganador" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2878a8] via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <p className="text-[10px] font-bold text-[#f5ac0a] uppercase">Primer Lugar</p>
                    <p className="text-2xl font-black">{sortedEmployees[0].name}</p>
                  </div>
                </div>
              )}
            </LocalCard>
          </div>

          {/* LISTA */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-[#2878a8] font-serif text-xl italic font-bold mb-4">Clasificación Detallada</h2>
            {sortedEmployees.map((emp, i) => (
              <div key={emp.id}>
                <div 
                  onClick={() => toggleComments(emp.id)}
                  className={`flex items-center gap-4 bg-white p-4 rounded-2xl border transition-all cursor-pointer ${expandedId === emp.id ? 'border-[#2878a8] shadow-md' : 'border-transparent hover:shadow-sm'}`}
                >
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center text-white font-bold ${i === 0 ? 'bg-[#f5ac0a]' : 'bg-[#2878a8]/40'}`}>{i + 1}</div>
                  <img src={emp.photo_url} className="h-12 w-12 rounded-full object-cover border" alt={emp.name} />
                  <div className="flex-1">
                    <p className="font-bold text-[#2878a8] uppercase text-sm">{emp.name}</p>
                    <p className="text-[9px] text-slate-400 font-bold uppercase">{emp.role}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-[#f5ac0a] font-black">
                      <Star size={14} fill="currentColor" /> {emp.average_rating.toFixed(1)}
                    </div>
                    <p className="text-[8px] text-slate-400 font-bold uppercase">{emp.total_votes} votos</p>
                  </div>
                  <ChevronDown size={16} className={`text-slate-300 transition-transform ${expandedId === emp.id ? 'rotate-180' : ''}`} />
                </div>

                <AnimatePresence>
                  {expandedId === emp.id && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="mt-2 ml-12 p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-3">
                        <p className="text-[9px] font-black text-[#2878a8] uppercase flex items-center gap-2"><MessageSquare size={10} /> Comentarios</p>
                        {loadingFeedback === emp.id ? <LocalSpinner /> : feedbacks[emp.id]?.length > 0 ? (
                          feedbacks[emp.id].map((f, idx) => (
                            <div key={idx} className="bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                              <p className="text-xs text-slate-600 italic">"{f.comment}"</p>
                              <p className="text-[8px] text-slate-400 mt-2 font-bold uppercase">{new Date(f.created_at).toLocaleDateString()}</p>
                            </div>
                          ))
                        ) : <p className="text-xs text-slate-400 italic">Sin comentarios.</p>}
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
