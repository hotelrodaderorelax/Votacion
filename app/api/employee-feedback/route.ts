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
    const isAll = searchParams.get('all') === 'true'

    let query = supabase
      .from('staff_votes')
      .select('comment, created_at, id, rating') // rating o overall_rating según tu tabla
      .not('comment', 'is', null)
      .neq('comment', '')

    if (isAll) {
      // Muro del Hotel: Todos los comentarios
      query = query.order('created_at', { ascending: false }).limit(30)
    } else if (employeeId) {
      // Comentarios de un empleado específico
      query = query.eq('employee_id', employeeId).order('created_at', { ascending: false }).limit(15)
    } else {
      return NextResponse.json([])
    }

    const { data, error } = await query
    if (error) return NextResponse.json([])

    // NORMALIZACIÓN: Aquí nos aseguramos que el frontend siempre reciba "comentario"
    const formattedData = (data || []).map(item => ({
      id: item.id,
      comentario: item.comment, // Convertimos 'comment' de la DB a 'comentario' para el Front
      created_at: item.created_at,
      rating: item.rating
    }))

    return NextResponse.json(formattedData)

  } catch (err) {
    return NextResponse.json([]) 
  }
}
