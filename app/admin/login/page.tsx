"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { User, Lock, KeyRound, Utensils, BedDouble, PalmTree, BellRing, Broom } from "lucide-react"

// --- COMPONENTE INTERACTIVO DE FONDO ---
// Crea una cascada de iconos con los colores del hotel
const HotelIconCascade = () => {
  // Definimos los iconos representativos de las áreas del hotel
  const icons = [
    { Icon: PalmTree, color: "text-[#2878a8]" }, // Playa/Hotel - Azul
    { Icon: Utensils, color: "text-[#f5ac0a]" }, // Cocina - Naranja
    { Icon: BellRing, color: "text-[#2878a8]" }, // Recepción - Azul
    { Icon: Broom, color: "text-[#f5ac0a]" },    // Camarería - Naranja
    { Icon: BedDouble, color: "text-[#2878a8]" }, // Habitaciones - Azul
  ];

  // Generamos un array de elementos de icono con propiedades aleatorias para la animación
  const elements = React.useMemo(() => {
    return Array.from({ length: 40 }).map((_, i) => {
      const { Icon, color } = icons[i % icons.length];
      const left = Math.random() * 100; // Posición horizontal aleatoria
      const delay = Math.random() * -20; // Retraso de animación negativo para que parezca que ya estaban cayendo
      const duration = 10 + Math.random() * 15; // Velocidad de caída aleatoria (más lento = más "relax")
      const size = 20 + Math.random() * 20; // Tamaños variados (20px a 40px)
      const opacity = 0.15 + Math.random() * 0.15; // Opacidad sutil (0.15 a 0.3)

      return (
        <div
          key={i}
          className={`absolute opacity-0 ${color}`}
          style={{
            left: `${left}%`,
            animation: `fall ${duration}s linear infinite`,
            animationDelay: `${delay}s`,
            opacity: opacity,
          }}
        >
          <Icon strokeWidth={1} style={{ width: `${size}px`, height: `${size}px` }} />
        </div>
      );
    });
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Definimos la animación CSS inline para facilidad de copia */}
      <style>{`
        @keyframes fall {
          0% {
            transform: translateY(-100%) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(${360 + Math.random() * 360}deg);
            opacity: 0;
          }
        }
      `}</style>
      {elements}
    </div>
  );
};

export default function AdminLoginPage() {
  const [password, setPassword] = React.useState("")
  const [user, setUser] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const router = useRouter()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // --- TUS CREDENCIALES ---
    // Puedes cambiarlas aquí cuando quieras
    if (user === "admin" && password === "relax2026") {
      // Usamos Cookies para que sea compatible con SSR si decides escalarlo
      document.cookie = "admin_auth=true; path=/; max-age=86400; SameSite=Strict"; 
      router.push("/admin")
    } else {
      // Pequeño timeout para dar feedback visual de carga
      setTimeout(() => {
        alert("Credenciales incorrectas")
        setLoading(false)
        setPassword("") // Reseteamos contraseña por seguridad
      }, 800)
    }
  }

  return (
    // CONTENEDOR PRINCIPAL: Ahora tiene el componente de cascada de iconos
    <div className="relative flex min-h-screen items-center justify-center p-4 overflow-hidden bg-white/60">
      
      {/* EL FONDO INTERACTIVO DE CASCADA */}
      <HotelIconCascade />

      {/* Sutiles gradientes de fondo para suavizar */}
      <div className="absolute -bottom-20 -left-20 h-96 w-96 rounded-full bg-[#f5ac0a]/10 blur-3xl z-0" />
      <div className="absolute -top-20 -right-20 h-96 w-96 rounded-full bg-[#f5ac0a]/10 blur-3xl z-0" />

      {/* LA TARJETA DE LOGIN: Con fondo semi-transparente para que se vea el fondo */}
      <Card className="relative w-full max-w-md overflow-hidden border border-[#2878a8]/10 bg-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.08)] backdrop-blur-md z-10 transition-all duration-300 hover:shadow-[0_8px_40px_rgb(40,120,168,0.1)]">
        
        {/* Línea superior con gradiente de marca */}
        <div className="h-2.5 w-full bg-gradient-to-r from-[#2878a8] via-[#2878a8] to-[#f5ac0a]" />

        <CardHeader className="pt-10 pb-6 text-center">
          {/* Icono decorativo de marca */}
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-white/50 ring-8 ring-white shadow-lg backdrop-blur-sm border border-[#2878a8]/10">
            <KeyRound className="h-10 w-10 text-[#2878a8]" strokeWidth={1} />
          </div>
          
          <CardTitle className="font-serif text-4xl font-black text-[#2878a8] tracking-tight uppercase italic leading-none">
            Acceso <span className="text-[#f5ac0a]">Relax</span>
          </CardTitle>
          <p className="mt-2 text-sm font-bold uppercase tracking-[0.2em] text-slate-400">
            Hotel Rodadero Relax
          </p>
        </CardHeader>
        
        <CardContent className="px-10 pb-12 pt-0">
          <form onSubmit={handleLogin} className="space-y-6">
            
            {/* Campo Usuario con Icono */}
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" strokeWidth={1.5} />
              <Input 
                id="user"
                name="user"
                type="text"
                autoComplete="username"
                required
                placeholder="Usuario de Administración" 
                value={user}
                onChange={(e) => setUser(e.target.value)}
                className="h-14 pl-12 rounded-2xl border-slate-200 bg-white shadow-inner focus-visible:ring-1 focus-visible:ring-[#2878a8] transition-all text-lg"
              />
            </div>

            {/* Campo Contraseña con Icono */}
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" strokeWidth={1.5} />
              <Input 
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="Contraseña" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-14 pl-12 rounded-2xl border-slate-200 bg-white shadow-inner focus-visible:ring-1 focus-visible:ring-[#2878a8] transition-all text-lg"
              />
            </div>

            {/* Botón de Entrar */}
            <Button 
              type="submit" 
              disabled={loading}
              className="w-full h-14 rounded-full bg-[#2878a8] font-bold text-xl text-white shadow-lg transition-all hover:bg-[#1e5a7e] hover:shadow-xl hover:shadow-[#2878a8]/20 disabled:opacity-70 group"
            >
              {loading ? (
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <span className="flex items-center gap-3">
                  Ingresar al Ranking
                  <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              )}
            </Button>
          </form>
          
          <div className="mt-10 text-center border-t border-slate-100 pt-6">
            <Link href="/" className="text-sm font-bold uppercase tracking-widest text-[#2878a8]/80 hover:text-[#2878a8] transition-colors">
              ← Volver a la página principal de votaciones
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
