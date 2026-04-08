"use client"

import * as React from "react"
import useSWR from "swr"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Star,  
  ArrowLeft,
  LogOut,
  MessageSquare,
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

const fetcher = (url: string) => fetch(url).then((res) => {
  if (!res.ok) throw new Error('Error al cargar datos');
  return res.json();
})

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

  // SWR mejorado con manejo de errores para evitar el crash del .map
  const { data: employees, error, isLoading } = useSWR<Employee[]>(
    authorized ? `/api/employees?month=${selectedMonth}` : null,
    fetcher,
    { refreshInterval: 5000, fallbackData: [] } // Evita que 'employees' sea undefined
  )

  const processedEmployees = React.useMemo(() => {
    // Si no es un array (por error de API), devolvemos lista vacía
    if (!Array.isArray(employees)) return []
    return employees.map(emp => ({
      ...emp,
      display_photo: getEmployeePhoto(emp.name),
      total_votes: Number(emp.total_votes) || 0,
      average_rating: Number(emp.average_rating) || 0
    }))
  }, [employees])

  const sortedEmployees = React.useMemo(() => {
    return [...processedEmployees].sort((a, b) => {
      if (b.average_rating !== a.average_rating) {
        return b.average_rating - a.average_rating;
      }
      return b.total_votes - a.total_votes; // Desempate por votos
    })
  }, [processedEmployees])

  const stats = React.useMemo(() => {
    const totalVotes = processedEmployees.reduce((sum, e) => sum + e.total_votes, 0)
    const validEmps = processedEmployees.filter(e => e.total_votes > 0)
    const avgRating = validEmps.length > 0 
      ? processedEmployees.reduce((sum, e) => sum + e.average_rating, 0) / validEmps.length 
      : 0
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
              <div className="flex items-center gap-2 mt-1 bg-slate-50 px-2 py-1 rounded-md border border-slate-200">
                 <Calendar size={12} className="text-[#f5ac0a]" />
                 <input 
                  type="month" 
                  value={selectedMonth}
                  onChange={(e) => { setSelectedMonth(e.target.value); setFeedbacks({}); }}
                  className="text-[10px] font-bold text-[#2878a8] uppercase bg-transparent border-none focus:ring-0 cursor-pointer outline-none"
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
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-xs font-bold uppercase text-center">
            Error al sincronizar con Supabase. Verifica la conexión.
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <StatCard title="Votos del Mes" value={stats.totalVotes} sub="Total" icon={<Sparkles className="text-[#2878a8]" />} />
          <StatCard title="Promedio" value={stats.avgRating.toFixed(1)} sub="Estrellas" icon={<Building2 className="text-[#f5ac0a]" />} />
          <StatCard title="Elite" value={stats.topPerformers} sub="Rendimiento" icon={<Clock className="text-green-500" />} />
        </div>

        <AnimatePresence mode="wait">
          {processedEmployees.length > 0 ? (
            <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid gap-8 lg:grid-cols-3">
               {/* Aquí va tu componente de Ranking y Lista que ya tenías */}
               {/* ... (Se mantiene igual a tu versión anterior) */}
            </motion.div>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
              <p className="text-slate-400 font-bold uppercase text-xs">No hay actividad registrada para este mes</p>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}

function StatCard({ title, value, sub, icon }: { title: string, value: any, sub: string, icon: any }) {
  return (
    <Card className="border-b-4 border-b-[#2878a8] shadow-lg">
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
