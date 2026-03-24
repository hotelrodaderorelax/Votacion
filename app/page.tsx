import React, { useState } from 'react';
import { Star, Smile, Meh, Frown, Users, Utensils, Bell, BarChart3, ChevronLeft, MapPin } from 'lucide-react';
import Image from 'next/image';

const HotelApp = () => {
  const [view, setView] = useState('home'); // 'home', 'island', 'vote', 'ranking'
  const [selectedIsland, setSelectedIsland] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState(null);

  const hotelLogo = '/logo_rodadero_relax.png'; // Ruta a tu logo en /public
  const lexilisPhoto = '/lexilis_mejia.jpg';   // Ruta a tu foto en /public

  // 1. Áreas Principales Corregidas
  const islands = [
    { id: 'recepcion', name: 'Recepción', icon: <Bell size={40} />, color: 'bg-emerald-400' },
    { id: 'camareria', name: 'Camarería', icon: <Users size={40} />, color: 'bg-blue-400' },
    { id: 'cocina', name: 'Cocina', icon: <Utensils size={40} />, color: 'bg-orange-400' },
  ];

  // Datos de Empleados Actualizados (Con tu foto y marcadores de posición)
  const staffData = {
    recepcion: [
      { id: 11, name: 'Lexilis Mejía', title: 'Recepcionista Elite', img: lexilisPhoto },
      { id: 12, name: 'Compañero 2', title: 'Recepcionista', img: 'https://via.placeholder.com/150' },
      { id: 13, name: 'Compañero 3', title: 'Recepcionista', img: 'https://via.placeholder.com/150' },
    ],
    camareria: [
      { id: 21, name: 'Rosa Pérez', title: 'Líder de Piso', img: 'https://via.placeholder.com/150' },
      { id: 22, name: 'Luis Maestre', title: 'Supervisor de Servicio', img: 'https://via.placeholder.com/150' },
    ],
    cocina: [
      { id: 31, name: 'Chef Carlos', title: 'Chef Ejecutivo', img: 'https://via.placeholder.com/150' },
    ],
  };

  // Datos Simulados para el Ranking (¡Próximamente reales!)
  const mockRanking = [
    { name: 'Compañero 3', votes: 120, img: 'https://via.placeholder.com/150' },
    { name: 'Compañero 2', votes: 155, img: 'https://via.placeholder.com/150' },
    { name: 'Lexilis Mejía', votes: 140, img: lexilisPhoto }, // Ejemplo de podio simulado
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      
      {/* Hero Section */}
      <header className="h-64 bg-blue-600 flex items-center justify-center text-white text-center p-4 shadow-lg relative overflow-hidden">
        <Image src="/hero_hotel.jpg" alt="Hotel Rodadero Relax Hero" fill className="absolute inset-0 object-cover opacity-20" priority />
        <div className="relative z-10 flex flex-col items-center">
          <Image src={hotelLogo} alt="Hotel Rodadero Relax Logo" width={180} height={180} className="mb-4" />
          <h1 className="text-4xl font-extrabold tracking-tighter">Rodadero Relax</h1>
          <p className="opacity-90 text-lg flex items-center mt-1"><MapPin size={18} className="mr-1" /> Santa Marta, Colombia</p>
        </div>
        
        {/* Botón de Ranking */}
        <button 
          onClick={() => setView('ranking')}
          className="absolute top-4 right-4 bg-white/20 text-white flex items-center gap-2 p-2 px-4 rounded-full text-sm font-medium hover:bg-white/30 transition-all z-20"
        >
          <BarChart3 size={18} /> Ver Rankings
        </button>
      </header>

      <main className="max-w-4xl mx-auto p-6 -mt-10 relative z-20">
        
        {/* VISTA: HOME (ISLAS) */}
        {view === 'home' && (
          <section>
            <h2 className="text-2xl font-semibold mb-8 text-center">Selecciona un área para calificar</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {islands.map((island) => (
                <button
                  key={island.id}
                  onClick={() => { setSelectedIsland(island.id); setView('island'); }}
                  className={`${island.color} h-56 rounded-3xl shadow-2xl flex flex-col items-center justify-center text-white transform transition hover:scale-105 active:scale-95 group p-6`}
                >
                  <div className="p-4 rounded-full bg-white/10 group-hover:scale-110 transition-transform">
                    {island.icon}
                  </div>
                  <span className="mt-5 text-3xl font-bold tracking-tight">{island.name}</span>
                  <span className="text-xs opacity-70 mt-1">Haga clic para ver el personal</span>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* VISTA: ISLA SELECCIONADA (TARJETAS) */}
        {view === 'island' && (
          <section className="animate-in fade-in duration-300">
            <button onClick={() => setView('home')} className="mb-6 text-blue-600 font-medium flex items-center gap-1 hover:text-blue-800">
              <ChevronLeft size={20} /> Volver a las Áreas
            </button>
            <h2 className="text-3xl font-bold mb-8 capitalize text-center text-blue-900 flex items-center justify-center gap-3">
              {islands.find(isl => isl.id === selectedIsland)?.icon}
              Equipo de {islands.find(isl => isl.id === selectedIsland)?.name}
            </h2>
            
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              {staffData[selectedIsland].map((member) => (
                <div 
                  key={member.id}
                  onClick={() => { setSelectedStaff(member); setView('vote'); }}
                  className="bg-white border-4 border-yellow-400 rounded-3xl p-3 shadow-xl cursor-pointer hover:rotate-2 transition-transform relative group overflow-hidden"
                >
                  <div className="bg-slate-200 rounded-2xl h-56 overflow-hidden mb-4 relative">
                    <Image src={member.img} alt={member.name} fill className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="text-center p-2">
                    <p className="text-xs font-bold text-yellow-600 uppercase tracking-widest">{member.title}</p>
                    <p className="font-extrabold text-2xl text-blue-950 mt-1">{member.name}</p>
                    <div className="flex justify-center text-yellow-400 mt-2 gap-1">
                      <Star size={18} fill="currentColor" /> <Star size={18} fill="currentColor" /> <Star size={18} fill="currentColor" /> <Star size={18} fill="currentColor" /> <Star size={18} className="opacity-30" />
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-blue-600/90 flex items-center justify-center text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl">
                    ¡Calificar!
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* VISTA: VOTACIÓN */}
        {view === 'vote' && (
          <section className="bg-white p-10 rounded-3xl shadow-2xl animate-in fade-in zoom-in-95 duration-300 border border-slate-100">
            <button onClick={() => setView('island')} className="mb-6 text-blue-600 font-medium flex items-center gap-1 hover:text-blue-800">
              <ChevronLeft size={20} /> Volver al equipo
            </button>
            <div className="flex flex-col items-center mb-10">
              <div className="relative w-24 h-24 rounded-full overflow-hidden mb-4 shadow-inner">
                <Image src={selectedStaff.img} alt={selectedStaff.name} fill className="object-cover" />
              </div>
              <h2 className="text-3xl font-extrabold text-center mb-1 text-blue-950">¡Vota por {selectedStaff.name}!</h2>
              <p className="text-center text-slate-500 text-lg">¿Cómo calificarías tu experiencia con nuestro recepcionista?</p>
            </div>
            
            <div className="flex justify-around mb-12 gap-4">
              {[ { icon: <Frown size={56} />, label: 'Mal', color: 'red' }, { icon: <Meh size={56} />, label: 'Regular', color: 'yellow' }, { icon: <Smile size={56} />, label: 'Excelente', color: 'green' } ].map(score => (
                <button key={score.label} className="flex flex-col items-center group w-full max-w-[150px]">
                  <div className={`p-6 rounded-3xl bg-${score.color}-100 group-hover:bg-${score.color}-500 transition-colors`}>
                    {React.cloneElement(score.icon, { className: `text-${score.color}-500 group-hover:text-white` })}
                  </div>
                  <span className={`mt-3 text-lg font-semibold text-${score.color}-700`}>{score.label}</span>
                </button>
              ))}
            </div>

            <textarea 
              placeholder="¿Qué te encantó de la atención o qué podemos mejorar?"
              className="w-full border-2 border-slate-200 rounded-2xl p-6 mb-8 focus:border-blue-500 outline-none h-40 text-lg shadow-inner"
            />

            <button 
              onClick={() => { alert('¡Gracias por tu voto!'); setView('home'); }}
              className="w-full bg-blue-600 text-white font-bold py-5 rounded-2xl shadow-lg hover:bg-blue-700 active:scale-95 transition-all text-xl"
            >
              ENVIAR VALORACIÓN
            </button>
          </section>
        )}

        {/* VISTA: RANKING (VISUALIZACIÓN INICIAL) */}
        {view === 'ranking' && (
          <section className="animate-in fade-in duration-300">
            <button onClick={() => setView('home')} className="mb-6 text-blue-600 font-medium flex items-center gap-1 hover:text-blue-800">
              <ChevronLeft size={20} /> Volver al Inicio
            </button>
            <h2 className="text-3xl font-bold mb-10 text-center text-blue-900 flex items-center justify-center gap-3">
              <BarChart3 size={28} /> Rankings del Mes (Simulado)
            </h2>
            
            <div className="flex justify-center items-end gap-10 mb-16">
              {[mockRanking[0], mockRanking[2], mockRanking[1]].map((pod, index) => {
                const isWinner = index === 1;
                return (
                  <div key={pod.name} className={`flex flex-col items-center ${isWinner ? '-mb-6' : ''}`}>
                    <div className={`relative ${isWinner ? 'w-32 h-32 border-4 border-yellow-400' : 'w-24 h-24 border-2 border-slate-200'} rounded-full overflow-hidden shadow-2xl`}>
                      <Image src={pod.img} alt={pod.name} fill className="object-cover" />
                    </div>
                    <div className={`mt-4 ${isWinner ? 'bg-yellow-400 text-yellow-950 font-bold' : 'bg-slate-200 text-slate-800 font-medium'} rounded-full p-2 px-5 text-sm`}>{pod.name}</div>
                    <p className="text-4xl font-extrabold text-blue-900 mt-1">{pod.votes}</p>
                    <p className="text-xs text-slate-500 -mt-1 uppercase tracking-wider">Votos</p>
                  </div>
                );
              })}
            </div>
            
            <div className="text-center p-6 bg-blue-50 rounded-2xl border border-blue-100 text-blue-950">
              <p className="text-xl font-semibold">Este ranking es una simulación visual.</p>
              <p className="opacity-80 mt-1">El panel administrativo real mostrará los rankings exactos una vez que la base de datos esté conectada.</p>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default HotelApp;
