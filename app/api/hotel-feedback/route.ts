import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { motion } from 'framer-motion';
import { Star, Sparkles, Building2, Clock, MessageSquare } from 'lucide-react';

// Tus credenciales de Supabase
const supabase = createClient(
  'https://kfltdikdcxtombnwalxj.supabase.co',
  'sb_publishable_hW2Wfpw46rvONH8Fg_kW9A_RP7L1GcA'
);

export default function HotelFeedback() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ limpieza: 0, infraestructura: 0, atencion: 0 });
  const [feedbacks, setFeedbacks] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from('hotel_survey_responses')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (data && data.length > 0) {
          // Cálculo de promedios basado en tus columnas de Supabase
          const total = data.length;
          const avgLimpieza = data.reduce((acc, curr) => acc + (curr.habitacion_limpieza || 0), 0) / total;
          const avgInfra = data.reduce((acc, curr) => acc + (curr.instalaciones_estado || 0), 0) / total;
          const avgAtencion = data.reduce((acc, curr) => acc + (curr.registro_amabilidad || 0), 0) / total;

          setStats({
            limpieza: Number(avgLimpieza.toFixed(1)),
            infraestructura: Number(avgInfra.toFixed(1)),
            atencion: Number(avgAtencion.toFixed(1))
          });

          setFeedbacks(data);
        }
      } catch (err) {
        console.error("Error cargando feedback:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="p-20 text-center font-black text-[#2878a8] animate-pulse uppercase tracking-widest">Cargando Muro del Hotel...</div>;
  }

  return (
    <div className="space-y-8">
      {/* 3 Cards de Métricas Superiores */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Limpieza" value={stats.limpieza} icon={<Sparkles size={20} />} label="Promedio General" />
        <StatCard title="Infraestructura" value={stats.infraestructura} icon={<Building2 size={20} />} label="Estado Instalaciones" />
        <StatCard title="Atención" value={stats.atencion} icon={<Clock size={20} />} label="Velocidad Respuesta" />
      </div>

      {/* Sección de Comentarios */}
      <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-50">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black italic text-[#2878a8] uppercase tracking-tighter">
            Comentarios Generales del Hotel
          </h2>
          <div className="p-2 bg-[#f5ac0a]/10 rounded-xl text-[#f5ac0a]">
            <MessageSquare size={24} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {feedbacks.length > 0 ? (
            feedbacks.map((f, index) => (
              f.comentarios_sugerencias && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  key={f.id} 
                  className="p-5 rounded-2xl bg-slate-50/50 border border-slate-100 hover:border-[#2878a8]/20 transition-all"
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[10px] font-black uppercase text-[#2878a8] tracking-widest bg-white px-2 py-1 rounded-md border border-slate-100">
                      Feedback Cliente
                    </span>
                    <div className="flex items-center gap-1 text-[#f5ac0a]">
                      <Star size={12} fill="#f5ac0a" />
                      <span className="font-black text-xs">
                        {((f.bienvenida_sentir + f.habitacion_limpieza + f.registro_amabilidad) / 3).toFixed(1)}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 font-medium italic">"{f.comentarios_sugerencias}"</p>
                  <p className="text-[9px] font-bold text-slate-400 mt-4 text-right uppercase">
                    {new Date(f.created_at).toLocaleDateString()}
                  </p>
                </motion.div>
              )
            ))
          ) : (
            <p className="col-span-2 text-center py-10 text-slate-400 font-bold uppercase text-xs tracking-widest">
              No hay comentarios registrados todavía.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// Sub-componente para las tarjetas de arriba
function StatCard({ title, value, icon, label }: any) {
  return (
    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-50 flex flex-col justify-between h-40">
      <div className="flex justify-between items-start">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{title}</span>
        <div className="text-[#2878a8]">{icon}</div>
      </div>
      <div>
        <div className="text-5xl font-black text-[#2878a8] mb-1">{value}</div>
        <div className="text-[9px] font-black uppercase text-[#f5ac0a] tracking-tight">{label}</div>
      </div>
    </div>
  );
}
