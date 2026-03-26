import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

// 1. Manejador GET: Para evitar el error 405 si se accede a la ruta accidentalmente
export async function GET() {
  return NextResponse.json({ message: "Endpoint de encuestas activo" }, { status: 200 })
}

// 2. Tu manejador POST actual
export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    
    // Verificamos que los datos existan para evitar errores de undefined
    if (!body.ratings) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 })
    }

    const { error } = await supabase
      .from("hotel_survey_responses")
      .insert([
        {
          bienvenida_sentimiento: body.ratings[0],
          registro_rapidez: body.ratings[1],
          registro_amabilidad: body.ratings[2],
          registro_reserva_completa: body.ratings[3],
          habitacion_limpieza: body.ratings[4],
          habitacion_confort_cama: body.ratings[5],
          habitacion_baño_equipado: body.ratings[6],
          habitacion_mobiliario: body.ratings[7],
          personal_limpieza_amabilidad: body.ratings[8],
          personal_cocina_trato: body.ratings[9],
          personal_resolucion_inquietudes: body.ratings[10],
          alimento_calidad: body.ratings[11],
          alimento_porcion: body.ratings[12],
          alimento_variedad: body.ratings[13],
          alimento_agilidad: body.ratings[14],
          alimento_presentacion: body.ratings[15],
          general_tranquilidad: body.ratings[16],
          general_recomendacion: body.ratings[17],
          general_evaluacion_experiencia: body.ratings[18],
          feedback_mejoras: body.textFeedback,
        }
      ])

    if (error) throw error

    return NextResponse.json({ message: "Encuesta guardada con éxito" }, { status: 200 })
  } catch (err) {
    console.error("Error al guardar encuesta:", err)
    return NextResponse.json({ error: "No se pudo guardar la encuesta" }, { status: 500 })
  }
}
