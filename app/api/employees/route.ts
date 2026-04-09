import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabaseUrl = 'https://kfltdikdcxtombnwalxj.supabase.co'
const supabaseAnonKey = 'sb_publishable_hW2Wfpw46rvONH8Fg_kW9A_RP7L1GcA'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const monthParam = searchParams.get('month')

    // 1. TRAER TODOS LOS EMPLEADOS (Como en tu código 1)
    // Esto garantiza que todos aparezcan, tengan votos o no.
    const { data: allEmployees, error: empError } = await supabase
      .from('employees')
      .select('id, name, role, image_url')
      .order('name', { ascending: true })

    if (empError) throw empError

    // 2. LÓGICA DE VOTOS POR MES
    let votes: any[] = []
    
    // Si hay un mes seleccionado, filtramos. Si no, mostramos 0 votos para todos.
    if (monthParam) {
      const startDate = `${monthParam}-01T00:00:00Z`
      const dateObj = new Date(monthParam + "-02")
      dateObj.setMonth(dateObj.getMonth() + 1)
      const endDate = dateObj.toISOString()

      const { data: votesData, error: votesError } = await supabase
        .from('staff_votes')
        .select('employee_id, overall_rating')
        .gte('created_at', startDate)
        .lt('created_at', endDate)

      if (votesError) throw votesError
      votes = votesData || []
    }

    // 3. MAPEO SEGURO (Combinando lo mejor de ambos)
    const result = (allEmployees || []).map(emp => {
      const empVotes = votes.filter(v => v.employee_id === emp.id)
      const total = empVotes.length
      const avg = total > 0 
        ? empVotes.reduce((acc, curr) => acc + curr.overall_rating, 0) / total 
        : 0

      return {
        ...emp,
        total_votes: total,
        average_rating: Number(avg.toFixed(1)) // Mantenemos el formato limpio
      }
    })

    return NextResponse.json(result)

  } catch (error: any) {
    console.error("Error en API:", error.message)
    // EL SEGURO DE VIDA: Si algo falla, devolvemos un array vacío []
    // Esto evita que el frontend diga "Application error"
    return NextResponse.json([])
  }
}
