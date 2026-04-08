import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabaseUrl = 'https://kfltdikdcxtombnwalxj.supabase.co'
const supabaseAnonKey = 'sb_publishable_hW2Wfpw46rvONH8Fg_kW9A_RP7L1GcA'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function GET(request: Request) {
  try {
    // 1. Extraemos el mes de la URL (ej: ?month=2026-04)
    const { searchParams } = new URL(request.url)
    const monthParam = searchParams.get('month') 

    if (!monthParam) {
      return NextResponse.json({ error: "Mes no proporcionado" }, { status: 400 })
    }

    // 2. Definimos el rango de fechas para el mes seleccionado
    const startDate = `${monthParam}-01T00:00:00Z`
    const endDate = `${monthParam}-31T23:59:59Z`

    // 3. Traemos los votos filtrados por fecha y los datos del empleado
    // Usamos la tabla staff_votes porque contiene el created_at
    const { data: votes, error: votesError } = await supabase
      .from('staff_votes')
      .select(`
        overall_rating,
        employee_id,
        employees (
          id,
          name,
          role,
          image_url
        )
      `)
      .gte('created_at', startDate)
      .lte('created_at', endDate)

    if (votesError) throw votesError

    // 4. Agrupamos los datos manualmente para calcular el ranking del mes
    const summary = votes.reduce((acc: any, vote: any) => {
      const emp = vote.employees
      if (!emp) return acc

      if (!acc[emp.id]) {
        acc[emp.id] = {
          id: emp.id,
          name: emp.name,
          role: emp.role,
          image_url: emp.image_url,
          total_votes: 0,
          sum_rating: 0
        }
      }

      acc[emp.id].total_votes += 1
      acc[emp.id].sum_rating += vote.overall_rating
      return acc
    }, {})

    // 5. Formateamos la respuesta final
    const result = Object.values(summary).map((emp: any) => ({
      id: emp.id,
      name: emp.name,
      role: emp.role,
      image_url: emp.image_url,
      total_votes: emp.total_votes,
      average_rating: emp.sum_rating / emp.total_votes
    }))

    return NextResponse.json(result)

  } catch (error: any) {
    console.error("Error en API:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
