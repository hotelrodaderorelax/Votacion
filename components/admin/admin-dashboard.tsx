"use client"

import * as React from "react"
import useSWR from "swr"
import { motion } from "framer-motion"
import { 
  Trophy, 
  Users, 
  Star, 
  TrendingUp,
  Award,
  Medal,
  ArrowLeft
} from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

type Employee = {
  id: string
  name: string
  role: string
  department: string
  photo_url: string
  total_votes: number
  average_rating: number
}

export function AdminDashboard() {
  const { data: employees, isLoading, error } = useSWR<Employee[]>(
    "/api/employees",
    fetcher,
    { refreshInterval: 30000 }
  )

  const sortedEmployees = React.useMemo(() => {
    if (!employees) return []
    return [...employees].sort((a, b) => b.average_rating - a.average_rating)
  }, [employees])

  const stats = React.useMemo(() => {
    if (!employees) return { totalVotes: 0, avgRating: 0, topPerformers: 0 }
    const totalVotes = employees.reduce((sum, e) => sum + e.total_votes, 0)
    const avgRating = employees.length > 0 
      ? employees.reduce((sum, e) => sum + e.average_rating, 0) / employees.length 
      : 0
    const topPerformers = employees.filter(e => e.average_rating >= 4.5).length
    return { totalVotes, avgRating, topPerformers }
  }, [employees])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Spinner className="h-8 w-8 text-primary" />
          <p className="text-muted-foreground">Cargando dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-destructive">Error al cargar los datos</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="font-serif text-2xl font-bold text-foreground">
                  Panel de Administración
                </h1>
                <p className="text-sm text-muted-foreground">
                  Hotel Rodadero Relax - Empleado del Mes
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="h-6 w-6 text-accent" />
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total de Votos
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{stats.totalVotes}</div>
                <p className="text-xs text-muted-foreground">votos recibidos este mes</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Calificación Promedio
                </CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">
                  {stats.avgRating.toFixed(1)}
                </div>
                <p className="text-xs text-muted-foreground">de 5.0 estrellas</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Top Performers
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{stats.topPerformers}</div>
                <p className="text-xs text-muted-foreground">empleados con 4.5+ estrellas</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Top 3 Podium */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-serif">
                <Trophy className="h-5 w-5 text-accent" />
                Top 3 del Mes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-center gap-4 py-8">
                {/* 2nd Place */}
                {sortedEmployees[1] && (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex flex-col items-center"
                  >
                    <div className="relative">
                      <div className="h-20 w-20 overflow-hidden rounded-full border-4 border-gray-400 bg-muted">
                        <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-muted-foreground">
                          {sortedEmployees[1].name.charAt(0)}
                        </div>
                      </div>
                      <div className="absolute -bottom-2 -right-2 rounded-full bg-gray-400 p-2">
                        <Medal className="h-4 w-4 text-white" />
                      </div>
                    </div>
                    <div className="mt-4 h-24 w-24 rounded-t-lg bg-gray-400 flex items-center justify-center">
                      <span className="text-3xl font-bold text-white">2</span>
                    </div>
                    <p className="mt-2 text-center text-sm font-medium text-foreground">
                      {sortedEmployees[1].name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {sortedEmployees[1].average_rating.toFixed(1)} estrellas
                    </p>
                  </motion.div>
                )}

                {/* 1st Place */}
                {sortedEmployees[0] && (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-col items-center"
                  >
                    <div className="relative">
                      <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-accent bg-muted">
                        <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-muted-foreground">
                          {sortedEmployees[0].name.charAt(0)}
                        </div>
                      </div>
                      <div className="absolute -bottom-2 -right-2 rounded-full bg-accent p-2">
                        <Award className="h-5 w-5 text-accent-foreground" />
                      </div>
                    </div>
                    <div className="mt-4 h-32 w-28 rounded-t-lg bg-accent flex items-center justify-center">
                      <span className="text-4xl font-bold text-accent-foreground">1</span>
                    </div>
                    <p className="mt-2 text-center font-medium text-foreground">
                      {sortedEmployees[0].name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {sortedEmployees[0].average_rating.toFixed(1)} estrellas
                    </p>
                  </motion.div>
                )}

                {/* 3rd Place */}
                {sortedEmployees[2] && (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="flex flex-col items-center"
                  >
                    <div className="relative">
                      <div className="h-16 w-16 overflow-hidden rounded-full border-4 border-amber-700 bg-muted">
                        <div className="flex h-full w-full items-center justify-center text-xl font-bold text-muted-foreground">
                          {sortedEmployees[2].name.charAt(0)}
                        </div>
                      </div>
                      <div className="absolute -bottom-2 -right-2 rounded-full bg-amber-700 p-1.5">
                        <Medal className="h-3 w-3 text-white" />
                      </div>
                    </div>
                    <div className="mt-4 h-16 w-20 rounded-t-lg bg-amber-700 flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">3</span>
                    </div>
                    <p className="mt-2 text-center text-sm font-medium text-foreground">
                      {sortedEmployees[2].name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {sortedEmployees[2].average_rating.toFixed(1)} estrellas
                    </p>
                  </motion.div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Full Rankings Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="font-serif">Ranking Completo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {sortedEmployees.map((employee, index) => (
                  <motion.div
                    key={employee.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 + index * 0.05 }}
                    className={cn(
                      "flex items-center gap-4 rounded-lg border border-border p-4 transition-colors hover:bg-muted/50",
                      index === 0 && "border-accent bg-accent/5",
                      index === 1 && "border-gray-400 bg-gray-50",
                      index === 2 && "border-amber-700 bg-amber-50"
                    )}
                  >
                    <div className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full font-bold text-white",
                      index === 0 ? "bg-accent" : index === 1 ? "bg-gray-400" : index === 2 ? "bg-amber-700" : "bg-muted text-muted-foreground"
                    )}>
                      {index + 1}
                    </div>
                    
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-lg font-semibold text-muted-foreground">
                      {employee.name.charAt(0)}
                    </div>
                    
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{employee.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {employee.role} - {employee.department}
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-accent text-accent" />
                        <span className="font-semibold text-foreground">
                          {employee.average_rating.toFixed(1)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {employee.total_votes} votos
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  )
}
