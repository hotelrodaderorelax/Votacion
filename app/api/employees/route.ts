import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// 1. Definimos las nuevas variables de entorno estándar
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY

// 2. Validación de seguridad: Esto evita el error "supabaseUrl is required" 
// al detener la ejecución con un mensaje claro si las llaves no cargan.
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    `Faltan variables de entorno de Supabase. 
     Verifica que NEXT_PUBLIC_SUPABASE_URL y 
     NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY estén en Vercel.`
  )
}

// 3. Creamos el cliente con las variables validadas
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function GET() {
  try {
    // Usamos el nombre de tabla correcto 'employees' como definimos en el SQL
    const { data, error } = await supabase
      .from('employees') 
      .select('*')
      .order('name', { ascending: true })

    if (error) {
      console.error("Error de Supabase:", error.message)
      throw error
    }

    return NextResponse.json(data)
  } catch (error: any) {
    // Si hay un error 500, ahora nos dirá exactamente qué falló en los logs
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
