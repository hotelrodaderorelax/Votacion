"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { User, Lock, KeyRound } from "lucide-react"

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
    // CONTENEDOR PRINCIPAL: Con fondo náutico y manchas de gradiente naranja
    <div className="relative flex min-h-screen items-center justify-center p-4 overflow-hidden bg-slate-50">
      
      {/* Patrón de fondo (requiere agregar la imagen en public/ o usar patrón SVG inline) */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "url('/pattern-nautical.svg')", // Asegúrate de tener un SVG aquí o usa uno inline
          backgroundSize: "300px"
        }}
      />

      {/* Manchas decorativas de gradiente naranja */}
      <div className="absolute -bottom-20 -left-20 h-96 w-96 rounded-full bg-[#f5ac0a]/10 blur-3xl" />
      <div className="absolute -top-20 -right-20 h-96 w-96 rounded-full bg-[#f5ac0a]/10 blur-3xl" />

      {/* LA TARJETA DE LOGIN */}
      <Card className="relative w-full max-w-md overflow-hidden border border-[#2878a8]/10 bg-white/90 shadow-[0_8px_30px_rgb(0,0,0,0.08)] backdrop-blur-sm transition-all duration-300 hover:shadow-[0_8px_40px_rgb(40,120,168,0.1)]">
        
        {/* Línea superior con gradiente de marca */}
        <div className="h-2 w-full bg-gradient-to-r from-[#2878a8] via-[#2878a8] to-[#f5ac0a]" />

        <CardHeader className="pt-10 pb-6 text-center">
          {/* Icono decorativo de marca */}
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 ring-8 ring-white shadow-inner">
            <KeyRound className="h-8 w-8 text-[#2878a8]" strokeWidth={1.5} />
          </div>
          
          <CardTitle className="font-serif text-3xl font-black text-[#2878a8] tracking-tight uppercase italic">
            Acceso <span className="text-[#f5ac0a]">Relax</span>
          </CardTitle>
          <p className="mt-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
            Hotel Rodadero Relax
          </p>
        </CardHeader>
        
        <CardContent className="px-8 pb-10 pt-0">
          <form onSubmit={handleLogin} className="space-y-5">
            
            {/* Campo Usuario con Icono */}
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" strokeWidth={1.5} />
              <Input 
                id="user"
                name="user"
                type="text"
                autoComplete="username"
                required
                placeholder="Usuario" 
                value={user}
                onChange={(e) => setUser(e.target.value)}
                className="h-12 pl-11 rounded-xl border-slate-200 bg-white/50 shadow-inner focus-visible:ring-1 focus-visible:ring-[#2878a8] transition-all"
              />
            </div>

            {/* Campo Contraseña con Icono */}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" strokeWidth={1.5} />
              <Input 
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="Contraseña" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 pl-11 rounded-xl border-slate-200 bg-white/50 shadow-inner focus-visible:ring-1 focus-visible:ring-[#2878a8] transition-all"
              />
            </div>

            {/* Botón de Entrar */}
            <Button 
              type="submit" 
              disabled={loading}
              className="w-full h-12 rounded-full bg-[#2878a8] font-bold text-white shadow-lg transition-all hover:bg-[#1e5a7e] hover:shadow-xl hover:shadow-[#2878a8]/20 disabled:opacity-70 group"
            >
              {loading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <span className="flex items-center gap-2">
                  Ingresar al Ranking
                  <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              )}
            </Button>
          </form>
          
          <div className="mt-8 text-center">
            <Link href="/" className="text-xs font-bold uppercase tracking-widest text-[#2878a8]/70 hover:text-[#2878a8] transition-colors">
              ← Volver a votaciones
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
