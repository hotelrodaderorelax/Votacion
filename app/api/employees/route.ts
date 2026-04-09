import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabaseUrl = 'https://kfltdikdcxtombnwalxj.supabase.co'
const supabaseAnonKey = 'sb_publishable_hW2Wfpw46rvONH8Fg_kW9A_RP7L1GcA'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function GET(request: Request) {
  try {
    // 1. Obtener el mes de la URL
    const { searchParams } = new URL(request.url)
    const monthParam = searchParams.get('month')

    // 2. Si no hay mes, calculamos el actual para que no dé error 400
    const currentMonth = monthParam || new Date().toISOString().slice(0, 7);

    // Definimos el rango de fechas para el filtro
    const startDate = `${currentMonth}-01T00:00:00Z`
    const lastDay = new Date(new Date(currentMonth + "-01").getFullYear(), new Date(currentMonth + "-01").getMonth() + 1, 0).getDate();
    const endDate = `${currentMonth}-${lastDay}T23:59:59Z`

    // 3. Traer los empleados (La base)
    const { data: employees, error: empError } = await supabase
      .from('employees')
      .select('id, name, role, image_url')
    
    if (empError) throw empError

    // 4. Traer los votos filtrados por fecha
    const { data: votes, error: votesError } = await supabase
      .from('staff_votes')
      .select('employee_id, overall_rating')
      .gte('created_at', startDate)
      .lte('created_at', endDate)

    if (votesError) throw votesError

    // 5. EQUILIBRIO: Mapeo seguro con valores por defecto
    // Si 'employees' o 'votes' son null por alguna razón, usamos []
    const safeEmployees = employees || []
    const safeVotes = votes || []

    const result = safeEmployees.map(emp => {
      const empVotes = safeVotes.filter(v => v.employee_id === emp.id)
      const total = empVotes.length
      const avg = total > 0 
        ? empVotes.reduce((acc, curr) => acc + curr.overall_rating, 0) / total 
        : 0

      return {
        id: emp.id,
        name: emp.name || "Sin nombre",
        role: emp.role || "Staff",
        image_url: emp.image_url || null,
        total_votes: total,
        average_rating: avg
      }
    })

    // Siempre devolvemos el JSON, incluso si es un array vacío
    return NextResponse.json(result)

  } catch (error: any) {
    console.error("Error equilibrado API:", error.message)
    // Devolvemos un array vacío en lugar de un error 500 para NO romper el cliente
    return NextResponse.json([], { status: 200 })
  }
}
