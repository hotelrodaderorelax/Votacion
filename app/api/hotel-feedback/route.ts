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

    // Si no hay datos, enviamos valores por defecto para que no se rompa el dashboard
    if (!data || data.length === 0) {
      return NextResponse.json({ 
        stats: { limpieza: "0.0", infraestructura: "0.0", atencion: "0.0" }, 
        data: [] 
      })
    }

    const total = data.length
    
    // Calculamos los promedios reales de las columnas de tu tabla
    const stats = {
      limpieza: (data.reduce((acc, curr) => acc + (Number(curr.habitacion_limpieza) || 5), 0) / total).toFixed(1),
      infraestructura: (data.reduce((acc, curr) => acc + (Number(curr.instalaciones_estado) || 5), 0) / total).toFixed(1),
      atencion: (data.reduce((acc, curr) => acc + (Number(curr.registro_amabilidad) || 5), 0) / total).toFixed(1),
    }

    return NextResponse.json({ stats, data })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Error de conexión" }, { status: 500 })
  }
}
