import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const supabaseUrl = 'https://kfltdikdcxtombnwalxj.supabase.co'
const supabaseAnonKey = 'sb_publishable_hW2Wfpw46rvONH8Fg_kW9A_RP7L1GcA'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const monthParam = searchParams.get('month')

    // 1. Obtener empleados (Esto SIEMPRE debe funcionar)
    const { data: allEmployees, error: empError } = await supabase
      .from('employees')
      .select('id, name, role, image_url')

    if (empError) throw empError

    let votes: any[] = []

    // 2. Solo buscar votos si hay un parámetro de mes
    if (monthParam) {
      const startDate = `${monthParam}-01T00:00:00Z`
      const [year, month] = monthParam.split('-').map(Number)
      const nextMonthDate = new Date(Date.UTC(year, month, 1))
      const endDate = nextMonthDate.toISOString()

      const { data: votesData, error: votesError } = await supabase
        .from('staff_votes')
        .select('employee_id, overall_rating, friendliness, efficiency, problem_solving, cleanliness')
        .gte('created_at', startDate)
        .lt('created_at', endDate)

      if (!votesError) {
        votes = votesData || []
      }
    }

    // 3. Mapear resultados (Si no hay votos, devolverá total_votes: 0)
    const result = (allEmployees || []).map(emp => {
      const empVotes = votes.filter(v => v.employee_id === emp.id)
      const total = empVotes.length
      
      const sum = empVotes.reduce((acc, curr) => {
        const rating = curr.overall_rating ?? 
          ((curr.friendliness + curr.efficiency + curr.problem_solving + curr.cleanliness) / 4)
        return acc + (Number(rating) || 0)
      }, 0)

      const avg = total > 0 ? sum / total : 0

      return {
        ...emp,
        total_votes: total,
        average_rating: parseFloat(avg.toFixed(1))
      }
    })

    // 4. Importante: Devolver siempre un Array para evitar el "not iterable"
    return NextResponse.json(result)

  } catch (error: any) {
    console.error("Error en API:", error.message)
    // Devolvemos array vacío en lugar de error para que el cliente no muera
    return NextResponse.json([], { status: 500 })
  }
}
