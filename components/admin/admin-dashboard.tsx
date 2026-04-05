
"use client"

import * as React from "react"
import useSWR from "swr"
import { motion } from "framer-motion"
import { 
  Trophy, 
  Users, 
  Star, 
  TrendingUp,
  ArrowLeft,
  LogOut
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

export function AdminDashboard() {
  const router = useRouter()
  const [authorized, setAuthorized] = React.useState(false)

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
    
    if (auth !== "true") {
      router.push("/admin/login")
    } else {
      setAuthorized(true)
    }
  }, [router])

  // --- 2. CARGA DE DATOS (Solo si está autorizado) ---
  const { data: employees, isLoading } = useSWR<Employee[]>(
    authorized ? "/api/employees" : null,
    fetcher,
    { refreshInterval: 5000 }
  )

  // --- 3. PROCESAMIENTO DE EMPLEADOS ---
  const processedEmployees = React.useMemo(() => {
    if (!employees) return []
    
    let list = [...employees]
    
    // Aseguramos que Lexilis esté presente aunque no haya votos aún
    const lexilisExists = list.find(e => e.name.includes("Lexilis"))
    if (!lexilisExists) {
      list.push({
        id: "235250d9-d03b-4288-82c8-a0d53e3c7393",
        name: "Lexilis Mejía",
        role: "Recepcionista Elite",
        department: "recepción",
        photo_url: "/Lexilis Mejia.jpeg",
        total_votes: 0,
        average_rating: 0
      })
    }

    return list.map(emp => ({
      ...emp,
      photo_url: emp.name.includes("Lexilis") ? "/Lexilis Mejia.jpeg" : emp.photo_url,
      total_votes: Number(emp.total_votes) || 0,
      average_rating: Number(emp.average_rating) || 0
    }))
  }, [employees])

  const sortedEmployees = React.useMemo(() => {
    return [...processedEmployees].sort((a, b) => {
      if (b.average_rating !== a.average_rating) {
        return b.average_rating - a.average_rating
      }
      return b.total_votes - a.total_votes
    })
  }, [processedEmployees])

  const stats = React.useMemo(() => {
    const totalVotes = processedEmployees.reduce((sum, e) => sum + e.total_votes, 0)
    const employeesWithVotes = processedEmployees.filter(e => e.total_votes > 0)
    
    const avgRating = employeesWithVotes.length > 0 
      ? employeesWithVotes.reduce((sum, e) => sum + e.average_rating, 0) / employeesWithVotes.length 
      : 0
      
    const topPerformers = processedEmployees.filter(e => e.average_rating >= 4.5 && e.total_votes > 0).length
    
    return { totalVotes, avgRating, topPerformers }
  }, [processedEmployees])

  // --- 4. ACCIONES ---
  const handleLogout = () => {
    document.cookie = "admin_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    router.push("/admin/login")
  }

  // --- 5. RENDERIZADO ---
  if (!authorized) return null

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Spinner className="h-10 w-10 text-[#2878a8]" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-12">
      <header className="border-b bg-white shadow-sm sticky top-0 z-10">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="outline" size="icon" className="rounded-full border-[#2878a8] text-[#2878a8]">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="font-serif text-3xl font-black text-[#2878a8] italic uppercase leading-none">
                  Ranking de Servicio
                </h1>
                <p className="text-sm font-bold text-[#f5ac0a] uppercase tracking-widest mt-1">
                  Hotel Rodadero Relax
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                onClick={handleLogout}
                className="text-slate-400 hover:text-red-500 gap-2 font-bold text-xs uppercase tracking-tighter"
              >
                <LogOut className="h-4 w-4" />
                Cerrar Sesión
              </Button>
              <Trophy className="h-10 w-10 text-[#f5ac0a] animate-pulse" />
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-6 md:grid-cols-3">
          <StatCard title="Votos Totales" value={stats.totalVotes} sub="votos este mes" icon={<Users className="text-[#2878a8]" />} />
          <StatCard title="Promedio Hotel" value={stats.avgRating.toFixed(1)} sub="estrellas" icon={<Star className="text-[#f5ac0a] fill-[#f5ac0a]" />} />
          <StatCard title="Elite" value={stats.topPerformers} sub="empleados top" icon={<TrendingUp className="text-green-500" />} />
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-1">
             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
               <Card className="overflow-hidden border-4 border-[#2878a8]/10 shadow-2xl">
                  <CardHeader className="bg-[#2878a8] text-white">
                     <CardTitle className="font-serif italic tracking-tight text-xl">Ganador Provisional</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                     {sortedEmployees[0] && (
                       <div className="relative aspect-[4/5]">
                          <img 
                            src={sortedEmployees[0].photo_url} 
                            className="h-full w-full object-cover"
                            alt={sortedEmployees[0].name}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#2878a8] via-transparent to-transparent" />
                          <div className="absolute bottom-6 left-6 text-white">
                             <p className="text-xs font-bold uppercase tracking-widest text-[#f5ac0a] mb-1">Primer Lugar</p>
                             <p className="text-3xl font-black">{sortedEmployees[0].name}</p>
                             <div className="flex items-center gap-2 mt-2">
                               <Star className="h-5 w-5 fill-[#f5ac0a] text-[#f5ac0a]" />
                               <span className="text-xl font-bold">{sortedEmployees[0].average_rating.toFixed(1)}</span>
                             </div>
                          </div>
                       </div>
                     )}
                  </CardContent>
               </Card>
             </motion.div>
          </div>

          <div className="lg:col-span-2">
            <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="border-b border-slate-100">
                <CardTitle className="text-[#2878a8] font-serif text-2xl italic">Clasificación Detallada</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {sortedEmployees.map((emp, i) => (
                    <motion.div 
                      key={emp.id} 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center gap-4 rounded-2xl border bg-white p-4 transition-all hover:shadow-md hover:border-[#2878a8]/30"
                    >
                      <div className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-black text-white shadow-lg",
                        i === 0 ? "bg-[#f5ac0a] scale-110" : i === 1 ? "bg-slate-400" : i === 2 ? "bg-amber-700" : "bg-[#2878a8]/40"
                      )}>
                        {i + 1}
                      </div>
                      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full border-2 border-[#2878a8]/10 shadow-inner">
                        <img src={emp.photo_url} className="h-full w-full object-cover" alt={emp.name} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-black text-[#2878a8] truncate text-lg">{emp.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{emp.role} • {emp.department}</p>
                      </div>
                      <div className="text-right shrink-0 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                        <div className="flex items-center justify-end gap-1 text-[#f5ac0a]">
                          <Star className="h-4 w-4 fill-current" />
                          <span className="font-black text-xl">{emp.average_rating.toFixed(1)}</span>
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase leading-none">{emp.total_votes} votos</p>
                      </div>
                    </motion.div>
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

function StatCard({ title, value, sub, icon }: { title: string, value: any, sub: string, icon: any }) {
  return (
    <Card className="border-b-4 border-b-[#2878a8] shadow-lg hover:translate-y-[-2px] transition-transform">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-400">{title}</CardTitle>
        <div className="p-2 bg-slate-50 rounded-lg">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-black text-[#2878a8]">{value}</div>
        <p className="text-[10px] font-bold uppercase text-[#f5ac0a] mt-1">{sub}</p>
      </CardContent>
    </Card>
  )
}
