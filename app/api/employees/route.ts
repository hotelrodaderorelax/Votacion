import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Evita que Vercel guarde en caché datos viejos
export const dynamic = 'force-dynamic'

const supabaseUrl = 'https://kfltdikdcxtombnwalxj.supabase.co'
const supabaseAnonKey = 'sb_publishable_hW2Wfpw46rvONH8Fg_kW9A_RP7L1GcA'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const monthParam = searchParams.get('month') // Formato esperado: "2026-04"

    if (!monthParam) {
      return NextResponse.json({ error: "Mes requerido (formato YYYY-MM)" }, { status: 400 })
    }

    // 1. Obtener todos los empleados activos
    const { data: allEmployees, error: empError } = await supabase
      .from('employees')
      .select('id, name, role, image_url')

    if (empError) throw empError

    // 2. Definir rango de fechas robusto
    // Si monthParam es "2026-04", startDate es "2026-04-01"
    const startDate = `${monthParam}-01T00:00:00Z`
    
    // Calculamos el primer día del mes siguiente para el límite superior
    const [year, month] = monthParam.split('-').map(Number)
    const nextMonthDate = new Date(Date.UTC(year, month, 1))
    const endDate = nextMonthDate.toISOString()

    // 3. Traer los votos con respaldo de columnas individuales
    const { data: votes, error: votesError } = await supabase
      .from('staff_votes')
      .select('employee_id, overall_rating, friendliness, efficiency, problem_solving, cleanliness')
      .gte('created_at', startDate)
      .lt('created_at', endDate)

    if (votesError) throw votesError

    // 4. Mapear y calcular promedios
    const result = allEmployees.map(emp => {
      const empVotes = votes?.filter(v => v.employee_id === emp.id) || []
      const total = empVotes.length
      
      const sum = empVotes.reduce((acc, curr) => {
        // Si overall_rating es nulo, promediamos las 4 categorías manuales
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

    // Ordenar de mayor a menor puntaje para el Dashboard
    result.sort((a, b) => b.average_rating - a.average_rating || b.total_votes - a.total_votes)

    return NextResponse.json(result)

  } catch (error: any) {
    console.error("Detalle del error en API:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
