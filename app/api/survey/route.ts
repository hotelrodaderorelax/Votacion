import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// 1. Configuración de Supabase (Asegúrate de que no tengan el prefijo NEXT_PUBLIC_ dentro del string)
const supabaseUrl = 'https://kfltdikdcxtombnwalxj.supabase.co'
const supabaseAnonKey = 'sb_publishable_hW2Wfpw46rvONH8Fg_kW9A_RP7L1GcA'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // El componente envía el objeto directamente, no un array
    // Extraemos mejoras_sugerencias y el resto lo guardamos en 'answers'
    const { mejoras_sugerencias, ...answers } = body

    // 2. Verificación de seguridad básica
    if (!answers || Object.keys(answers).length === 0) {
      return NextResponse.json({ error: 'No se recibieron votos válidos' }, { status: 400 })
    }

    // 3. Mapeo dinámico basado en tu SQL
    // Esto toma cada ID enviado por el componente y lo prepara para la tabla
    const surveyData = {
      bienvenida_sentir: answers.bienvenida_sentir || null,
      registro_rapidez: answers.registro_rapidez || null,
      registro_amabilidad: answers.registro_amabilidad || null,
      registro_reserva_servicios: answers.registro_reserva_servicios || null,
      habitacion_limpieza: answers.habitacion_limpieza || null,
      habitacion_confort: answers.habitacion_confort || null,
      habitacion_baño_limpio: answers.habitacion_baño_limpio || null,
      habitacion_mobiliario: answers.habitacion_mobiliario || null,
      personal_limpieza_amable: answers.personal_limpieza_amable || null,
      personal_cocina_trato: answers.personal_cocina_trato || null,
      personal_resolucion_inquietudes: answers.personal_resolucion_inquietudes || null,
      alimento_calidad: answers.alimento_calidad || null,
      alimento_porcion: answers.alimento_porcion || null,
      alimento_variedad: answers.alimento_variedad || null,
      alimento_agilidad: answers.alimento_agilidad || null,
      alimento_presentacion: answers.alimento_presentacion || null,
      general_tranquilidad: answers.general_tranquilidad || null,
      general_recomendacion: answers.general_recomendacion || null,
      general_evaluacion: answers.general_evaluacion || null,
      mejoras_sugerencias: mejoras_sugerencias || 'Sin comentarios'
    }

    // 4. Inserción en Supabase
    const { data, error: dbError } = await supabase
      .from('hotel_survey_responses')
      .insert([surveyData])
      .select()

    if (dbError) {
      console.error('Error de Supabase:', dbError.message)
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
    return NextResponse.json({ 
      error: 'Error interno del servidor',
      message: error.message 
    }, { status: 500 })
  }
}
