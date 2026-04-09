

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
  Calendar,
  Download
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"
import * as XLSX from "xlsx"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

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
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
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

  const { data: employees, isLoading } = useSWR<Employee[]>(
    authorized ? `/api/employees?month=${selectedMonth}` : null,
    fetcher,
    { refreshInterval: 5000 }
  )

  const { data: hotelResponse, isLoading: loadingHotel } = useSWR(
    authorized && view === 'hotel' ? `/api/hotel-feedback?month=${selectedMonth}` : null,
    fetcher
  )

  const hotelData = hotelResponse?.data || []
  const hotelStats = hotelResponse?.stats || { limpieza: "0.0", infraestructura: "0.0", atencion: "0.0" }

  const processedEmployees = React.useMemo(() => {
    if (!employees) return []
    return employees.map(emp => ({
      ...emp,
      display_photo: getEmployeePhoto(emp.name),
      total_votes: Number(emp.total_votes) || 0,
      average_rating: Number(emp.average_rating) || 0
    }))
  }, [employees])

  const sortedEmployees = React.useMemo(() => {
    return [...processedEmployees].sort((a, b) => {
      if (b.average_rating !== a.average_rating) return b.average_rating - a.average_rating;
      return b.total_votes - a.total_votes;
    })
  }, [processedEmployees])

  const stats = React.useMemo(() => {
    const totalVotes = processedEmployees.reduce((sum, e) => sum + e.total_votes, 0)
    const validEmps = processedEmployees.filter(e => e.total_votes > 0)
    const avgRating = validEmps.length > 0 ? processedEmployees.reduce((sum, e) => sum + e.average_rating, 0) / validEmps.length : 0
    return { totalVotes, avgRating, topPerformers: processedEmployees.filter(e => e.average_rating >= 4.5).length }
  }, [processedEmployees])

  const exportToExcel = () => {
    let dataToExport = []
    let fileName = ""

    if (view === 'employees') {
      fileName = `Ranking_Empleados_${selectedMonth}.xlsx`
      dataToExport = sortedEmployees.map((emp, index) => ({
        Ranking: index + 1,
        Nombre: emp.name,
        Cargo: emp.role,
        Votos: emp.total_votes,
        Puntaje: emp.average_rating.toFixed(1),
        Mes: selectedMonth
      }))
    } else {
      fileName = `Reporte_Hotel_${selectedMonth}.xlsx`
      dataToExport = hotelData.map(h => ({
        Fecha: new Date(h.created_at).toLocaleDateString(),
        Limpieza: h.habitacion_limpieza,
        Infraestructura: h.instalaciones_estado,
        Atencion: h.registro_amabilidad,
        Comentarios: h.mejoras_sugerencias || h.comentario || "N/A"
      }))
    }

    const worksheet = XLSX.utils.json_to_sheet(dataToExport)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Resultados")
    XLSX.writeFile(workbook, fileName)
  }

  const toggleComments = async (id: string) => {
    if (expandedId === id) { setExpandedId(null); return; }
    setExpandedId(id)
    if (!feedbacks[id]) {
      setLoadingFeedback(id)
      try {
        const res = await fetch(`/api/employee-feedback?id=${id}&month=${selectedMonth}`)
        const data = await res.json()
        setFeedbacks(prev => ({ ...prev, [id]: Array.isArray(data) ? data : [] }))
      } catch (error) { console.error(error) } finally { setLoadingFeedback(null) }
    }
  }

  if (!authorized) return null

  return (
    <div className="min-h-screen bg-slate-50/50 pb-12">
      <header className="border-b bg-white shadow-sm sticky top-0 z-20">
        <div className="mx-auto max-w-7xl px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <Link href="/"><Button variant="outline" size="icon" className="rounded-full border-[#2878a8] text-[#2878a8] hover:bg-[#2878a8] hover:text-white"><ArrowLeft className="h-5 w-5" /></Button></Link>
            <div>
              <h1 className="font-serif text-2xl font-black text-[#2878a8] italic uppercase leading-none">Admin Relax</h1>
              <div className="flex items-center gap-3 mt-1">
                 <div className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded border border-slate-200">
                    <Calendar size={12} className="text-[#f5ac0a]" />
                    <input 
                      type="month" 
                      value={selectedMonth}
                      onChange={(e) => { setSelectedMonth(e.target.value); setFeedbacks({}); }}
                      className="text-[10px] font-bold text-[#2878a8] uppercase bg-transparent border-none focus:ring-0 cursor-pointer p-0"
                    />
                 </div>
                 <Button onClick={exportToExcel} variant="ghost" className="h-7 px-2 text-[9px] font-black uppercase text-[#2878a8] border border-[#2878a8]/20 hover:bg-[#2878a8]/5">
                    <Download size={12} className="mr-1" /> Excel
                 </Button>
              </div>
            </div>
          </div>

          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button onClick={() => setView('hotel')} className={cn("px-4 py-2 rounded-lg text-[10px] font-bold uppercase transition-all", view === 'hotel' ? "bg-white text-[#2878a8] shadow-sm" : "text-slate-400")}>EL HOTEL</button>
            <button onClick={() => setView('employees')} className={cn("px-4 py-2 rounded-lg text-[10px] font-bold uppercase transition-all", view === 'employees' ? "bg-white text-[#2878a8] shadow-sm" : "text-slate-400")}>EMPLEADOS</button>
          </div>

          <Button variant="ghost" onClick={() => { document.cookie = "admin_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;"; router.push("/admin/login") }} className="text-slate-400 font-bold text-[10px] uppercase group">
            <LogOut size={16} className="group-hover:text-red-500 transition-colors" />
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">
        {/* STATS SECTION */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <StatCard title={view === 'hotel' ? "Limpieza" : "Votos Totales"} value={view === 'hotel' ? hotelStats.limpieza : stats.totalVotes} sub={view === 'hotel' ? "Promedio Estrellas" : "Mes Actual"} icon={<Sparkles className="text-[#2878a8]" />} />
          <StatCard title={view === 'hotel' ? "Instalaciones" : "Promedio General"} value={view === 'hotel' ? hotelStats.infraestructura : stats.avgRating.toFixed(1)} sub="Puntaje" icon={<Building2 className="text-[#f5ac0a]" />} />
          <StatCard title={view === 'hotel' ? "Atención" : "Top Desempeño"} value={view === 'hotel' ? hotelStats.atencion : stats.topPerformers} sub="Rendimiento" icon={<Clock className="text-green-500" />} />
        </div>

        {isLoading ? (
          <div className="flex h-64 items-center justify-center"><Spinner className="h-8 w-8 text-[#2878a8]" /></div>
        ) : (
          <AnimatePresence mode="wait">
            {view === 'employees' ? (
              <motion.div key="employees" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid gap-8 lg:grid-cols-3">
                <div className="lg:col-span-1">
                  <Card className="overflow-hidden border-4 border-[#2878a8]/10 shadow-2xl sticky top-24">
                    <div className="bg-[#2878a8] p-3 text-white font-black italic text-center uppercase text-sm tracking-tighter">Empleado Estrella</div>
                    {sortedEmployees[0] ? (
                      <div className="relative aspect-[4/5]">
                        <img src={sortedEmployees[0].display_photo} className="h-full w-full object-cover" alt="Líder" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#2878a8] via-transparent to-transparent opacity-80" />
                        <div className="absolute bottom-6 left-6 text-white">
                          <p className="text-[10px] font-bold text-[#f5ac0a] uppercase mb-1 flex items-center gap-1"><Star size={10} fill="#f5ac0a"/> Ganador del Mes</p>
                          <p className="text-3xl font-black italic uppercase leading-tight">{sortedEmployees[0].name}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="p-12 text-center text-slate-300 font-bold uppercase text-xs">Sin datos este mes</div>
                    )}
                  </Card>
                </div>
                
                <div className="lg:col-span-2 space-y-4">
                  {sortedEmployees.map((emp, i) => (
                    <div key={emp.id} onClick={() => toggleComments(emp.id)} className="group flex flex-col cursor-pointer bg-white p-4 rounded-2xl border border-slate-100 hover:border-[#2878a8]/30 shadow-sm transition-all hover:shadow-md">
                      <div className="flex items-center gap-4">
                        <div className={cn("h-10 w-10 rounded-full flex items-center justify-center text-white text-xs font-black shrink-0", i === 0 ? "bg-[#f5ac0a] scale-110 shadow-lg" : "bg-[#2878a8]/40")}>{i + 1}</div>
                        <img src={emp.display_photo} className="h-14 w-14 rounded-full object-cover border-2 border-slate-100 group-hover:border-[#2878a8]/20 transition-all" />
                        <div className="flex-1 min-w-0">
                          <p className="font-black text-[#2878a8] uppercase text-lg leading-none truncate">{emp.name}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">{emp.role}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="flex items-center justify-end gap-1 text-[#f5ac0a]">
                            <Star className={cn("h-4 w-4", emp.average_rating > 0 ? "fill-current" : "text-slate-200")} />
                            <span className="font-black text-xl">{emp.average_rating.toFixed(1)}</span>
                          </div>
                          <p className="text-[9px] font-bold text-slate-400 uppercase">{emp.total_votes} votos</p>
                        </div>
                      </div>
                      
                      <AnimatePresence>
                        {expandedId === emp.id && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                            <div className="mt-4 ml-14 p-4 bg-slate-50 rounded-xl space-y-2 border border-slate-100">
                              <h4 className="text-[9px] font-black text-[#2878a8] uppercase mb-2">Comentarios de Clientes:</h4>
                              {loadingFeedback === emp.id ? <Spinner className="h-4 w-4 mx-auto" /> : feedbacks[emp.id]?.length > 0 ? (
                                feedbacks[emp.id].map((f, idx) => (
                                  <div key={idx} className="bg-white p-3 rounded-lg border text-xs italic shadow-sm text-slate-600 border-l-4 border-l-[#f5ac0a]">"{f.comentario}"</div>
                                ))
                              ) : <p className="text-[9px] text-slate-400 uppercase text-center py-2">No se registraron comentarios este mes</p>}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div key="hotel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-4xl mx-auto space-y-6">
                <div className="bg-white p-6 rounded-2xl border-b-4 border-[#2878a8] shadow-xl">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-[#2878a8] font-black italic uppercase text-lg flex items-center gap-2"><MessageSquare size={18} /> Muro de Experiencias</h3>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">{hotelData.length} encuestas recibidas</span>
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    {loadingHotel ? (
                      <div className="col-span-2 py-12 flex justify-center"><Spinner /></div>
                    ) : hotelData.length > 0 ? (
                      hotelData.map((f: any, i: number) => (
                        <div key={i} className="bg-slate-50/50 p-4 rounded-xl border border-slate-100 shadow-sm hover:bg-white transition-colors">
                          <div className="flex justify-between items-start mb-3">
                             <div className="flex flex-col gap-1">
                               <span className="text-[9px] font-black text-[#2878a8] bg-white px-2 py-0.5 rounded border uppercase w-fit">Encuesta Hotel</span>
                               <span className="text-[8px] text-slate-400">{new Date(f.created_at).toLocaleDateString()}</span>
                             </div>
                             <div className="flex text-[#f5ac0a] items-center gap-1">
                               <Star size={10} fill="currentColor"/>
                               <span className="font-bold text-xs">{( ( (f.habitacion_limpieza || 0) + (f.instalaciones_estado || 0) + (f.registro_amabilidad || 0) ) / 3).toFixed(1)}</span>
                             </div>
                          </div>
                          <p className="text-xs text-slate-700 italic leading-relaxed">"{f.mejoras_sugerencias || f.comentario || "El cliente no dejó comentarios específicos."}"</p>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-2 py-12 text-center text-slate-300 font-bold uppercase">No hay comentarios de hotel para este mes</div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </main>
    </div>
  )
}

function StatCard({ title, value, sub, icon }: { title: string, value: any, sub: string, icon: any }) {
  return (
    <Card className="border-b-4 border-b-[#2878a8] shadow-lg group hover:-translate-y-1 transition-transform">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-[10px] font-black uppercase text-slate-400 tracking-wider">{title}</CardTitle>
        <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-[#2878a8]/5 transition-colors">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-black text-[#2878a8] tabular-nums">{value}</div>
        <p className="text-[10px] font-bold uppercase text-[#f5ac0a] mt-2 flex items-center gap-1">
          <div className="h-1 w-1 rounded-full bg-[#f5ac0a]" /> {sub}
        </p>
      </CardContent>
    </Card>
  )
}
