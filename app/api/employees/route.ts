import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Crucial para que Vercel no cachee los resultados y el filtro por mes funcione siempre
export const dynamic = 'force-dynamic'

const supabase = createClient(
  'https://kfltdikdcxtombnwalxj.supabase.co',
  'sb_publishable_hW2Wfpw46rvONH8Fg_kW9A_RP7L1GcA'
)

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const month = searchParams.get('month') // Ejemplo: "2026-04"

    // 1. OBTENER EMPLEADOS ORDENADOS ALFABÉTICAMENTE
    // Lexilis quedará en el medio automáticamente por orden de nombre
    const { data: emps, error: err } = await supabase
      .from('employees')
      .select('*')
      .order('name', { ascending: true })

    if (err) throw err

    // 2. OBTENER VOTOS DEL MES
    let votes: any[] = []
    if (month) {
      // Usamos .like para capturar todo el mes sin importar la hora/minuto
      const { data: vData, error: vErr } = await supabase
        .from('staff_votes')
        .select('employee_id, overall_rating')
        .like('created_at', `${month}%`)
      
      if (vErr) throw vErr
      votes = vData || []
    }

    // 3. PROCESAR Y NORMALIZAR DATOS
    const result = (emps || []).map(e => {
      // Filtramos los votos que pertenecen a este empleado específico
      const employeeVotes = votes.filter(v => v.employee_id === e.id)
      const total = employeeVotes.length
      
      // Calculamos el promedio de forma segura
      const avg = total > 0 
        ? employeeVotes.reduce((acc, curr) => acc + (curr.overall_rating || 0), 0) / total 
        : 0

      // Normalización de Roles (Manejo de tildes y mayúsculas para el Dashboard)
      const rawRole = (e.role || "").toUpperCase()
      const cleanRole = rawRole.normalize("NFD").replace(/[\u0300-\u036f]/g, "")

      return {
        ...e,
        role: cleanRole, // Devuelve "RECEPCION", "CAMARERIA", etc.
        total_votes: total,
        average_rating: Number(avg.toFixed(1))
      }
    })

    return NextResponse.json(result)

  } catch (error: any) {
    console.error("Error detallado en la API:", error.message)
    // Devolvemos un array vacío para evitar que el Dashboard se quede en blanco
    return NextResponse.json([])
  }
}
