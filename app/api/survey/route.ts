import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Usamos los nombres exactos que Vercel te asignó automáticamente
const supabase = createClient(
  process.env.NEXT_PUBLIC_jnihjfbutwlrecwszzaj_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_jnihjfbutwlrecwszzaj_SUPABASE_ANON_KEY!
)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { ratings, textFeedback } = body

    // Mapeo de datos para la tabla 'hotel_survey_responses'
    const surveyData = {
      bienvenida_sentir: ratings[0],
      registro_rapidez: ratings[1],
      registro_amabilidad: ratings[2],
      registro_reserva_servicios: ratings[3],
      habitacion_limpieza: ratings[4],
      habitacion_confort: ratings[5],
      habitacion_baño_limpio: ratings[6],
      habitacion_mobiliario: ratings[7],
      personal_limpieza_amable: ratings[8],
      personal_cocina_trato: ratings[9],
      personal_resolucion_inquietudes: ratings[10],
      alimento_calidad: ratings[11],
      alimento_porcion: ratings[12],
      alimento_variedad: ratings[13],
      alimento_agilidad: ratings[14],
      alimento_presentacion: ratings[15],
      general_tranquilidad: ratings[16],
      general_recomendacion: ratings[17],
      general_evaluacion: ratings[18],
      mejoras_sugerencias: textFeedback
    }

    const { error } = await supabase
      .from('hotel_survey_responses')
      .insert([surveyData])

    if (error) throw error

    return NextResponse.json({ message: 'Encuesta guardada con éxito' }, { status: 200 })
  } catch (error) {
    console.error('Error en Supabase:', error)
    return NextResponse.json({ error: 'Error al guardar la encuesta' }, { status: 500 })
  }
}
