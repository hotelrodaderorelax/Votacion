import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Forzamos que la ruta sea dinámica para evitar errores en Vercel
export const dynamic = 'force-dynamic'

const supabase = createClient(
  'https://kfltdikdcxtombnwalxj.supabase.co',
  'sb_publishable_hW2Wfpw46rvONH8Fg_kW9A_RP7L1GcA'
)

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const month = searchParams.get('month')

    // 1. OBTENER EMPLEADOS ORDENADOS ALFABÉTICAMENTE
    // Al usar 'name' ascendente: Ezlatne (E) -> Lexilis (L) -> Virginia (V)
    const { data: emps, error: err } = await supabase
      .from('employees')
      .select('*')
      .order('name', { ascending: true })

    if (err) throw err

    // 2. OBTENER VOTOS DEL MES (Si existe el parámetro)
    let votes: any[] = []
    if (month) {
      const { data: vData } = await supabase
        .from('staff_votes')
        .select('employee_id, overall_rating')
        .like('created_at', `${month}%`)
      votes = vData || []
    }

    // 3. PROCESAR Y NORMALIZAR DATOS
    const result = (emps || []).map(e => {
      const v = votes.filter(v => v.employee_id === e.id)
      
      // Normalizamos el rol para que el frontend (Recepción) coincida siempre
      const rawRole = (e.role || "").toUpperCase()
      const cleanRole = rawRole.normalize("NFD").replace(/[\u0300-\u036f]/g, "")

      return {
        ...e,
        role: cleanRole, // Ejemplo: "RECEPCION"
        total_votes: v.length,
        average_rating: v.length > 0 
          ? Number((v.reduce((a, b) => a + b.overall_rating, 0) / v.length).toFixed(1)) 
          : 0
      }
    })

    return NextResponse.json(result)

  } catch (error: any) {
    console.error("Error en API:", error.message)
    // Retornamos un array vacío para que el frontend no se rompa
    return NextResponse.json([])
  }
}
