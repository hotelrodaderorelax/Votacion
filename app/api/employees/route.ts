import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Forzamos que la ruta sea dinámica para evitar errores en Vercel
export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'
export const revalidate = 0

const supabase = createClient(
  'https://kfltdikdcxtombnwalxj.supabase.co',
  'sb_publishable_hW2Wfpw46rvONH8Fg_kW9A_RP7L1GcA'
)

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const month = searchParams.get('month') // Recibe "2026-04" directamente del Dashboard

    // 1. OBTENER TODOS LOS EMPLEADOS
    const { data: emps, error: err } = await supabase
      .from('employees')
      .select('*')
      .order('name', { ascending: true })

    if (err) throw err

    // 2. OBTENER VOTOS DEL MES
    let votes: any[] = []
    
    // Si el mes viene como "2026-04", el .like('created_at', '2026-04%') es perfecto
    if (month && month !== 'null') {
      const { data: vData, error: vErr } = await supabase
        .from('staff_votes')
        .select('employee_id, overall_rating')
        .like('created_at', `${month}%`) 
      
      if (!vErr) votes = vData || []
    }

    // 3. PROCESAR Y NORMALIZAR
    const result = (emps || []).map(e => {
      const employeeVotes = votes.filter(v => v.employee_id === e.id)
      const total = employeeVotes.length
      const avg = total > 0 
        ? employeeVotes.reduce((acc, curr) => acc + (curr.overall_rating || 0), 0) / total 
        : 0

      // Normalización del rol para el Dashboard
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
    console.error("Error en API:", error.message)
    return NextResponse.json([])
  }
}
