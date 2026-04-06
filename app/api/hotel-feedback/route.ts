import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  'https://kfltdikdcxtombnwalxj.supabase.co',
  'sb_publishable_hW2Wfpw46rvONH8Fg_kW9A_RP7L1GcA'
)

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('hotel_survey_responses')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    const total = data.length || 1
    const stats = {
      limpieza: (data.reduce((acc, curr) => acc + (curr.habitacion_limpieza || 0), 0) / total).toFixed(1),
      infraestructura: (data.reduce((acc, curr) => acc + (curr.instalaciones_estado || 0), 0) / total).toFixed(1),
      atencion: (data.reduce((acc, curr) => acc + (curr.registro_amabilidad || 0), 0) / total).toFixed(1),
    }

    return NextResponse.json({ stats, data })
  } catch (error) {
    return NextResponse.json({ error: "Error de conexión" }, { status: 500 })
  }
}
