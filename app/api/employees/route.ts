import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabaseUrl = 'https://kfltdikdcxtombnwalxj.supabase.co'
const supabaseAnonKey = 'sb_publishable_hW2Wfpw46rvONH8Fg_kW9A_RP7L1GcA'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const monthParam = searchParams.get('month') // Formato esperado: "YYYY-MM"

    if (!monthParam) {
      return NextResponse.json({ error: "Mes requerido" }, { status: 400 })
    }

    // 1. Obtener empleados activos
    const { data: allEmployees, error: empError } = await supabase
      .from('employees')
      .select('id, name, role, image_url')

    if (empError) throw empError

    // 2. Definir rango de fechas robusto usando UTC
    const [year, month] = monthParam.split('-').map(Number);
    const startDate = new Date(Date.UTC(year, month - 1, 1)).toISOString();
    const endDate = new Date(Date.UTC(year, month, 1)).toISOString();

    // 3. Traer los votos del periodo
    const { data: votes, error: votesError } = await supabase
      .from('staff_votes')
      .select('employee_id, overall_rating')
      .gte('created_at', startDate)
      .lt('created_at', endDate)

    if (votesError) throw votesError

    // 4. Mapear votos a empleados de forma segura
    const safeEmployees = allEmployees || [];
    const safeVotes = votes || [];

    const result = safeEmployees.map(emp => {
      const empVotes = safeVotes.filter(v => v.employee_id === emp.id)
      const total = empVotes.length
      const avg = total > 0 
        ? empVotes.reduce((acc, curr) => acc + curr.overall_rating, 0) / total 
        : 0

      return {
        ...emp,
        total_votes: total,
        average_rating: Number(avg.toFixed(2))
      }
    })

    return NextResponse.json(result)

  } catch (error: any) {
    console.error("Error en API:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
