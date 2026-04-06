"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js"; // Asegúrate de tener configurado tu cliente
import { 
  Star, 
  Users, 
  Hotel, 
  TrendingUp, 
  Sparkles, 
  Clock, 
  Building2,
  MessageSquare
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Configuración de Supabase (reemplaza con tus variables de entorno)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Feedback {
  id: string;
  mejoras_sugerencias: string;
  general_evaluacion: number;
  limpieza: number;
  infraestructura: number;
  atencion: number;
  created_at: string;
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [stats, setStats] = useState({
    avgLimpieza: 0,
    avgInfra: 0,
    avgAtencion: 0,
    totalVotos: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("hotel_survey_responses")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      if (data) {
        setFeedbacks(data);
        
        // Cálculo de métricas en escala 1-3
        const total = data.length;
        const limpieza = data.reduce((acc, curr) => acc + (curr.limpieza || 0), 0) / total;
        const infra = data.reduce((acc, curr) => acc + (curr.infraestructura || 0), 0) / total;
        const atencion = data.reduce((acc, curr) => acc + (curr.atencion || 0), 0) / total;

        setStats({
          avgLimpieza: Number(limpieza.toFixed(1)),
          avgInfra: Number(infra.toFixed(1)),
          avgAtencion: Number(atencion.toFixed(1)),
          totalVotos: total
        });
      }
    } catch (err) {
      console.error("Error fetching admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="p-20 text-center font-black text-[#2878a8] animate-pulse uppercase text-xl">
          Sincronizando con Supabase...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8">
      {/* Header */}
      <header className="flex justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-[#2878a8] font-black text-2xl italic uppercase tracking-tighter">
            Métricas Hotel
          </h1>
          <p className="text-[#f5ac0a] font-bold text-xs uppercase tracking-widest">
            Hotel Rodadero Relax
          </p>
        </div>
        <div className="flex gap-2">
           <button onClick={fetchData} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Clock className="w-5 h-5 text-gray-400" />
           </button>
        </div>
      </header>

      {/* Grid de Cards Principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <MetricCard 
          title="Limpieza" 
          value={stats.avgLimpieza} 
          icon={<Sparkles className="text-cyan-500" />} 
          label="Promedio Real"
        />
        <MetricCard 
          title="Infraestructura" 
          value={stats.avgInfra} 
          icon={<Building2 className="text-blue-600" />} 
          label="Estado Instalaciones"
        />
        <MetricCard 
          title="Atención" 
          value={stats.avgAtencion} 
          icon={<Clock className="text-orange-400" />} 
          label="Velocidad Respuesta"
        />
      </div>

      {/* Muro de Comentarios */}
      <section className="bg-white rounded-3xl shadow-xl shadow-blue-900/5 border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-white to-gray-50 p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-[#2878a8] font-black italic uppercase flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Muro de Experiencias
          </h2>
          <span className="bg-[#f5ac0a]/10 text-[#f5ac0a] px-3 py-1 rounded-full text-xs font-black">
            {stats.totalVotos} COMENTARIOS
          </span>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto">
          <AnimatePresence>
            {feedbacks.map((item) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 rounded-2xl bg-gray-50 border border-gray-100 hover:border-[#2878a8]/30 transition-all"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex gap-1">
                    {[1, 2, 3].map((star) => (
                      <Star 
                        key={star}
                        className={`w-4 h-4 ${star <= item.general_evaluacion ? 'fill-[#f5ac0a] text-[#f5ac0a]' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] text-gray-400 font-medium">
                    {new Date(item.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-700 italic text-sm leading-relaxed">
                  "{item.mejoras_sugerencias || 'Sin comentarios adicionales.'}"
                </p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}

function MetricCard({ title, value, icon, label }: { title: string, value: number, icon: React.ReactNode, label: string }) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
      <div className="absolute top-4 right-4 bg-gray-50 p-2 rounded-xl group-hover:bg-blue-50 transition-colors">
        {icon}
      </div>
      <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mb-1">{title}</p>
      <div className="flex items-baseline gap-1">
        <h3 className="text-4xl font-black text-[#2878a8]">{value}</h3>
        <span className="text-gray-300 font-bold text-lg">/ 3</span>
      </div>
      <p className="text-[#f5ac0a] font-black text-[9px] uppercase mt-2">{label}</p>
      
      {/* Barra de progreso visual (Escala 3) */}
      <div className="w-full h-1.5 bg-gray-100 rounded-full mt-4 overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${(value / 3) * 100}%` }}
          className="h-full bg-gradient-to-r from-[#2878a8] to-cyan-400"
        />
      </div>
    </div>
  );
}
