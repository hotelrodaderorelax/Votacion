"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
// Cambiamos Broom por Waves para evitar el error de compilación
import { User, Lock, KeyRound, Utensils, BedDouble, PalmTree, BellRing, Waves } from "lucide-react"

const HotelIconCascade = () => {
  const [mounted, setMounted] = React.useState(false)
  
  React.useEffect(() => {
    setMounted(true)
  }, [])

  const icons = [
    { Icon: PalmTree, color: "text-[#2878a8]" },
    { Icon: Utensils, color: "text-[#f5ac0a]" },
    { Icon: BellRing, color: "text-[#2878a8]" },
    { Icon: Waves, color: "text-[#f5ac0a]" }, // Icono de olas para la cascada
    { Icon: BedDouble, color: "text-[#2878a8]" },
  ]

  if (!mounted) return null

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <style>{`
        @keyframes fall {
          0% { transform: translateY(-100%) rotate(0deg); opacity: 0; }
          10% { opacity: 0.2; }
          90% { opacity: 0.2; }
          100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
        }
      `}</style>
      {[...Array(30)].map((_, i) => {
        const { Icon, color } = icons[i % icons.length]
        return (
          <div
            key={i}
            className={`absolute ${color}`}
            style={{
              left: `${(i * 3.3) % 100}%`,
              top: `-50px`,
              animation: `fall ${12 + (i % 8)}s linear infinite`,
              animationDelay: `${i * -0.5}s`,
            }}
          >
            <Icon strokeWidth={1} size={24 + (i % 16)} />
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

      <Card className="relative w-full max-w-md overflow-hidden border border-[#2878a8]/10 bg-white/90 shadow-2xl backdrop-blur-md z-10">
        <div className="h-2 w-full bg-gradient-to-r from-[#2878a8] to-[#f5ac0a]" />

        <CardHeader className="pt-10 pb-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-md border border-slate-100">
            <KeyRound className="h-8 w-8 text-[#2878a8]" />
          </div>
          <CardTitle className="font-serif text-3xl font-black text-[#2878a8] uppercase italic">
            Acceso <span className="text-[#f5ac0a]">Relax</span>
          </CardTitle>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mt-1">
            Administración Hotel
          </p>
        </CardHeader>
        
        <CardContent className="px-8 pb-10">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
              <Input 
                type="text"
                placeholder="Usuario" 
                value={user}
                onChange={(e) => setUser(e.target.value)}
                className="h-12 pl-10 rounded-xl"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
              <Input 
                type="password"
                placeholder="Contraseña" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 pl-10 rounded-xl"
                required
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
          
          <div className="mt-8 text-center">
            <Link href="/" className="text-xs font-bold uppercase text-[#2878a8]/60 hover:text-[#2878a8]">
              ← Volver al inicio
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
