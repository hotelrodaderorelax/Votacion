import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabaseUrl = 'https://kfltdikdcxtombnwalxj.supabase.co'
const supabaseAnonKey = 'sb_publishable_hW2Wfpw46rvONH8Fg_kW9A_RP7L1GcA'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const monthParam = searchParams.get('month') // Ejemplo: "2026-04"

    if (!monthParam) {
      return NextResponse.json({ error: "Mes requerido" }, { status: 400 })
    }

    // Definimos el rango del mes
    const startDate = `${monthParam}-01T00:00:00Z`
    const lastDay = new Date(new Date(monthParam + "-01").getFullYear(), new Date(monthParam + "-01").getMonth() + 1, 0).getDate();
    const endDate = `${monthParam}-${lastDay}T23:59:59Z`

    // CAMBIO IMPORTANTE: 
    // Si usas 'employee_rankings' y esa vista NO tiene filtros, 
    // lo mejor es volver a la consulta manual para poder filtrar por fecha REAL.
    
    // 1. Traer empleados
    const { data: employees, error: empError } = await supabase
      .from('employees')
      .select('id, name, role, image_url')
    
    if (empError) throw empError

    // 2. Traer votos filtrados por el mes seleccionado
    const { data: votes, error: votesError } = await supabase
      .from('staff_votes')
      .select('employee_id, overall_rating')
      .gte('created_at', startDate)
      .lte('created_at', endDate)

    if (votesError) throw votesError

    // 3. Calcular ranking en tiempo real con los datos filtrados
    const result = employees.map(emp => {
      const empVotes = votes.filter(v => v.employee_id === emp.id)
      const total = empVotes.length
      const avg = total > 0 
        ? empVotes.reduce((acc, curr) => acc + curr.overall_rating, 0) / total 
        : 0

      return {
        ...emp,
        total_votes: total,
        average_rating: avg
      }
    })

    return NextResponse.json(result)

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
