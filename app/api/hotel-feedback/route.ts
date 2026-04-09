import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  'https://kfltdikdcxtombnwalxj.supabase.co',
  'sb_publishable_hW2Wfpw46rvONH8Fg_kW9A_RP7L1GcA'
)

export async function GET(request: Request) {
  try {
    // 1. Extraer el mes de la URL
    const { searchParams } = new URL(request.url)
    const monthParam = searchParams.get('month') // Formato: "2026-04"

    if (!monthParam) {
      return NextResponse.json({ error: "Mes no proporcionado" }, { status: 400 })
    }

    // 2. Definir el rango del mes seleccionado
    const startDate = `${monthParam}-01T00:00:00Z`
    const nextMonthDate = new Date(monthParam + "-02")
    nextMonthDate.setMonth(nextMonthDate.getMonth() + 1)
    const endDate = nextMonthDate.toISOString()

    // 3. Consultar datos filtrados por fecha
    const { data, error } = await supabase
      .from('hotel_survey_responses')
      .select('*')
      .gte('created_at', startDate)
      .lt('created_at', endDate)
      .order('created_at', { ascending: false })

    if (error) throw error

    // Si no hay datos para ese mes específico
    if (!data || data.length === 0) {
      return NextResponse.json({ 
        stats: { limpieza: "0.0", infraestructura: "0.0", atencion: "0.0" }, 
        data: [] 
      })
    }

    const total = data.length
    
    // 4. Calcular promedios basados SOLO en los datos del mes filtrado
    const stats = {
      limpieza: (data.reduce((acc, curr) => acc + (Number(curr.habitacion_limpieza) || 0), 0) / total).toFixed(1),
      infraestructura: (data.reduce((acc, curr) => acc + (Number(curr.instalaciones_estado) || 0), 0) / total).toFixed(1),
      atencion: (data.reduce((acc, curr) => acc + (Number(curr.registro_amabilidad) || 0), 0) / total).toFixed(1),
    }

    return NextResponse.json({ stats, data })

  } catch (error: any) {
    console.error("API Error:", error.message)
    return NextResponse.json({ error: "Error de conexión" }, { status: 500 })
  }
}
