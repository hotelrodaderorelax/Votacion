"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Star, Users, TrendingUp, ArrowLeft, LogOut, MessageSquare, Building2, Sparkles, Clock } from "lucide-react"
import Link from "next/link"

export default function AdminDashboard() {
  const [view, setView] = React.useState<"employees" | "hotel">("employees")
  const [hotelData, setHotelData] = React.useState<any>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    fetch("/api/hotel-feedback")
      .then(res => res.json())
      .then(data => {
        setHotelData(data)
        setLoading(false)
      })
  }, [])

  if (loading) return (
    <div className="flex h-screen items-center justify-center font-black text-[#2878a8] animate-pulse italic">
      SINCRONIZANDO CON SUPABASE...
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      {/* Header con estilo exclusivo */}
      <header className="flex justify-between items-center mb-10">
        <div className="flex items-center gap-4">
          <h1 className="text-[#2878a8] font-black italic uppercase text-2xl tracking-tighter">Admin Relax</h1>
        </div>
        <nav className="flex bg-white p-1 rounded-2xl shadow-sm border">
          <button 
            onClick={() => setView("employees")}
            className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${view === "employees" ? "bg-[#2878a8] text-white" : "text-slate-400"}`}
          >
            Empleados
          </button>
          <button 
            onClick={() => setView("hotel")}
            className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${view === "hotel" ? "bg-[#2878a8] text-white" : "text-slate-400"}`}
          >
            Muro Hotel
          </button>
        </nav>
      </header>

      {view === "hotel" && (
        <div className="space-y-8">
          {/* Métricas en escala 1-3 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard title="Limpieza" value={hotelData.stats.limpieza} icon={<Sparkles className="text-cyan-400" />} />
            <StatCard title="Infraestructura" value={hotelData.stats.infraestructura} icon={<Building2 className="text-[#2878a8]" />} />
            <StatCard title="Atención" value={hotelData.stats.atencion} icon={<Clock className="text-[#f5ac0a]" />} />
          </div>

          {/* Muro de comentarios corregido */}
          <div className="bg-white rounded-[2rem] p-8 shadow-xl">
            <h2 className="text-[#2878a8] font-black italic uppercase mb-6 flex items-center gap-2">
              <MessageSquare /> Muro de Experiencias
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {hotelData.data.map((fb: any) => (
                <div key={fb.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex justify-between mb-2">
                    <div className="flex gap-1">
                      {[1, 2, 3].map(s => (
                        <Star key={s} size={12} fill={s <= fb.habitacion_limpieza ? "#f5ac0a" : "none"} className="text-[#f5ac0a]" />
                      ))}
                    </div>
                    <span className="text-[9px] font-bold text-slate-300">{new Date(fb.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm italic text-slate-600">"{fb.mejoras_sugerencias || "Sin comentarios"}"</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function StatCard({ title, value, icon }: any) {
  return (
    <div className="bg-white p-8 rounded-[2rem] shadow-sm border-t-4 border-[#2878a8]">
      <div className="flex justify-between mb-4">
        <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{title}</span>
        {icon}
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-5xl font-black text-[#2878a8]">{value}</span>
        <span className="text-xl font-bold text-slate-200">/ 3</span>
      </div>
    </div>
  )
}
