import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// 1. ELIMINAR EL CACHÉ POR COMPLETO
// Esto asegura que cada vez que el admin abra los comentarios, vea los últimos votos reales.
export const dynamic = 'force-dynamic'
export const revalidate = 0

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

    // 2. CONSULTA CORREGIDA
    const { data, error } = await supabase
      .from('staff_votes')
      .select('comment, created_at, id') // 'comment' es la columna real en tu tabla staff_votes
      .eq('employee_id', employeeId)
      .not('comment', 'is', null)       // Filtra los votos que no dejaron mensaje
      .neq('comment', '')               // Filtra los mensajes vacíos ""
      .order('created_at', { ascending: false })
      .limit(5)                        // Traemos 10 por seguridad, el frontend mostrará 5

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // 3. MAPEADO DE SEGURIDAD
    // Para que el frontend siempre encuentre la propiedad "comentario"
    const formattedData = data?.map(item => ({
      ...item,
      comentario: item.comment // Renombramos 'comment' a 'comentario' para tu componente
    })) || []

    return NextResponse.json(formattedData)

  } catch (err) {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
