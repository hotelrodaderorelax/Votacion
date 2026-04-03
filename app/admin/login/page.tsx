"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function AdminLoginPage() {
  const [password, setPassword] = React.useState("")
  const [user, setUser] = React.useState("")
  const router = useRouter()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Define aquí tus credenciales
    if (user === "admin" && password === "relax2026") {
      localStorage.setItem("admin_auth", "true")
      router.push("/admin")
    } else {
      alert("Credenciales incorrectas")
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md border-t-4 border-[#2878a8]">
        <CardHeader>
          <CardTitle className="text-center font-serif text-2xl text-[#2878a8]">
            Acceso Administrativo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input 
              placeholder="Usuario" 
              value={user}
              onChange={(e) => setUser(e.target.value)}
            />
            <Input 
              type="password" 
              placeholder="Contraseña" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button className="w-full bg-[#2878a8] hover:bg-[#2878a8]/90">
              Entrar
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
