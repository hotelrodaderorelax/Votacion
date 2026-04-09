import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Datos de conexión
const supabaseUrl = 'https://kfltdikdcxtombnwalxj.supabase.co'
const supabaseAnonKey = 'sb_publishable_hW2Wfpw46rvONH8Fg_kW9A_RP7L1GcA'
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const monthParam = searchParams.get('month') // Espera "YYYY-MM"

    if (!monthParam) {
      return NextResponse.json({ error: "Mes requerido" }, { status: 400 })
    }

    // 1. Obtener empleados
    const { data: allEmployees, error: empError } = await supabase
      .from('employees')
      .select('id, name, role, image_url')

    if (empError) throw empError

    // 2. Cálculo de fechas SEGURO (Sin duplicados)
    const [year, month] = monthParam.split('-').map(Number)
    // Primer día del mes solicitado
    const startDate = new Date(Date.UTC(year, month - 1, 1)).toISOString()
    // Primer día del mes SIGUIENTE
    const endDate = new Date(Date.UTC(year, month, 1)).toISOString()

    // 3. Traer votos del periodo
    const { data: votes, error: votesError } = await supabase
      .from('staff_votes')
      .select('employee_id, overall_rating')
      .gte('created_at', startDate)
      .lt('created_at', endDate)

    if (votesError) throw votesError

    // 4. Mapear resultados de forma segura
    // Usamos (allEmployees || []) para evitar el error "is not iterable"
    const result = (allEmployees || []).map(emp => {
      const empVotes = (votes || []).filter(v => v.employee_id === emp.id)
      const total = empVotes.length
      const avg = total > 0 
        ? empVotes.reduce((acc, curr) => acc + curr.overall_rating, 0) / total 
        : 0

      return {
        ...emp,
        total_votes: total,
        average_rating: Number(avg.toFixed(2)) // Limita decimales para el diseño
      }
    })

    return NextResponse.json(result)

  } catch (error: any) {
    console.error("Detalle del error:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
