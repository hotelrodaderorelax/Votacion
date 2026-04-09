import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const supabase = createClient(
  'https://kfltdikdcxtombnwalxj.supabase.co',
  'sb_publishable_hW2Wfpw46rvONH8Fg_kW9A_RP7L1GcA'
)

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const month = searchParams.get('month') // Ejemplo: "2026-04"

    // 1. Traer todos los empleados
    const { data: emps, error: err } = await supabase
      .from('employees')
      .select('*')

    if (err) throw err

    // 2. Traer los votos (Quitamos el filtro .like para probar si llegan)
    let query = supabase.from('staff_votes').select('*')
    
    // Solo filtramos si el mes existe, pero usamos una comparación más robusta
    if (month) {
      query = query.gte('created_at', `${month}-01`).lte('created_at', `${month}-31`)
    }

    const { data: votes, error: vErr } = await query
    if (vErr) console.error("Error en votos:", vErr)

    const allVotes = votes || []

    // 3. Mapeo manual para asegurar que los ceros desaparezcan
    const result = emps.map(e => {
      const employeeVotes = allVotes.filter(v => v.employee_id === e.id)
      const total = employeeVotes.length
      
      let sum = 0
      employeeVotes.forEach(v => {
        // Sumamos las categorías individuales si overall_rating no existe
        const val = v.overall_rating 
          ? Number(v.overall_rating) 
          : (Number(v.friendliness || 0) + Number(v.efficiency || 0) + Number(v.problem_solving || 0) + Number(v.cleanliness || 0)) / 4
        sum += val
      })

      const avg = total > 0 ? sum / total : 0

      return {
        ...e,
        total_votes: total,
        average_rating: parseFloat(avg.toFixed(1))
      }
    })

    // Ordenar por votos para que el "Empleado Estrella" no salga vacío
    result.sort((a, b) => b.total_votes - a.total_votes)

    return NextResponse.json(result)

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
