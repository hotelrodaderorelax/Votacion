import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const supabaseUrl = 'https://kfltdikdcxtombnwalxj.supabase.co'
const supabaseKey = 'sb_publishable_hW2Wfpw46rvONH8Fg_kW9A_RP7L1GcA'
const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const employeeId = searchParams.get('id')
    const all = searchParams.get('all') // Nuevo parámetro para el Hotel

    // 1. Iniciamos la consulta base
    let query = supabase
      .from('staff_votes')
      .select('comment, created_at, id, rating') // Incluimos rating por si quieres ver la nota puntual
      .not('comment', 'is', null)
      .neq('comment', '')

    // 2. Lógica de Filtrado
    if (all === 'true') {
      // VISTA HOTEL: Traemos los últimos 20 comentarios de cualquier empleado
      query = query.order('created_at', { ascending: false }).limit(20)
    } else if (employeeId) {
      // VISTA EMPLEADO: Filtramos por el ID específico
      query = query.eq('employee_id', employeeId).order('created_at', { ascending: false }).limit(10)
    } else {
      // Si no hay ID ni es "all", devolvemos lista vacía para evitar el error .slice
      return NextResponse.json([])
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json([], { status: 400 }) // Devolvemos [] para no romper el front
    }

    // 3. Mapeado de Seguridad
    const formattedData = data?.map(item => ({
      ...item,
      comentario: item.comment, // Mantenemos la compatibilidad con tu componente
      overall_rating: item.rating // Para la puntuación puntual del comentario
    })) || []

    return NextResponse.json(formattedData)

  } catch (err) {
    // Siempre devolver un array [] en caso de error fatal
    return NextResponse.json([]) 
  }
}
