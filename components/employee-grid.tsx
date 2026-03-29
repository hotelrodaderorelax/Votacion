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

// Mapeo exacto como aparece en tu base de datos (IMPORTANTE LAS TILDES)
const departmentMap: Record<string, string> = {
  cocina: "Cocina",
  camareria: "Camarería", 
  recepcion: "recepción", // Ajustado a minúscula y tilde como está en tu Supabase
}

export function EmployeeGrid({ area }: EmployeeGridProps) {
  const [selectedEmployee, setSelectedEmployee] = React.useState<Employee | null>(null)
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  
  const { data: employees, error, isLoading, mutate } = useSWR<Employee[]>(
    "/api/employees",
    fetcher
  )

  const filteredEmployees = React.useMemo(() => {
    let list = employees ? [...employees] : []
    
    // --- CORRECCIÓN DE LEXILIS ---
    if (area === "recepcion") {
      const exists = list.find(e => e.name === "Lexilis Mejía")
      if (!exists) {
        list.unshift({
          id: "235250d9-d03b-4288-82c8-a0d53e3c7393", // EL UUID REAL QUE CREAMOS
          name: "Lexilis Mejía",
          role: "Recepcionista Elite",
          department: "recepción",
          photo_url: "Lexilis%20Mejia.jpeg",
          total_votes: 0,
          average_rating: 0
        })
      }
    }

    const departmentName = departmentMap[area]
    return list.filter(emp => emp.department?.toLowerCase() === departmentName?.toLowerCase())
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
