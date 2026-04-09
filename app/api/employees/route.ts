import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabaseUrl = 'https://kfltdikdcxtombnwalxj.supabase.co'
const supabaseAnonKey = 'sb_publishable_hW2Wfpw46rvONH8Fg_kW9A_RP7L1GcA'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const monthParam = searchParams.get('month')

    // 1. OBTENER EMPLEADOS (Sin filtros, para asegurar que salgan todos)
    const { data: employees, error: empError } = await supabase
      .from('employees')
      .select('*')
    
    if (empError) {
      console.error("Error cargando empleados:", empError.message)
      return NextResponse.json([]) // Si falla la tabla, enviamos lista vacía para no romper el front
    }

    if (!employees || employees.length === 0) {
      console.log("La tabla employees está vacía en Supabase")
      return NextResponse.json([])
    }

    // 2. LÓGICA DE VOTOS (Opcional y protegida)
    let votes: any[] = []
    if (monthParam) {
      const startDate = `${monthParam}-01T00:00:00Z`
      // Usamos una lógica de fecha más simple para evitar el error 400
      const { data: votesData } = await supabase
        .from('staff_votes')
        .select('employee_id, overall_rating')
        .gte('created_at', startDate)
        .lte('created_at', `${monthParam}-31T23:59:59Z`)
      
      votes = votesData || []
    }

    // 3. CONSTRUIR RESPUESTA (Asegurando que cada campo tenga un valor)
    const finalData = employees.map(emp => {
      const empVotes = votes.filter(v => v.employee_id === emp.id)
      return {
        id: emp.id,
        name: emp.name || "Sin nombre",
        role: emp.role || "Staff",
        image_url: emp.image_url || null,
        total_votes: empVotes.length,
        average_rating: empVotes.length > 0 
          ? Number((empVotes.reduce((acc, v) => acc + v.overall_rating, 0) / empVotes.length).toFixed(1)) 
          : 0
      }
    })

    return NextResponse.json(finalData)

  } catch (err: any) {
    console.error("Falla total en la API:", err.message)
    return NextResponse.json([]) // Siempre retornar un array para evitar 'not iterable'
  }
}
