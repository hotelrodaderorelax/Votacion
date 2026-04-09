import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// ESTA LÍNEA SOLUCIONA EL ERROR DE VERCEL
export const dynamic = 'force-dynamic'

const supabaseUrl = 'https://kfltdikdcxtombnwalxj.supabase.co'
const supabaseAnonKey = 'sb_publishable_hW2Wfpw46rvONH8Fg_kW9A_RP7L1GcA'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const monthParam = searchParams.get('month')

  // 1. Obtener todos los empleados activos primero
    const { data: allEmployees, error: empError } = await supabase
      .from('employees')
      .select('id, name, role, image_url')

    if (empError) throw empError


    // 2. Cargamos votos si hay mes seleccionado
    let votes: any[] = []
    if (monthParam) {
      const startDate = `${monthParam}-01T00:00:00Z`
      const dateObj = new Date(monthParam + "-02")
      dateObj.setMonth(dateObj.getMonth() + 1)
      const endDate = dateObj.toISOString()

      const { data: votesData } = await supabase
        .from('staff_votes')
        .select('employee_id, overall_rating')
        .gte('created_at', startDate)
        .lt('created_at', endDate)
      
      votes = votesData || []
    }

    // 3. Mezclamos los datos
    const result = (allEmployees || []).map(emp => {
      const empVotes = votes.filter(v => v.employee_id === emp.id)
      const total = empVotes.length
      const avg = total > 0 
        ? empVotes.reduce((acc, curr) => acc + curr.overall_rating, 0) / total 
        : 0

      return {
        ...emp,
        total_votes: total,
        average_rating: Number(avg.toFixed(1))
      }
    })

    return NextResponse.json(result)

  } catch (error: any) {
    console.error("Error detallado:", error.message)
    return NextResponse.json([]) // Array vacío para evitar errores en el cliente
  }
}
