"use client";

import React, { useState } from 'react';

export default function HotelApp() {
  const [view, setView] = useState('home'); // 'home', 'island', 'vote', 'ranking'
  const [selectedIsland, setSelectedIsland] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState(null);

  // Rutas exactas de tus archivos subidos a la carpeta /public
  const hotelLogo = "/461923986_518308774280738_2136827881918218383_n.jpg"; 
  const lexilisPhoto = "/WhatsApp Image 2026-01-22 at 11.17.33 AM.jpeg";

  // 1. Solo las áreas requeridas
  const islands = [
    { id: 'recepcion', name: 'Recepción', emoji: '🔔', color: 'bg-emerald-500' },
    { id: 'camareria', name: 'Camarería', emoji: '🧹', color: 'bg-blue-500' },
    { id: 'cocina', name: 'Cocina', emoji: '👨‍🍳', color: 'bg-orange-500' },
  ];

  // 2. Datos de empleados (Lexilis en Recepción)
  const staffData = {
    recepcion: [
      { id: 11, name: 'Lexilis Mejía', title: 'Recepcionista Elite', img: lexilisPhoto },
      { id: 12, name: 'Compañero 2', title: 'Recepcionista', img: '' },
      { id: 13, name: 'Compañero 3', title: 'Recepcionista', img: '' },
    ],
    camareria: [
      { id: 21, name: 'Personal 1', title: 'Camarería', img: '' },
    ],
    cocina: [
      { id: 31, name: 'Chef Principal', title: 'Cocina', img: '' },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-10">
      
      {/* HEADER DINÁMICO */}
      <header className="bg-blue-600 p-6 text-white text-center shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col items-center">
          {/* Logo del Hotel */}
          <img src={hotelLogo} alt="Logo Rodadero Relax" className="w-24 h-24 rounded-full border-4 border-white mb-3 object-cover shadow-md" />
          <h1 className="text-3xl font-black tracking-tight uppercase">Rodadero Relax</h1>
          <p className="opacity-90 font-medium italic">¡Tu opinión es nuestra brújula!</p>
        </div>
        
        {/* BOTÓN DE RANKING (Punto 3 corregido) */}
        <button 
          onClick={() => setView('ranking')}
          className="mt-6 bg-yellow-400 text-blue-900 px-6 py-2 rounded-full font-bold text-sm hover:bg-yellow-300 transition-all flex items-center gap-2 mx-auto shadow-lg"
        >
          🏆 VER RANKINGS GENERALES
        </button>
      </header>

      <main className="max-w-4xl mx-auto p-6 mt-4">
        
        {/* VISTA 1: HOME (ISLAS INTERACTIVAS - Punto 1 corregido) */}
        {view === 'home' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {islands.map((island) => (
              <button
                key={island.id}
                onClick={() => { setSelectedIsland(island.id); setView('island'); }}
                className={`${island.color} h-52 rounded-[2rem] shadow-2xl flex flex-col items-center justify-center text-white hover:scale-105 active:scale-95 transition-all group`}
              >
                <span className="text-6xl mb-4 group-hover:bounce transition-all">{island.emoji}</span>
                <span className="text-2xl font-black uppercase tracking-wider">{island.name}</span>
              </button>
            ))}
          </div>
        )}

        {/* VISTA 2: LISTA DE EMPLEADOS (Punto 2 corregido) */}
        {view === 'island' && (
          <div className="animate-in fade-in duration-300">
            <button onClick={() => setView('home')} className="text-blue-600 font-bold mb-6 flex items-center gap-2">← VOLVER A LAS ISLAS</button>
            <h2 className="text-3xl font-black mb-8 text-center text-blue-900 border-b-4 border-blue-600 inline-block w-full pb-2 uppercase tracking-tighter">
              Equipo de {selectedIsland}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              {staffData[selectedIsland].map((member) => (
                <div 
                  key={member.id}
                  onClick={() => { setSelectedStaff(member); setView('vote'); }}
                  className="bg-white border-4 border-yellow-400 rounded-[2.5rem] p-4 shadow-2xl cursor-pointer hover:rotate-3 transition-transform relative group overflow-hidden"
                >
                  <div className="h-48 bg-slate-100 rounded-[2rem] overflow-hidden mb-3 border-2 border-slate-50 shadow-inner">
                    {member.img ? (
                       <img src={member.img} className="w-full h-full object-cover" alt={member.name} />
                    ) : (
                       <div className="flex items-center justify-center h-full text-4xl">👤</div>
                    )}
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">{member.title}</p>
                    <p className="font-black text-lg text-slate-800 leading-tight">{member.name}</p>
                    <div className="flex justify-center text-yellow-400 mt-2 text-sm">⭐⭐⭐⭐⭐</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VISTA 3: VOTACIÓN (TARJETA INTERACTIVA) */}
        {view === 'vote' && (
          <div className="bg-white p-8 rounded-[3rem] shadow-2xl text-center border-b-[12px] border-blue-600 animate-in zoom-in-95 duration-300 max-w-md mx-auto">
            <h2 className="text-2xl font-black mb-2 text-blue-950 uppercase italic">¿Cómo fue tu experiencia con {selectedStaff.name}?</h2>
            <div className="flex justify-between gap-4 my-10 px-4">
               {['😡', '😐', '😍'].map((face, i) => (
                 <button key={i} onClick={() => { alert('¡Voto registrado con éxito!'); setView('home'); }} className="text-6xl hover:scale-125 transition active:scale-90">
                   {face}
                 </button>
               ))}
            </div>
            <textarea 
              placeholder="¿Qué te encantó o qué podemos mejorar?" 
              className="w-full border-4 border-slate-100 p-4 rounded-3xl h-32 mb-6 focus:border-blue-400 outline-none text-sm font-medium" 
            />
            <button 
              onClick={() => { alert('¡Gracias por ayudarnos a mejorar!'); setView('home'); }} 
              className="w-full bg-blue-600 text-white font-black py-5 rounded-[2rem] shadow-lg hover:bg-blue-700 transition-all text-xl"
            >
              ¡ENVIAR MI VOTO!
            </button>
          </div>
        )}

        {/* VISTA 4: RANKING (Punto 3 corregido) */}
        {view === 'ranking' && (
          <div className="animate-in slide-in-from-right duration-500">
            <button onClick={() => setView('home')} className="text-blue-600 font-bold mb-6 block">← VOLVER AL INICIO</button>
            <h2 className="text-4xl font-black mb-10 text-center text-blue-900 italic uppercase">Ranking del Mes 🏆</h2>
            
            <div className="space-y-4">
              {/* Ejemplo de Lexilis liderando */}
              <div className="flex items-center justify-between bg-white p-6 rounded-[2rem] shadow-xl border-l-[10px] border-yellow-400">
                <div className="flex items-center gap-4">
                  <span className="text-3xl font-black text-blue-900">1°</span>
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-yellow-400">
                    <img src={lexilisPhoto} className="w-full h-full object-cover" alt="Lexilis" />
                  </div>
                  <div>
                    <p className="font-black text-xl text-blue-950">Lexilis Mejía</p>
                    <p className="text-xs font-bold text-slate-400 uppercase">Recepción</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-black text-blue-600">140</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Votos</p>
                </div>
              </div>
              
              <div className="p-6 bg-blue-50 rounded-[2rem] text-center border-2 border-dashed border-blue-200">
                <p className="text-blue-900 font-bold italic text-sm">Próximamente verás aquí el ranking de Cocina y Camarería...</p>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
