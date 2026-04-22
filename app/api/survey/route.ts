import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Configuración de Supabase
const supabaseUrl = 'https://kfltdikdcxtombnwalxj.supabase.co'
const supabaseAnonKey = 'sb_publishable_hW2Wfpw46rvONH8Fg_kW9A_RP7L1GcA'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Verificación de seguridad básica
    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json({ error: 'No se recibieron datos' }, { status: 400 })
    }

    /* MAPEO AUTOMÁTICO:
       Como los IDs del frontend (bienvenida, reg_rapido, etc.) 
       ahora coinciden exactamente con las columnas del SQL,
       podemos enviar el 'body' directamente.
    */
    const { data, error: dbError } = await supabase
      .from('hotel_survey_responses')
      .insert([body]) // Inserta el objeto directamente
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
    console.error('Error Interno:', error.message)
    return NextResponse.json({ 
      error: 'Error interno del servidor',
      message: error.message 
    }, { status: 500 })
  }
}
