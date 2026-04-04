import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Configuración del cliente (Asegúrate de usar tus variables de entorno en producción)
const supabase = createClient(
  'https://kfltdikdcxtombnwalxj.supabase.co',
  'sb_publishable_hW2Wfpw46rvONH8Fg_kW9A_RP7L1GcA'
)

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const employeeId = searchParams.get('id')

  if (!employeeId) {
    return NextResponse.json({ error: 'ID del empleado es requerido' }, { status: 400 })
  }

  // Consultamos la tabla staff_votes con los nombres de columna correctos
  const { data, error } = await supabase
    .from('staff_votes') 
    .select('comment, overall_rating, created_at') // <--- Cambiado de 'comentario' a 'comment'
    .eq('employee_id', employeeId)
    .not('comment', 'is', null) // Filtra votos que no tengan texto escrito
    .order('created_at', { ascending: false })
    .limit(5)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
