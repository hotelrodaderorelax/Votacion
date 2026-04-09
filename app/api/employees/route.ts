import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Lo ideal es que estas usen process.env para mayor seguridad
const supabaseUrl = 'https://kfltdikdcxtombnwalxj.supabase.co'
const supabaseAnonKey = 'sb_publishable_hW2Wfpw46rvONH8Fg_kW9A_RP7L1GcA'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    let monthParam = searchParams.get('month') 

    // Si no hay mes en la URL, usamos el mes actual (YYYY-MM)
    if (!monthParam) {
      const now = new Date();
      monthParam = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    }

    // 1. Obtener empleados
    const { data: allEmployees, error: empError } = await supabase
      .from('employees')
      .select('id, name, role, image_url')

    if (empError) throw empError

    // 2. Rango de fechas para el mes solicitado
    const startDate = `${monthParam}-01T00:00:00Z`
    const dateObj = new Date(monthParam + "-02"); 
    dateObj.setMonth(dateObj.getMonth() + 1);
    const endDate = dateObj.toISOString();

    // 3. Obtener votos
    const { data: votes, error: votesError } = await supabase
      .from('staff_votes')
      .select('employee_id, overall_rating')
      .gte('created_at', startDate)
      .lt('created_at', endDate)

    if (votesError) throw votesError

    // 4. Cruzar datos
    const result = (allEmployees || []).map(emp => {
      const empVotes = (votes || []).filter(v => v.employee_id === emp.id)
      const total = empVotes.length
      const avg = total > 0 
        ? empVotes.reduce((acc, curr) => acc + curr.overall_rating, 0) / total 
        : 0

      return {
        ...emp,
        total_votes: total,
        average_rating: avg
      }
    })

    return NextResponse.json(result)

  } catch (error: any) {
    console.error("Error en API:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
