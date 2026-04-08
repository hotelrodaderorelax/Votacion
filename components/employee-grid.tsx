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

// ORGANIZACIÓN POR ÁREAS: Mapeamos la carpeta con el departamento de la base de datos
const departmentMap: Record<string, string> = {
  cocina: "cocina",
  camareria: "camareria", 
  recepcion: "recepcion", 
}

export function EmployeeGrid({ area }: { area: string }) {
  const [selectedEmployee, setSelectedEmployee] = React.useState<Employee | null>(null)
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  
  const { data: employees, isLoading, mutate } = useSWR<Employee[]>("/api/employees", fetcher)

  const filteredEmployees = React.useMemo(() => {
    let list = employees ? [...employees] : []
    
    // Si no hay datos aún, o para asegurar que Lexilis aparezca en recepción:
    if (area === "recepcion") {
      const exists = list.find(e => e.name.toLowerCase().includes("lexilis"))
      if (!exists && list.length === 0) {
        // Esto es solo un respaldo por si la base de datos está vacía
        list.push({
          id: "lexilis-id",
          name: "Lexilis Mejía",
          role: "Recepción",
          department: "recepcion",
          photo_url: "/LEXILIS-1.jpeg",
          total_votes: 0,
          average_rating: 0
        })
      }
    }

    const departmentName = departmentMap[area] || area
    
    // Filtramos para que solo aparezcan los del área seleccionada
    return list.filter(emp => 
      emp.department?.toLowerCase().trim() === departmentName.toLowerCase().trim()
    )
  }, [employees, area])

  if (isLoading) return (
    <div className="flex min-h-[300px] items-center justify-center">
      <Spinner className="h-10 w-10 text-[#2878a8]" />
    </div>
  )

  return (
    <>
      <div className="rounded-[3rem] border-4 border-[#2878a8]/10 bg-white p-8 shadow-2xl">
        {/* Título dinámico: Equipo de Recepción / Equipo de Camarería */}
        <h3 className="text-center text-3xl font-black text-[#2878a8] uppercase italic">
          Equipo de {area === 'recepcion' ? 'Recepción' : area === 'camareria' ? 'Camarería' : area}
        </h3>
        <div className="mx-auto mt-2 h-1.5 w-24 rounded-full bg-[#f5ac0a]" />
        
        <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filteredEmployees.map((employee, index) => (
            <motion.div 
              key={employee.id} 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: index * 0.1 }}
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
                onClick={() => { 
                  setSelectedEmployee(employee); 
                  setIsDialogOpen(true); 
                }}
              />
            </motion.div>
          ))}
        </div>

        {filteredEmployees.length === 0 && (
          <p className="text-center text-slate-400 mt-10 uppercase text-xs font-bold tracking-widest">
            No hay personal asignado a esta área todavía
          </p>
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
        onSuccess={() => mutate()}
      />
    </>
  )
}
