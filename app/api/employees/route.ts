import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_jnihjfbutwlrecwszzaj_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_jnihjfbutwlrecwszzaj_SUPABASE_ANON_KEY!
)

export async function GET() {
  try {
    // CAMBIO AQUÍ: de 'employed' a 'employees'
    const { data, error } = await supabase
      .from('employees') 
      .select('*')
      .order('name', { ascending: true })

    if (error) throw error

    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
