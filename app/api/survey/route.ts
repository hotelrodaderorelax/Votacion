import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  'https://kfltdikdcxtombnwalxj.supabase.co',
  'sb_publishable_hW2Wfpw46rvONH8Fg_kW9A_RP7L1GcA'
)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Insertamos directamente el body porque ahora las llaves 
    // coinciden con las columnas que acabas de crear con el SQL de arriba
    const { data, error: dbError } = await supabase
      .from('hotel_survey_responses')
      .insert([body])
      .select()

    if (dbError) throw dbError

    return NextResponse.json({ message: 'Éxito' }, { status: 200 })
  } catch (error: any) {
    console.error('Error:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
