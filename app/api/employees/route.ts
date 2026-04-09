import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabaseUrl = 'https://kfltdikdcxtombnwalxj.supabase.co'
const supabaseAnonKey = 'sb_publishable_hW2Wfpw46rvONH8Fg_kW9A_RP7L1GcA'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const monthParam = searchParams.get('month')

    // 1. OBTENER TODOS LOS EMPLEADOS (Paso fundamental para que salgan todos)
    const { data: allEmployees, error: empError } = await supabase
      .from('employees')
      .select('id, name, role, image_url')
      .order('name', { ascending: true })

    if (empError) throw empError

    // 2. PROCESAR VOTOS SOLO SI HAY UN MES
    let votes: any[] = []
    
    if (monthParam) {
      const startDate = `${monthParam}-01T00:00:00Z`
      const dateObj = new Date(monthParam + "-02")
      dateObj.setMonth(dateObj.getMonth() + 1)
      const endDate = dateObj.toISOString()

      const { data: votesData, error: votesError } = await supabase
        .from('staff_votes')
        .select('employee_id, overall_rating')
        .gte('created_at', startDate)
        .lt('created_at', endDate)

      if (votesError) throw votesError
      votes = votesData || []
    }

    // 3. UNIR DATOS
    const result = (allEmployees || []).map(emp => {
      const empVotes = votes.filter(v => v.employee_id === emp.id)
      const total = empVotes.length
      const avg = total > 0 
        ? empVotes.reduce((acc, curr) => acc + curr.overall_rating, 0) / total 
        : 0

      return {
        id: emp.id,
        name: emp.name || "Empleado",
        role: emp.role || "Staff",
        image_url: emp.image_url || null,
        total_votes: total,
        average_rating: Number(avg.toFixed(1))
      }
    })

    return NextResponse.json(result)

  } catch (error: any) {
    console.error("Error en API:", error.message)
    // Devolvemos array vacío para evitar que el frontend explote
    return NextResponse.json([])
  }
}
