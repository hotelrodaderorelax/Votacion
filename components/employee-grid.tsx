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

  const handleEmployeeClick = (employee: Employee) => {
    setSelectedEmployee(employee)
    setIsDialogOpen(true)
  }

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
          <Spinner className="h-8 w-8 text-primary" />
          <p className="text-muted-foreground">Cargando empleados...</p>
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
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8">
        <h3 className="text-center font-serif text-2xl font-semibold text-foreground">
          Equipo de {areaNames[area]}
        </h3>
        <p className="mt-2 text-center text-muted-foreground">
          Selecciona a un empleado para calificarlo
        </p>
        
        {displayEmployees.length === 0 ? (
          <div className="mt-8 flex min-h-[200px] items-center justify-center">
            <p className="text-muted-foreground">No hay empleados en este departamento</p>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {displayEmployees.map((employee, index) => (
              <motion.div
                key={employee.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
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
                  onClick={() => handleEmployeeClick(employee)}
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
