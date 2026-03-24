"use client"

import * as React from "react"
import { motion } from "framer-motion"
import useSWR from "swr"
import { EmployeeCard } from "@/components/employee-card"
import { RatingDialog } from "@/components/rating-dialog"
import { Spinner } from "@/components/ui/spinner"

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

interface EmployeeGridProps {
  area: string
}

// 1. Ajustado a tus 3 áreas reales
const departmentMap: Record<string, string> = {
  cocina: "Cocina",
  camareria: "Camarería", // Antes decía Housekeeping
  recepcion: "Recepción",
}

export function EmployeeGrid({ area }: EmployeeGridProps) {
  const [selectedEmployee, setSelectedEmployee] = React.useState<Employee | null>(null)
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  
  const { data: employees, error, isLoading, mutate } = useSWR<Employee[]>(
    "/api/employees",
    fetcher
  )

  // 2. Lógica para incluirte a ti y filtrar por departamento
  const filteredEmployees = React.useMemo(() => {
    let list = employees ? [...employees] : []
    
    // Si estamos en recepción, aseguramos que Lexilis aparezca (Simulado o desde API)
    if (area === "recepcion") {
      const exists = list.find(e => e.name === "Lexilis Mejía")
      if (!exists) {
        list.unshift({
          id: "lexilis-01",
          name: "Lexilis Mejía",
          role: "Recepcionista Elite",
          department: "Recepción",
          photo_url: "/WhatsApp Image 2026-01-22 at 11.17.33 AM.jpeg",
          total_votes: 140,
          average_rating: 5
        })
      }
    }

    const departmentName = departmentMap[area]
    return list.filter(emp => emp.department === departmentName)
  }, [employees, area])

  const handleEmployeeClick = (employee: Employee) => {
    setSelectedEmployee(employee)
    setIsDialogOpen(true)
  }

  const handleVoteSuccess = () => {
    mutate()
  }

  const areaNames: Record<string, string> = {
    cocina: "Cocina",
    camareria: "Camarería",
    recepcion: "Recepción",
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center p-8">
        <div className="flex flex-col items-center gap-4 text-[#2878a8]">
          <Spinner className="h-10 w-10" />
          <p className="font-bold uppercase tracking-widest text-xs">Cargando Equipo...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="rounded-[3rem] border-4 border-[#2878a8]/10 bg-white p-8 shadow-2xl">
        <div className="mb-10 text-center">
          <h3 className="font-serif text-3xl font-black text-[#2878a8] uppercase italic tracking-tighter">
            Equipo de {areaNames[area]}
          </h3>
          <div className="mx-auto mt-2 h-1.5 w-24 rounded-full bg-[#f5ac0a]" />
          <p className="mt-4 text-slate-500 font-medium">
            Selecciona a un profesional para calificar su servicio
          </p>
        </div>
        
        {filteredEmployees.length === 0 ? (
          <div className="mt-8 flex min-h-[200px] items-center justify-center italic text-slate-400">
            No hay personal registrado en este departamento
          </div>
        ) : (
          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filteredEmployees.map((employee, index) => (
              <motion.div
                key={employee.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="cursor-pointer"
                onClick={() => handleEmployeeClick(employee)}
              >
                {/* Usamos el EmployeeCard pero le daremos estilo con tus colores en su propio componente luego */}
                <EmployeeCard
                  employee={{
                    id: employee.id,
                    name: employee.name,
                    role: employee.role,
                    image: employee.photo_url,
                    totalVotes: employee.total_votes,
                    averageRating: employee.average_rating,
                  }}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <RatingDialog
        employee={selectedEmployee ? {
          id: selectedEmployee.id,
          name: selectedEmployee.name,
          role: selectedEmployee.role,
          image: selectedEmployee.photo_url,
        } : null}
        area={area}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSuccess={handleVoteSuccess}
      />
    </>
  )
}
