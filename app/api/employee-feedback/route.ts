import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const supabaseUrl = 'https://kfltdikdcxtombnwalxj.supabase.co'
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'sb_publishable_hW2Wfpw46rvONH8Fg_kW9A_RP7L1GcA'
const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const employeeId = searchParams.get('id')
    const isAll = searchParams.get('all') === 'true'

    // 1. Consulta base con filtros de seguridad para comentarios vacíos
    let query = supabase
      .from('staff_votes')
      .select('comment, created_at, id, rating, employee_id')
      .not('comment', 'is', null)
      .neq('comment', '')

    // 2. Lógica de selección de datos
    if (isAll) {
      // Muro del Hotel: Todos los comentarios recientes de la empresa
      query = query.order('created_at', { ascending: false }).limit(30)
    } else if (employeeId) {
      // Perfil específico: Solo comentarios de ese empleado
      query = query.eq('employee_id', employeeId).order('created_at', { ascending: false }).limit(15)
    } else {
      // Si no se especifica nada, devolvemos array vacío inmediatamente
      return NextResponse.json([])
    }

    const { data, error } = await query

    if (error) {
      console.error("Supabase Error:", error.message)
      return NextResponse.json([]) 
    }

    // 3. Formateo y limpieza de datos
    const formattedData = (data || []).map(item => ({
      id: item.id,
      comentario: item.comment, 
      fecha: item.created_at,
      rating: item.rating,
      employee_id: item.employee_id
    }))

    return NextResponse.json(formattedData)

  } catch (err) {
    console.error("Internal Server Error:", err)
    return NextResponse.json([]) 
  }
}
