"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { 
  Star, 
  Sparkles, 
  Clock, 
  Building2,
  MessageSquare,
  ArrowLeft
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Inicialización segura del cliente
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [metrics, setMetrics] = useState({
    limpieza: 0,
    infraestructura: 0,
    atencion: 0,
    total: 0
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // Consulta a la tabla exacta de tu captura
        const { data, error } = await supabase
          .from("hotel_survey_responses")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;

        if (data) {
          setFeedbacks(data);
          
          // Cálculo de promedios basado en escala 1-3
          const count = data.length;
          const avg = (col: string) => 
            data.reduce((acc, curr) => acc + (Number(curr[col]) || 0), 0) / count;

          setMetrics({
            limpieza: Number(avg('bienvenida_sentir').toFixed(1)), // Ajustado a tus columnas de Supabase
            infraestructura: Number(avg('registro_rapidez').toFixed(1)),
            atencion: Number(avg('registro_amabilidad').toFixed(1)),
            total: count
          });
        }
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#2878a8] border-t-transparent"></div>
          <p className="font-black text-[#2878a8] uppercase italic tracking-tighter">
            Sincronizando con Supabase...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfdfe] p-4 md:p-8">
      {/* Header Estilo "Exclusive" */}
      <header className="mb-10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button className="rounded-full bg-white p-2 shadow-sm border border-gray-100 text-[#2878a8]">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-black italic uppercase tracking-tighter text-[#2878a8]">
              Métricas Hotel
            </h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#f5ac0a]">
              Hotel Rodadero Relax
            </p>
          </div>
        </div>
      </header>

      {/* Grid de Cards - Escala 1 a 3 */}
      <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-3">
        <MetricCard 
          label="Limpieza" 
          value={metrics.limpieza} 
          icon={<Sparkles className="text-cyan-400" />} 
          sub="Promedio Real"
        />
        <MetricCard 
          label="Infraestructura" 
          value={metrics.infraestructura} 
          icon={<Building2 className="text-[#2878a8]" />} 
          sub="Estado Instalaciones"
        />
        <MetricCard 
          label="Atención" 
          value={metrics.atencion} 
          icon={<Clock className="text-[#f5ac0a]" />} 
          sub="Velocidad Respuesta"
        />
      </div>

      {/* Muro de Comentarios Corregido */}
      <section className="rounded-[2rem] border border-gray-100 bg-white p-8 shadow-2xl shadow-blue-900/5">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="flex items-center gap-2 font-black italic uppercase text-[#2878a8]">
            <MessageSquare size={22} />
            Muro de Experiencias
          </h2>
          <div className="rounded-full bg-[#f5ac0a]/10 px-4 py-1 text-[10px] font-black text-[#f5ac0a]">
            {metrics.total} ENTRADAS
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {feedbacks.map((fb, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-gray-50 bg-gray-50/50 p-6 transition-colors hover:border-[#2878a8]/20"
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="flex gap-1">
                  {/* Estrellas basadas en escala 1-3 */}
                  {[1, 2, 3].map((s) => (
                    <Star 
                      key={s} 
                      size={14} 
                      className={s <= fb.general_evaluacion ? "fill-[#f5ac0a] text-[#f5ac0a]" : "text-gray-200"} 
                    />
                  ))}
                </div>
                <span className="text-[10px] font-bold text-gray-400">
                  {fb.created_at ? new Date(fb.created_at).toLocaleDateString() : 'Reciente'}
                </span>
              </div>
              <p className="text-sm italic leading-relaxed text-gray-600">
                "{fb.mejoras_sugerencias || "Sin comentarios adicionales."}"
              </p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}

function MetricCard({ label, value, icon, sub }: any) {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-gray-100 bg-white p-8 shadow-sm transition-all hover:shadow-md">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{label}</span>
        <div className="rounded-xl bg-gray-50 p-2">{icon}</div>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-5xl font-black tracking-tighter text-[#2878a8]">{value}</span>
        <span className="text-xl font-bold text-gray-300">/ 3</span>
      </div>
      <p className="mt-2 text-[9px] font-black uppercase text-[#f5ac0a]">{sub}</p>
      
      {/* Barra de progreso visual para escala de 3 */}
      <div className="mt-6 h-1.5 w-full rounded-full bg-gray-50">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${(value / 3) * 100}%` }}
          className="h-full rounded-full bg-gradient-to-r from-[#2878a8] to-cyan-400"
        />
      </div>
    </div>
  );
}
