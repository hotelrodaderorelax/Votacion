"use client"

import * as React from "react"
import useSWR from "swr"
import { motion } from "framer-motion"
import { 
  Trophy, 
  Users, 
  Star, 
  TrendingUp,
  Award,
  Medal,
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

  // --- CONTROL DE ACCESO ---
  React.useEffect(() => {
    const auth = localStorage.getItem("admin_auth")
    if (auth !== "true") {
      router.push("/admin/login")
    } else {
      setAuthorized(true)
    }
  }, [router])

  const { data: employees, isLoading, error } = useSWR<Employee[]>(
    authorized ? "/api/employees" : null, // Solo hace el fetch si está autorizado
    fetcher,
    { refreshInterval: 5000 }
  )

  // --- PROCESAMIENTO DE DATOS ---
  const processedEmployees = React.useMemo(() => {
    if (!employees) return []
    
    let list = [...employees]
    
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

  // --- MANEJO DE ESTADOS DE CARGA ---
  if (!authorized) return null

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Spinner className="h-10 w-10 text-[#2878a8]" />
      </div>
    )
  }

  const handleLogout = () => {
    localStorage.removeItem("admin_auth")
    router.push("/admin/login")
  }

  return (
    <div className="min-h-screen bg-slate-50/50">
      <header className="border-b bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="outline" size="icon" className="rounded-full border-[#2878a8] text-[#2878a8]">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="font-serif text-3xl font-black text-[#2878a8] italic uppercase">
                  Ranking de Servicio
                </h1>
                <p className="text-sm font-bold text-[#f5ac0a] uppercase tracking-widest">
                  Hotel Rodadero Relax
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
                <Button 
                  variant="ghost" 
                  onClick={handleLogout}
                  className="text-slate-400 hover:text-destructive gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Salir
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
             <Card className="overflow-hidden border-4 border-[#2878a8]/10 shadow-xl">
                <CardHeader className="bg-[#2878a8] text-white">
                   <CardTitle className="font-serif italic tracking-tight">Ganador Provisional</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                   {sortedEmployees[0] && (
                     <div className="relative aspect-square">
                        <img 
                          src={sortedEmployees[0].photo_url} 
                          className="h-full w-full object-cover"
                          alt={sortedEmployees[0].name}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#2878a8] via-transparent to-transparent" />
                        <div className="absolute bottom-4 left-4 text-white">
                           <p className="text-xs font-bold uppercase tracking-widest text-[#f5ac0a]">Primer Lugar</p>
                           <p className="text-2xl font-black">{sortedEmployees[0].name}</p>
                        </div>
                     </div>
                   )}
                </CardContent>
             </Card>
          </div>

          <div className="lg:col-span-2">
            <Card className="border-none shadow-xl">
              <CardHeader>
                <CardTitle className="text-[#2878a8] font-serif text-2xl">Clasificación Detallada</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sortedEmployees.map((emp, i) => (
                    <div key={emp.id} className="flex items-center gap-4 rounded-2xl border p-4 transition-all hover:bg-slate-50">
                      <div className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-full font-black text-white shadow-lg",
                        i === 0 ? "bg-[#f5ac0a] scale-110" : i === 1 ? "bg-slate-400" : i === 2 ? "bg-amber-700" : "bg-[#2878a8]/50"
                      )}>
                        {i + 1}
                      </div>
                      <div className="h-12 w-12 overflow-hidden rounded-full border-2 border-[#2878a8]/20">
                        <img src={emp.photo_url} className="h-full w-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <p className="font-black text-[#2878a8]">{emp.name}</p>
                        <p className="text-xs font-bold text-slate-400 uppercase">{emp.role}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center justify-end gap-1 text-[#f5ac0a]">
                          <Star className="h-4 w-4 fill-current" />
                          <span className="font-black text-lg">{emp.average_rating.toFixed(1)}</span>
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">{emp.total_votes} votos</p>
                      </div>
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

function StatCard({ title, value, sub, icon }: { title: string, value: any, sub: string, icon: any }) {
  return (
    <Card className="border-b-4 border-b-[#2878a8] shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-400">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-black text-[#2878a8]">{value}</div>
        <p className="text-[10px] font-bold uppercase text-[#f5ac0a]">{sub}</p>
      </CardContent>
    </Card>
  )
}
