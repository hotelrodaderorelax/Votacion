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
    
    // 1. OBTENER EMPLEADOS ORDENADOS ALFABÉTICAMENTE DESDE LA DB
    // Esto garantiza que Ezlatne, Lexilis, etc., aparezcan en orden A-Z
    const { data: allEmployees, error: empError } = await supabase
      .from('employees')
      .select('id, name, role, image_url, department')
      .order('name', { ascending: true }) // Tu mejora aplicada aquí

    if (empError) throw empError

    // 2. Traer los votos del mes
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

    // 3. Procesar datos (Promedios y Votos Totales)
    const result = (allEmployees || []).map(emp => {
      const empVotes = votes.filter(v => v.employee_id === emp.id)
      const total = empVotes.length
      
      const sum = empVotes.reduce((acc, curr) => {
        // Usamos overall_rating o promediamos las 4 categorías de tu DB
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

    // Al usar el .order() de Supabase arriba, ya no necesitas .sort() aquí.
    return NextResponse.json(result)

  } catch (error: any) {
    console.error("Error crítico:", error.message)
    // Devolvemos array vacío para evitar el error "not iterable" en el cliente
    return NextResponse.json([], { status: 500 })
  }
}
