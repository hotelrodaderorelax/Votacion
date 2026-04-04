
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

  photo_url: string // Mantenemos photo_url porque así viene de tu API

  total_votes: number

  average_rating: number

}



// Mapeo exacto a las minúsculas que tienes en Supabase

const departmentMap: Record<string, string> = {

  cocina: "Cocina",

  camareria: "Camarería", 

  recepcion: "recepción", // "recepción" en minúscula como en tu imagen

}



export function EmployeeGrid({ area }: { area: string }) {

  const [selectedEmployee, setSelectedEmployee] = React.useState<Employee | null>(null)

  const [isDialogOpen, setIsDialogOpen] = React.useState(false)

  

  const { data: employees, isLoading, mutate } = useSWR<Employee[]>("/api/employees", fetcher)



  const filteredEmployees = React.useMemo(() => {

    let list = employees ? [...employees] : []

    

    if (area === "recepcion") {

      const exists = list.find(e => e.name === "Lexilis Mejía")

      if (!exists) {

        list.unshift({

          id: "235250d9-d03b-4288-82c8-a0d53e3c7393", // ID real

          name: "Lexilis Mejía",

          role: "Recepcionista Elite",

          department: "recepción",

          photo_url: "/LexilisMejia.jpeg", // Ruta local sin espacios

          total_votes: 0,

          average_rating: 0

        })

      }

    }



    const departmentName = departmentMap[area]

    return list.filter(emp => emp.department?.toLowerCase() === departmentName?.toLowerCase())

  }, [employees, area])



  if (isLoading) return (

    <div className="flex min-h-[300px] items-center justify-center">

      <Spinner className="h-10 w-10 text-[#2878a8]" />

    </div>

  )



  return (

    <>

      <div className="rounded-[3rem] border-4 border-[#2878a8]/10 bg-white p-8 shadow-2xl">

        <h3 className="text-center text-3xl font-black text-[#2878a8] uppercase italic">Equipo de {area}</h3>

        <div className="mx-auto mt-2 h-1.5 w-24 rounded-full bg-[#f5ac0a]" />

        

        <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">

          {filteredEmployees.map((employee, index) => (

            <motion.div key={employee.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>

              <EmployeeCard

                employee={{

                  id: employee.id,

                  name: employee.name,

                  role: employee.role,

                  image: employee.photo_url, // Mapeamos photo_url de la API a image del componente

                  totalVotes: employee.total_votes,

                  averageRating: employee.average_rating,

                }}

                onClick={() => { setSelectedEmployee(employee); setIsDialogOpen(true); }}

              />

            </motion.div>

          ))}

        </div>

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
