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

const departmentMap: Record<string, string> = {
  cocina: "Cocina",
  camareria: "Housekeeping",
  recepcion: "Recepción",
  bar: "Bar & Restaurante",
  mantenimiento: "Mantenimiento",
}

export function EmployeeGrid({ area }: EmployeeGridProps) {
  const [selectedEmployee, setSelectedEmployee] = React.useState<Employee | null>(null)
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  
  const { data: employees, error, isLoading, mutate } = useSWR<Employee[]>(
    "/api/employees",
    fetcher
  )

  const filteredEmployees = React.useMemo(() => {
    if (!employees) return []
    const departmentName = departmentMap[area]
    if (!departmentName) return employees
    return employees.filter(emp => emp.department === departmentName)
  }, [employees, area])

  const handleVoteSuccess = () => {
    mutate()
  }

  const areaNames: Record<string, string> = {
    cocina: "Cocina",
    camareria: "Housekeeping",
    recepcion: "Recepción",
    bar: "Bar & Restaurante",
    mantenimiento: "Mantenimiento",
    todos: "Todos los Departamentos",
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-border bg-card p-8">
        <div className="flex flex-col items-center gap-4">
          <Spinner className="h-8 w-8 text-[#2878a8]" />
          <p className="text-muted-foreground">Cargando equipo...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-border bg-card p-8">
        <p className="text-destructive">Error al cargar los empleados</p>
      </div>
    )
  }

  const displayEmployees = area === "todos" ? employees || [] : filteredEmployees

  return (
    <>
      <div className="rounded-[2rem] border-4 border-[#2878a8]/10 bg-white p-6 shadow-2xl md:p-8">
        <h3 className="text-center text-3xl font-black text-[#2878a8] uppercase italic">
          Equipo de {areaNames[area]}
        </h3>
        <div className="mx-auto mt-2 h-1.5 w-24 rounded-full bg-[#f5ac0a]" />
        
        {displayEmployees.length === 0 ? (
          <div className="mt-8 flex min-h-[200px] items-center justify-center">
            <p className="text-muted-foreground">No hay empleados en este departamento</p>
          </div>
        ) : (
          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {displayEmployees.map((employee, index) => {
              
              // --- LÓGICA DE CORRECCIÓN DE IMAGEN ---
              // Forzamos la ruta con espacio si es Lexilis para que coincida con tu archivo en public
              const finalPhoto = employee.name.includes("Lexilis") 
                ? "/Lexilis Mejia.jpeg" 
                : employee.photo_url;

              return (
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
                      image: finalPhoto, // Se envía la ruta corregida a la tarjeta
                      totalVotes: employee.total_votes,
                      averageRating: employee.average_rating,
                    }}
                    onClick={() => {
                      // Al seleccionar, actualizamos el estado con la foto corregida para el modal
                      setSelectedEmployee({ ...employee, photo_url: finalPhoto });
                      setIsDialogOpen(true);
                    }}
                  />
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      <RatingDialog
        employee={selectedEmployee ? {
          id: selectedEmployee.id,
          name: selectedEmployee.name,
          role: selectedEmployee.role,
          image: selectedEmployee.photo_url, // Ahora recibe la ruta con espacio
        } : null}
        area={area}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSuccess={handleVoteSuccess}
      />
    </>
  )
}
