import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabaseUrl = 'https://kfltdikdcxtombnwalxj.supabase.co'
const supabaseAnonKey = 'sb_publishable_hW2Wfpw46rvONH8Fg_kW9A_RP7L1GcA'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const monthParam = searchParams.get('month')
    
    // Si no viene mes, usamos el actual. Formato: YYYY-MM
    const currentMonth = monthParam || new Date().toISOString().slice(0, 7)

    // 1. Traer empleados básicos
    const { data: employees, error: empError } = await supabase
      .from('employees')
      .select('id, name, role, image_url')
    
    if (empError) throw empError

    // 2. Traer votos filtrados por mes de forma sencilla
    // Usamos .like() en created_at para que coincida con "YYYY-MM-..."
    const { data: votes, error: votesError } = await supabase
      .from('staff_votes')
      .select('employee_id, overall_rating')
      .like('created_at', `${currentMonth}%`)

    if (votesError) throw votesError

    // 3. Procesado SEGURO
    const safeEmployees = employees || []
    const safeVotes = votes || []

    const result = safeEmployees.map(emp => {
      const empVotes = safeVotes.filter(v => v.employee_id === emp.id)
      const total = empVotes.length
      const avg = total > 0 
        ? empVotes.reduce((acc, curr) => acc + curr.overall_rating, 0) / total 
        : 0

      return {
        id: emp.id,
        name: emp.name || "Empleado",
        role: emp.role || "Staff",
        image_url: emp.image_url || null,
        total_votes: total,
        average_rating: Number(avg.toFixed(1)) // Redondeo para que sea visualmente limpio
      }
    })

    // IMPORTANTE: Retornamos el array procesado
    return NextResponse.json(result)

  } catch (error: any) {
    console.error("Error en API:", error.message)
    // CRÍTICO: Si algo falla, devolvemos un array vacío []
    // Esto evita el error "c is not iterable" en el frontend
    return NextResponse.json([])
  }
}
