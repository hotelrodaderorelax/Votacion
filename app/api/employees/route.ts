import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// En /app/api/employees/route.ts (y también en /api/votes/route.ts)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Faltan las variables de entorno de Supabase");
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);!
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
