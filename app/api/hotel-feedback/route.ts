import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
const supabaseUrl = 'https://kfltdikdcxtombnwalxj.supabase.co'
const supabaseKey = 'sb_publishable_hW2Wfpw46rvONH8Fg_kW9A_RP7L1GcA'
)

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('hotel_survey_responses')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    // 1. Calculamos promedios reales de la DB
    const total = data.length
    const stats = {
      limpieza: (data.reduce((acc, curr) => acc + (curr.habitacion_limpieza || 0), 0) / total).toFixed(1),
      infraestructura: (data.reduce((acc, curr) => acc + (curr.instalaciones_estado || 0), 0) / total).toFixed(1),
      atencion: (data.reduce((acc, curr) => acc + (curr.registro_amabilidad || 0), 0) / total).toFixed(1),
    }

    // 2. Formateamos los comentarios para el Dashboard
    // Mapeamos 'comentarios_adicionales' o la columna que uses para texto
    const feedbacks = data
      .filter(item => item.comentarios_sugerencias) // Filtra si el cliente no dejó texto
      .map(item => ({
        id: item.id,
        categoria: "General", 
        puntuacion: ((item.bienvenida_sentir + item.registro_rapidez + item.registro_amabilidad) / 3).toFixed(1),
        comentario: item.comentarios_sugerencias,
        created_at: item.created_at
      }))

    return NextResponse.json({ stats, feedbacks })
  } catch (error) {
    return NextResponse.json({ error: "Error al conectar con Supabase" }, { status: 500 })
  }
}
