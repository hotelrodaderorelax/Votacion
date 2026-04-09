import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabaseUrl = 'https://kfltdikdcxtombnwalxj.supabase.co'
const supabaseAnonKey = 'sb_publishable_hW2Wfpw46rvONH8Fg_kW9A_RP7L1GcA'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const monthParam = searchParams.get('month')

    // Si no hay mes, usamos el actual para que no de error 400 y cargue algo
    const currentMonth = monthParam || new Date().toISOString().slice(0, 7)

    // 1. OBTENER TODOS LOS EMPLEADOS (Esto asegura que salgan tus compañeros)
    const { data: allEmployees, error: empError } = await supabase
      .from('employees')
      .select('id, name, role, image_url')
      .order('name', { ascending: true })

    if (empError) throw empError

    // 2. RANGO DE FECHAS (Tu lógica del "truco" es buena)
    const startDate = `${currentMonth}-01T00:00:00Z`
    const dateObj = new Date(currentMonth + "-02")
    dateObj.setMonth(dateObj.getMonth() + 1)
    const endDate = dateObj.toISOString()

    // 3. TRAER VOTOS (gte = mayor o igual, lt = menor que)
    const { data: votes, error: votesError } = await supabase
      .from('staff_votes')
      .select('employee_id, overall_rating')
      .gte('created_at', startDate)
      .lt('created_at', endDate)

    if (votesError) throw votesError

    // 4. EL EQUILIBRIO: Mapeo con protección anti-errores
    const safeVotes = votes || []
    
    const result = (allEmployees || []).map(emp => {
      const empVotes = safeVotes.filter(v => v.employee_id === emp.id)
      const total = empVotes.length
      const avg = total > 0 
        ? empVotes.reduce((acc, curr) => acc + curr.overall_rating, 0) / total 
        : 0

      return {
        id: emp.id,
        name: emp.name || "Empleado",
        role: emp.role || "Staff",
        image_url: emp.image_url || null, // Si no tiene foto, el frontend debe manejar el null
        total_votes: total,
        average_rating: Number(avg.toFixed(1))
      }
    })

    return NextResponse.json(result)

  } catch (error: any) {
    console.error("Error en Dashboard:", error.message)
    // EL ESCUDO FINAL: Si algo falla arriba, devolvemos un array vacío 
    // en lugar de un error 500. Así el frontend nunca ve la pantalla blanca.
    return NextResponse.json([])
  }
}
