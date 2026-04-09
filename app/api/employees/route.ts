
import { NextResponse } from 'next/server'

const supabaseUrl = 'https://kfltdikdcxtombnwalxj.supabase.co'
const supabaseAnonKey = 'sb_publishable_hW2Wfpw46rvONH8Fg_kW9A_RP7L1GcA'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const monthParam = searchParams.get('month') // Formato: YYYY-MM

    if (!monthParam) {
      return NextResponse.json({ error: "Mes requerido" }, { status: 400 })
    }

    // 1. Obtener todos los empleados activos primero
    const { data: allEmployees, error: empError } = await supabase
      .from('employees')
      .select('id, name, role, image_url')

    if (empError) throw empError

    // 2. Definir rango de fechas (Cuidado: algunos meses no tienen 31 días)
    const startDate = `${monthParam}-01T00:00:00Z`
    const nextMonth = new Date(monthParam + "-02"); // truco para obtener el sig. mes
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    const endDate = nextMonth.toISOString();

    // 3. Traer los votos de ese periodo
    const { data: votes, error: votesError } = await supabase
      .from('staff_votes')
      .select('employee_id, overall_rating')
      .gte('created_at', startDate)
      .lt('created_at', endDate)

    if (votesError) throw votesError

    // 4. Mapear votos a empleados
    const result = allEmployees.map(emp => {
      const empVotes = votes.filter(v => v.employee_id === emp.id)
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
    console.error("Detalle del error:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
