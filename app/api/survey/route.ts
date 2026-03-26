import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Configuración del cliente con las variables gestionadas por Vercel
const supabaseUrl = process.env.NEXT_PUBLIC_jnihjfbutwlrecwszzaj_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_jnihjfbutwlrecwszzaj_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl!, supabaseAnonKey!)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { ratings, textFeedback } = body

    // 1. Verificación de seguridad: Si no hay ratings, no intentamos guardar
    if (!ratings || !Array.isArray(ratings)) {
      return NextResponse.json({ error: 'No se recibieron votos válidos' }, { status: 400 })
    }

    // 2. Mapeo seguro: Usamos "|| null" para que si una pregunta no se respondió, 
    // la base de datos reciba NULL en lugar de romperse.
    const surveyData = {
      bienvenida_sentir: ratings[0] || null,
      registro_rapidez: ratings[1] || null,
      registro_amabilidad: ratings[2] || null,
      registro_reserva_servicios: ratings[3] || null,
      habitacion_limpieza: ratings[4] || null,
      habitacion_confort: ratings[5] || null,
      habitacion_baño_limpio: ratings[6] || null,
      habitacion_mobiliario: ratings[7] || null,
      personal_limpieza_amable: ratings[8] || null,
      personal_cocina_trato: ratings[9] || null,
      personal_resolucion_inquietudes: ratings[10] || null,
      alimento_calidad: ratings[11] || null,
      alimento_porcion: ratings[12] || null,
      alimento_variedad: ratings[13] || null,
      alimento_agilidad: ratings[14] || null,
      alimento_presentacion: ratings[15] || null,
      general_tranquilidad: ratings[16] || null,
      general_recomendacion: ratings[17] || null,
      general_evaluacion: ratings[18] || null,
      mejoras_sugerencias: textFeedback || ''
    }

    // 3. Inserción en la tabla de Supabase
    const { data, error: dbError } = await supabase
      .from('hotel_survey_responses')
      .insert([surveyData])
      .select()

    if (dbError) {
      console.error('Error detallado de Supabase:', dbError)
      return NextResponse.json({ 
        error: 'Error en la base de datos', 
        details: dbError.message 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      message: 'Encuesta guardada con éxito',
      id: data?.[0]?.id 
    }, { status: 200 })

  } catch (error: any) {
    console.error('Error crítico en el servidor:', error)
    return NextResponse.json({ 
      error: 'Error interno del servidor',
      message: error.message 
    }, { status: 500 })
  }
}
