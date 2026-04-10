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
    
    // 1. Obtener empleados
    const { data: allEmployees, error: empError } = await supabase
      .from('employees')
      .select('id, name, role, image_url, department')

    if (empError) throw empError

    // 2. Obtener votos del mes si existe el parámetro
    let votes: any[] = []
    if (monthParam) {
      const startDate = `${monthParam}-01T00:00:00Z`
      const [year, month] = monthParam.split('-').map(Number)
      const nextMonthDate = new Date(Date.UTC(year, month, 1))
      const endDate = nextMonthDate.toISOString()

      const { data: votesData, error: votesError } = await supabase
        .from('staff_votes')
        .select('*')
        .gte('created_at', startDate)
        .lt('created_at', endDate)

      if (!votesError) votes = votesData || []
    }

    // 3. Procesar datos y calcular promedios
    const result = (allEmployees || []).map(emp => {
      const empVotes = votes.filter(v => v.employee_id === emp.id)
      const total = empVotes.length
      
      const sum = empVotes.reduce((acc, curr) => {
        const rating = curr.overall_rating ?? 
          ((Number(curr.friendliness || 0) + Number(curr.efficiency || 0) + 
            Number(curr.problem_solving || 0) + Number(curr.cleanliness || 0)) / 4)
        return acc + rating
      }, 0)

      return {
        ...emp,
        total_votes: total,
        average_rating: total > 0 ? parseFloat((sum / total).toFixed(1)) : 0
      }
    })

    // --- EL CAMBIO ESTÁ AQUÍ ---
    // Ordenar alfabéticamente por nombre (A-Z)
    result.sort((a, b) => a.name.localeCompare(b.name))

    return NextResponse.json(result)

  } catch (error: any) {
    console.error("Error crítico:", error.message)
    return NextResponse.json([], { status: 500 })
  }
}
