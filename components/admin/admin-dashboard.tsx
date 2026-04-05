import React from 'react';
import { Users, Star, TrendingUp, LogOut, Award, MessageSquare } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";

const AdminDashboard = () => {
  // Datos de ejemplo basados en tu interfaz
  const stats = [
    { label: "VOTOS TOTALES", value: "9", sub: "VOTOS ESTE MES", icon: Users },
    { label: "PROMEDIO HOTEL", value: "5.0", sub: "ESTRELLAS", icon: Star },
    { label: "ELITE", value: "1", sub: "EMPLEADOS TOP", icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans">
      {/* Header Estilo Card Coleccionable */}
      <header className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm mb-8 border-b-4 border-[#2878a8]">
        <div className="flex items-center gap-4">
          <div className="bg-[#2878a8] p-2 rounded-lg">
            <TrendingUp className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-[#2878a8] font-black text-xl tracking-tighter">ADMIN RELAX</h1>
            <p className="text-[#f5ac0a] text-xs font-bold tracking-widest uppercase">Hotel Rodadero Relax</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <nav className="flex bg-slate-100 p-1 rounded-xl">
            <button className="px-4 py-2 rounded-lg text-sm font-bold bg-white text-[#2878a8] shadow-sm">HOTEL</button>
            <button className="px-4 py-2 rounded-lg text-sm font-bold text-slate-500 hover:text-[#2878a8]">EMPLEADOS</button>
          </nav>
          <button className="flex items-center gap-2 text-slate-400 hover:text-red-500 font-bold text-sm transition-colors">
            <LogOut size={18} /> SALIR
          </button>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, i) => (
          <Card key={i} className="border-none shadow-md overflow-hidden group hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-slate-400 font-bold text-xs tracking-wider mb-4 uppercase">{stat.label}</p>
                  <h2 className="text-4xl font-black text-[#2878a8] mb-1">{stat.value}</h2>
                  <p className="text-[#f5ac0a] text-[10px] font-bold uppercase tracking-tight">{stat.sub}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl group-hover:scale-110 transition-transform">
                  <stat.icon className={i === 1 ? "text-[#f5ac0a]" : i === 2 ? "text-green-500" : "text-[#2878a8]"} size={28} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Lado Izquierdo: Ganador Provisional (Estilo Cromo) */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border-2 border-slate-100">
            <div className="bg-[#2878a8] p-3 text-center">
              <span className="text-white font-black italic text-sm tracking-widest uppercase">GANADOR PROVISIONAL</span>
            </div>
            <div className="relative aspect-[3/4] bg-slate-200">
              {/* Aquí iría la imagen de Lexilis Mejía */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#2878a8]/80 to-transparent flex flex-col justify-end p-6">
                <p className="text-[#f5ac0a] font-bold text-xs uppercase tracking-widest mb-1">Primer Lugar</p>
                <h3 className="text-white font-black text-3xl leading-tight">Lexilis Mejía</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Lado Derecho: Clasificación y Comentarios */}
        <div className="lg:col-span-8 space-y-6">
          <h3 className="text-[#2878a8] font-black italic text-xl flex items-center gap-2 uppercase tracking-tighter">
            Clasificación Detallada
          </h3>
          
          {/* Fila de Empleado */}
          <div className="bg-white p-4 rounded-2xl shadow-md border-l-8 border-[#f5ac0a] flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-[#f5ac0a] rounded-full flex items-center justify-center text-white font-black">1</div>
              <div className="w-12 h-12 rounded-full bg-slate-200 overflow-hidden border-2 border-white shadow-sm" />
              <div>
                <h4 className="font-black text-[#2878a8] leading-tight uppercase">Lexilis Mejía</h4>
                <p className="text-slate-400 text-[10px] font-bold uppercase">Recepción</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-[#f5ac0a]">
                <Star size={16} fill="#f5ac0a" />
                <span className="font-black text-lg">5.0</span>
              </div>
              <p className="text-slate-400 text-[10px] font-bold uppercase">9 Votos</p>
            </div>
          </div>

          {/* Sección Comentarios */}
          <div className="bg-white/50 rounded-2xl p-6 border-2 border-dashed border-slate-200">
            <div className="flex items-center gap-2 mb-4 text-slate-400">
              <MessageSquare size={18} />
              <span className="font-bold text-xs uppercase tracking-widest">Comentarios Recientes</span>
            </div>
            <p className="text-center text-slate-400 italic text-sm py-4">No hay comentarios generales registrados</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
