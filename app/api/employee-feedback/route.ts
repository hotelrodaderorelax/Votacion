import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Inicialización del cliente con tus credenciales de Supabase
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

    // Consulta a la tabla staff_votes usando los nombres reales de las columnas
    const { data, error } = await supabase
      .from('staff_votes')
      .select('comment, overall_rating, created_at') // Nombres exactos de tu DB
      .eq('employee_id', employeeId)
      .not('comment', 'is', null) // Filtramos solo los que tienen texto
      .order('created_at', { ascending: false })
      .limit(5)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data || [])
  } catch (err) {
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
