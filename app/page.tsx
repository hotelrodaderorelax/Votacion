"use client"; // Esto es vital para que Next.js no de error

import React, { useState } from 'react';

export default function HotelApp() {
  const [view, setView] = useState('home'); 
  const [selectedIsland, setSelectedIsland] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState(null);

  // Imágenes (Si no existen, mostrará el nombre)
  const hotelLogo = "/461923986_518308774280738_2136827881918218383_n.jpg"; 
  const lexilisPhoto = "/WhatsApp Image 2026-01-22 at 11.17.33 AM.jpeg";

  const islands = [
    { id: 'recepcion', name: 'Recepción', emoji: '🔔', color: 'bg-emerald-500' },
    { id: 'camareria', name: 'Camarería', emoji: '🧹', color: 'bg-blue-500' },
    { id: 'cocina', name: 'Cocina', emoji: '👨‍🍳', color: 'bg-orange-500' },
  ];

  const staffData = {
    recepcion: [
      { id: 11, name: 'Lexilis Mejía', title: 'Recepcionista Elite', img: lexilisPhoto },
      { id: 12, name: 'Compañero 2', title: 'Recepcionista', img: '' },
      { id: 13, name: 'Compañero 3', title: 'Recepcionista', img: '' },
    ],
    camareria: [{ id: 21, name: 'Personal de Limpieza', title: 'Staff', img: '' }],
    cocina: [{ id: 31, name: 'Chef de Turno', title: 'Staff', img: '' }],
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* Header */}
      <header className="bg-blue-600 p-8 text-white text-center shadow-lg">
        <div className="max-w-md mx-auto">
           <h1 className="text-3xl font-bold">Hotel Rodadero Relax</h1>
           <p className="opacity-80">Panel de Calificación</p>
        </div>
        <button 
          onClick={() => setView('ranking')}
          className="mt-4 bg-white/20 px-4 py-2 rounded-full text-sm font-bold"
        >
          🏆 Ver Rankings
        </button>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        
        {/* VISTA: HOME */}
        {view === 'home' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            {islands.map((island) => (
              <button
                key={island.id}
                onClick={() => { setSelectedIsland(island.id); setView('island'); }}
                className={`${island.color} h-48 rounded-3xl shadow-xl flex flex-col items-center justify-center text-white hover:scale-105 transition-transform`}
              >
                <span className="text-5xl mb-2">{island.emoji}</span>
                <span className="text-2xl font-bold">{island.name}</span>
              </button>
            ))}
          </div>
        )}

        {/* VISTA: EMPLEADOS */}
        {view === 'island' && (
          <div>
            <button onClick={() => setView('home')} className="text-blue-600 font-bold mb-6">← Volver</button>
            <h2 className="text-2xl font-bold mb-6 text-center italic text-blue-900">Equipo de {selectedIsland}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {staffData[selectedIsland].map((member) => (
                <div 
                  key={member.id}
                  onClick={() => { setSelectedStaff(member); setView('vote'); }}
                  className="bg-white border-4 border-yellow-400 rounded-2xl p-3 shadow-lg cursor-pointer hover:rotate-2 transition-transform"
                >
                  <div className="h-40 bg-slate-200 rounded-xl overflow-hidden mb-2 relative">
                    {member.img ? (
                       <img src={member.img} className="w-full h-full object-cover" alt={member.name} />
                    ) : (
                       <div className="flex items-center justify-center h-full text-slate-400">Sin foto</div>
                    )}
                  </div>
                  <p className="text-xs font-bold text-yellow-600 uppercase text-center">{member.title}</p>
                  <p className="font-bold text-center text-blue-900">{member.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VISTA: VOTACIÓN */}
        {view === 'vote' && (
          <div className="bg-white p-8 rounded-3xl shadow-2xl text-center border-t-8 border-blue-500">
            <h2 className="text-2xl font-bold mb-2 text-blue-900">Califica a {selectedStaff.name}</h2>
            <div className="flex justify-center gap-8 my-8">
               <button onClick={() => { alert('¡Gracias!'); setView('home'); }} className="text-5xl hover:scale-125 transition">🙁</button>
               <button onClick={() => { alert('¡Gracias!'); setView('home'); }} className="text-5xl hover:scale-125 transition">😐</button>
               <button onClick={() => { alert('¡Gracias!'); setView('home'); }} className="text-5xl hover:scale-125 transition">😊</button>
            </div>
            <textarea placeholder="¿Algún comentario?" className="w-full border p-4 rounded-xl h-32 mb-4" />
            <button onClick={() => setView('home')} className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl">ENVIAR</button>
          </div>
        )}

        {/* VISTA: RANKING */}
        {view === 'ranking' && (
          <div className="text-center">
            <button onClick={() => setView('home')} className="text-blue-600 font-bold mb-6 block text-left">← Volver</button>
            <h2 className="text-3xl font-bold mb-8 text-blue-900">Ranking del Mes</h2>
            <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-blue-100">
              <p className="text-lg">Próximamente verás aquí quién lidera el equipo.</p>
              <div className="flex flex-col gap-4 mt-6">
                 <div className="flex justify-between items-center bg-blue-50 p-4 rounded-xl">
                    <span className="font-bold">1. Lexilis Mejía</span>
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">140 Votos</span>
                 </div>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
