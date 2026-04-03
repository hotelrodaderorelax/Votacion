"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
// Mantenemos solo los iconos esenciales que ya sabemos que funcionan
import { User, Lock, KeyRound } from "lucide-react"

// --- COMPONENTE DE FONDO CORREGIDO PARA CASCADA INTENSA ---
const HotelIconCascade = () => {
  const [mounted, setMounted] = React.useState(false)
  
  // Fix para evitar errores de hidratación en Next.js
  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Definimos emojis representativos en lugar de importar iconos
  // 🌴 Playa, 👨‍🍳 Cocina, 🛎️ Recepción, 🛏️ Habitaciones
  const emojis = ["🌴", "👨‍🍳", "🛎️", "🛏️"];

  if (!mounted) return null

  // Aumentamos la cantidad de emojis para cubrir más huecos
  const emojiCount = 100;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <style>{`
        /* Animación para que la posición horizontal cambie aleatoriamente en cada ciclo */
        @keyframes fall {
          0% { 
            transform: translateY(-100%) rotate(0deg); 
            opacity: 0; 
            left: calc(var(--base-left) + (var(--rand-offset) * 10%)); /* Variación aleatoria de posición inicial */
          }
          10% { opacity: 0.6; } /* Emojis con más opacidad */
          90% { opacity: 0.6; }
          100% { 
            transform: translateY(100vh) rotate(360deg); 
            opacity: 0; 
            left: calc(var(--base-left) + (var(--rand-offset) * -10%)); /* Variación aleatoria de posición final */
          }
        }
      `}</style>
      {[...Array(emojiCount)].map((_, i) => {
        const emoji = emojis[i % emojis.length]
        
        // Generamos variables CSS aleatorias para la animación
        const baseLeft = (i / emojiCount) * 100; // Distribución base
        const randOffset = Math.random() * 2 - 1; // Entre -1 y 1
        const duration = 15 + Math.random() * 20; // Velocidad aleatoria
        const delay = Math.random() * -30; // Retraso aleatorio negativo

        return (
          <div
            key={i}
            className="absolute text-3xl" // Emojis grandes y coloridos
            style={{
              "--base-left": `${baseLeft}%`,
              "--rand-offset": randOffset,
              top: `-50px`,
              animation: `fall ${duration}s linear infinite`,
              animationDelay: `${delay}s`,
            }}
          >
            {emoji}
          </div>
        )
      })}
    </div>
  )
}

export default function AdminLoginPage() {
  const [password, setPassword] = React.useState("")
  const [user, setUser] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const router = useRouter()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Credenciales de acceso
    if (user === "admin" && password === "relax2026") {
      document.cookie = "admin_auth=true; path=/; max-age=86400; SameSite=Strict"
      router.push("/admin")
    } else {
      setTimeout(() => {
        alert("Credenciales incorrectas")
        setLoading(false)
        setPassword("")
      }, 800)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center p-4 overflow-hidden bg-slate-50">
      <HotelIconCascade />

      <Card className="relative w-full max-w-md overflow-hidden border border-[#2878a8]/10 bg-white/95 shadow-2xl backdrop-blur-md z-10">
        <div className="h-2 w-full bg-gradient-to-r from-[#2878a8] to-[#f5ac0a]" />

        <CardHeader className="pt-10 pb-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-md border border-slate-100">
            <KeyRound className="h-8 w-8 text-[#2878a8]" />
          </div>
          <CardTitle className="font-serif text-3xl font-black text-[#2878a8] uppercase italic leading-none">
            Acceso <span className="text-[#f5ac0a]">Relax</span>
          </CardTitle>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mt-1">
            Administración Hotel
          </p>
        </CardHeader>
        
        <CardContent className="px-8 pb-10 pt-0">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
              <Input 
                id="user"
                name="user"
                type="text"
                autoComplete="username"
                required
                placeholder="Usuario" 
                value={user}
                onChange={(e) => setUser(e.target.value)}
                className="h-12 pl-10 rounded-xl"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
              <Input 
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="Contraseña" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 pl-10 rounded-xl"
              />
            </div>

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full h-12 rounded-full bg-[#2878a8] font-bold text-white hover:bg-[#1e5a7e] transition-all"
            >
              {loading ? "Cargando..." : "Entrar al Panel"}
            </Button>
          </form>
          
          <div className="mt-8 text-center border-t border-slate-100 pt-6">
            <Link href="/" className="text-xs font-bold uppercase tracking-widest text-[#2878a8]/70 hover:text-[#2878a8] transition-colors">
              ← Volver al inicio
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
