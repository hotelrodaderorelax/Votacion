import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Mantenemos tus credenciales tal cual las tenías
const supabaseUrl = 'https://kfltdikdcxtombnwalxj.supabase.co'
const supabaseAnonKey = 'sb_publishable_hW2Wfpw46rvONH8Fg_kW9A_RP7L1GcA'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function GET() {
  try {
    // CAMBIO CLAVE: Consultamos 'employee_rankings' en lugar de 'employees'
    // Esto traerá total_votes y average_rating calculados en tiempo real
    const { data, error } = await supabase
      .from('employee_rankings') 
      .select('*')
      .order('name', { ascending: true })

    if (error) {
      console.error("Error de Supabase:", error.message)
      throw error
    }

    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
