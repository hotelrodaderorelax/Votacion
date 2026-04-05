
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// 1. FORZAR DINÁMICO: Esto evita que Next.js guarde una copia estática (caché).
// Soluciona el problema de tener que dar 'deploy' para ver votos nuevos.
export const dynamic = 'force-dynamic'

// 2. INICIALIZACIÓN: Mantén tus credenciales tal como están
const supabaseUrl = 'https://kfltdikdcxtombnwalxj.supabase.co'
const supabaseKey = 'sb_publishable_hW2Wfpw46rvONH8Fg_kW9A_RP7L1GcA'
const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const employeeId = searchParams.get('id')

    if (!employeeId) {
      return NextResponse.json({ error: 'ID del empleado requerido' }, { status: 400 })
    }

    // 3. CONSULTA: Usando los nombres reales vistos en tu tabla staff_votes
    const { data, error } = await supabase
      .from('staff_votes')
      .select('comment, overall_rating, created_at') // Columnas reales de tu DB
      .eq('employee_id', employeeId)
      .not('comment', 'is', null) // No trae filas vacías
      .order('created_at', { ascending: false })
      .limit(10) // Aumentado a 10 para dar más contexto al admin

    if (error) {
      console.error('Error de Supabase:', error.message)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // 4. RETORNO SEGURO: Siempre devuelve un array, aunque esté vacío
    return NextResponse.json(data || [])

  } catch (err) {
    console.error('Error en API:', err)
    return NextResponse.json(
      { error: 'Error interno del servidor' }, 
      { status: 500 }
    )
  }
}
