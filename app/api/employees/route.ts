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
    const month = searchParams.get('month')

    const { data: emps, error: err } = await supabase.from('employees').select('*')
    if (err) throw err

    let votes: any[] = []
    if (month) {
      const { data: vData } = await supabase
        .from('staff_votes')
        .select('employee_id, overall_rating')
        .like('created_at', `${month}%`)
      votes = vData || []
    }

    const result = emps.map(e => {
      const v = votes.filter(v => v.employee_id === e.id)
      
      // NORMALIZACIÓN: Convertimos el rol a mayúsculas y quitamos tildes
      // Esto asegura que el frontend siempre encuentre la coincidencia.
      const rawRole = (e.role || "").toUpperCase();
      const cleanRole = rawRole.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

      return {
        ...e,
        role: cleanRole, // Ahora dirá "RECEPCION" en lugar de "Recepción"
        total_votes: v.length,
        average_rating: v.length > 0 ? Number((v.reduce((a, b) => a + b.overall_rating, 0) / v.length).toFixed(1)) : 0
      }
    })

    return NextResponse.json(result)
  } catch (e: any) {
    return NextResponse.json([])
  }
}
