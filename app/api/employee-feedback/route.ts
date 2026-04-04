import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  'https://kfltdikdcxtombnwalxj.supabase.co',
  'sb_publishable_hW2Wfpw46rvONH8Fg_kW9A_RP7L1GcA'
)

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const employeeId = searchParams.get('id')

  if (!employeeId) return NextResponse.json({ error: 'ID requerido' }, { status: 400 })

  // Obtenemos los últimos 5 comentarios y la calificación promedio
  const { data, error } = await supabase
    .from('staff_votes') // Ajusta al nombre real de tu tabla de votos de empleados
    .select('comentario, rating, created_at')
    .eq('employee_id', employeeId)
    .order('created_at', { ascending: false })
    .limit(5)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
