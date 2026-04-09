import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Esta línea es VITAL para que Vercel no rompa la API al detectar searchParams
export const dynamic = 'force-dynamic'

const supabase = createClient(
  'https://kfltdikdcxtombnwalxj.supabase.co',
  'sb_publishable_hW2Wfpw46rvONH8Fg_kW9A_RP7L1GcA'
)

export async function GET(request: Request) {
  try {
    // Extraemos el mes de la URL
    const { searchParams } = new URL(request.url)
    const month = searchParams.get('month') 

    // 1. Obtener todos los empleados siempre
    const { data: emps, error: err } = await supabase
      .from('employees')
      .select('*')
      .order('name', { ascending: true })

    if (err) throw err

    // 2. Obtener votos con lógica ultra-flexible
    let votes: any[] = []
    
    if (month && month !== 'null' && month !== 'undefined') {
      // Filtramos por el mes usando LIKE
      const { data: vData, error: vErr } = await supabase
        .from('staff_votes')
        .select('employee_id, overall_rating')
        .like('created_at', `${month}%`)
      
      if (!vErr) {
        votes = vData || []
      }
    }

    // 3. Unir los datos para el Dashboard
    const result = (emps || []).map(e => {
      const employeeVotes = votes.filter(v => v.employee_id === e.id)
      const total = employeeVotes.length
      const avg = total > 0 
        ? employeeVotes.reduce((acc, curr) => acc + (curr.overall_rating || 0), 0) / total 
        : 0

      // Normalización de roles para evitar problemas de visualización
      const rawRole = (e.role || "").toUpperCase()
      const cleanRole = rawRole.normalize("NFD").replace(/[\u0300-\u036f]/g, "")

      return {
        ...e,
        role: cleanRole,
        total_votes: total,
        average_rating: Number(avg.toFixed(1))
      }
    })

    return NextResponse.json(result)

  } catch (error: any) {
    console.error("Error crítico en API Employees:", error.message)
    // Devolvemos un array vacío pero con status 200 para que el Dashboard no "explote"
    return new Response(JSON.stringify([]), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
