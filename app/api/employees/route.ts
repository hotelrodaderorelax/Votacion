import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Fix para el error de Vercel "Dynamic server usage"
export const dynamic = 'force-dynamic'

const supabase = createClient(
  'https://kfltdikdcxtombnwalxj.supabase.co',
  'sb_publishable_hW2Wfpw46rvONH8Fg_kW9A_RP7L1GcA'
)

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const month = searchParams.get('month') 

    // 1. Obtener empleados
    const { data: emps, error: err } = await supabase
      .from('employees')
      .select('*')

    if (err) throw err

    // 2. Obtener votos con todas las columnas de puntaje por si overall_rating es NULL
    let votes: any[] = []
    if (month) {
      const { data: vData, error: vErr } = await supabase
        .from('staff_votes')
        .select('employee_id, overall_rating, friendliness, efficiency, problem_solving, cleanliness')
        .like('created_at', `${month}%`) 
      
      if (!vErr) votes = vData || []
    }

    // 3. Procesar datos
    const result = emps.map(e => {
      const employeeVotes = votes.filter(v => v.employee_id === e.id)
      const total = employeeVotes.length
      
      const sum = employeeVotes.reduce((acc, curr) => {
        // Si overall_rating existe, lo usamos. Si no, calculamos el promedio de las 4 categorías
        if (curr.overall_rating !== null && curr.overall_rating !== undefined) {
          return acc + Number(curr.overall_rating)
        } else {
          const subtotal = (curr.friendliness || 0) + (curr.efficiency || 0) + (curr.problem_solving || 0) + (curr.cleanliness || 0)
          return acc + (subtotal / 4)
        }
      }, 0)

      const avg = total > 0 ? sum / total : 0

      return {
        ...e,
        total_votes: total,
        average_rating: Number(avg.toFixed(1))
      }
    })

    return NextResponse.json(result)

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
