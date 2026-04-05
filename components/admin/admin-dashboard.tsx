"use client"

export const dynamic = 'force-dynamic';

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

// --- COMPONENTES LOCALES (Blindados contra errores de importación) ---
const CardLocal = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`bg-white rounded-2xl shadow-sm border border-slate-100 ${className}`}>{children}</div>
)

const SpinnerLocal = () => (
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
  comentario?: string
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

  if (!authorized) return <div className="min-h-screen bg-slate-50" />
  if (isLoading) return <div className="flex min-h-screen items-center justify-center bg-slate-50"><SpinnerLocal /></div>

  return (
    <div className="min-h-screen bg-slate-50/50 pb-12">
      <header className="border-b bg-white shadow-sm sticky top-0 z-10 p-4">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 border border-[#2878a8] rounded-full text-[#2878a8]">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-xl font-black text-[#2878a8] uppercase italic leading-none">Admin Panel</h1>
              <p className="text-[10px] font-bold text-[#f5ac0a] uppercase mt-1">Hotel Rodadero Relax</p>
            </div>
          </div>
          <button 
            onClick={() => { document.cookie = "admin_auth=; path=/; expires=Thu, 01 Jan 1970"; router.push("/admin/login") }} 
            className="text-[10px] font-bold text-slate-400 hover:text-red-500 uppercase flex items-center gap-2"
          >
            <LogOut size={14} /> Salir
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-4 md:grid-cols-2 mb-8">
          <div className="bg-white p-6 rounded-2xl border-b-4 border-[#2878a8] shadow-sm">
            <p className="text-[10px] font-black uppercase text-slate-400">Total Votos</p>
            <div className="text-3xl font-black text-[#2878a8]">{stats.totalVotes}</div>
          </div>
          <div className="bg-white p-6 rounded-2xl border-b-4 border-[#2878a8] shadow-sm">
            <p className="text-[10px] font-black uppercase text-slate-400">Promedio</p>
            <div className="text-3xl font-black text-[#2878a8]">{stats.avgRating.toFixed(1)} ★</div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <CardLocal className="overflow-hidden border-4 border-[#2878a8]/10 shadow-lg">
              <div className="bg-[#2878a8] p-2 text-white text-center text-xs font-bold uppercase tracking-widest">Líder</div>
              {sortedEmployees[0] && (
                <div className="relative aspect-square">
                  <img src={sortedEmployees[0].photo_url} className="h-full w-full object-cover" alt="Ganador" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2878a8] to-transparent opacity-60" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <p className="text-lg font-black leading-tight">{sortedEmployees[0].name}</p>
                  </div>
                </div>
              )}
            </CardLocal>
          </div>

          <div className="lg:col-span-2 space-y-3">
            {sortedEmployees.map((emp, i) => (
              <div key={emp.id}>
                <div 
                  onClick={() => toggleComments(emp.id)}
                  className={`flex items-center gap-4 bg-white p-4 rounded-2xl border transition-all cursor-pointer ${expandedId === emp.id ? 'border-[#2878a8] shadow-md' : 'border-slate-100 hover:border-[#2878a8]/30'}`}
                >
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${i === 0 ? 'bg-[#f5ac0a]' : 'bg-[#2878a8]/40'}`}>{i + 1}</div>
                  <img src={emp.photo_url} className="h-10 w-10 rounded-full object-cover" alt={emp.name} />
                  <div className="flex-1">
                    <p className="font-bold text-[#2878a8] uppercase text-sm leading-none">{emp.name}</p>
                    <p className="text-[9px] text-slate-400 font-bold uppercase">{emp.role}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-[#f5ac0a] text-sm">{emp.average_rating.toFixed(1)} ★</p>
                    <p className="text-[8px] text-slate-400 uppercase">{emp.total_votes} votos</p>
                  </div>
                  <ChevronDown size={14} className={`text-slate-300 transition-transform ${expandedId === emp.id ? 'rotate-180' : ''}`} />
                </div>

                <AnimatePresence>
                  {expandedId === emp.id && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="mt-2 ml-12 p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-3">
                        <p className="text-[9px] font-black text-[#2878a8] uppercase flex items-center gap-2"><MessageSquare size={10} /> 5 Comentarios Recientes</p>
                        {loadingFeedback === emp.id ? <SpinnerLocal /> : feedbacks[emp.id]?.length > 0 ? (
                          feedbacks[emp.id].slice(0, 5).map((f, idx) => (
                            <div key={idx} className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                              <p className="text-xs text-slate-600 italic">"{f.comentario || f.comment || "Sin texto"}"</p>
                              <p className="text-[8px] text-slate-400 mt-1 font-bold uppercase">{new Date(f.created_at).toLocaleDateString()}</p>
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
