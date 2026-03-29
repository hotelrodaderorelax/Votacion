import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from "next/server"

// Conexión directa para evitar errores de variables de entorno en Vercel
const supabaseUrl = 'https://kfltdikdcxtombnwalxj.supabase.co'
const supabaseAnonKey = 'sb_publishable_hW2Wfpw46rvONH8Fg_kW9A_RP7L1GcA'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    let { 
      employee_id, 
      voter_identifier, 
      friendliness, 
      efficiency, 
      problem_solving, 
      cleanliness, 
      comment 
    } = body

    // --- CORRECCIÓN DE ID (Seguro de vida) ---
    // Si el frontend envía el texto antiguo, lo cambiamos por el UUID real de Lexilis
    if (employee_id === "lexilis-01") {
      employee_id = "235250d9-d03b-4288-82c8-a0d53e3c7393"
    }

    // 1. FORZAR CONVERSIÓN A NÚMERO (Evita errores de tipos en la DB)
    const valFriendliness = Number(friendliness) || 0
    const valEfficiency = Number(efficiency) || 0
    const valProblemSolving = Number(problem_solving) || 0
    const valCleanliness = Number(cleanliness) || 0

    // 2. CÁLCULO DEL PROMEDIO
    const average = (valFriendliness + valEfficiency + valProblemSolving + valCleanliness) / 4
    const finalOverallRating = parseFloat(average.toFixed(2))

    // 3. INSERCIÓN EN LA TABLA 'staff_votes'
    const { data: vote, error: voteError } = await supabase
      .from("staff_votes")
      .insert([
        {
          employee_id: employee_id, // Aquí ya va el UUID correcto
          voter_identifier: voter_identifier || "anonimo",
          friendliness: valFriendliness,
          efficiency: valEfficiency,
          problem_solving: valProblemSolving,
          cleanliness: valCleanliness,
          overall_rating: finalOverallRating,
          comment: comment || ""
        }
      ])
      .select()
      .single()

    if (voteError) {
      console.error("Error de Supabase:", voteError.message)
      return NextResponse.json({ error: voteError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, vote })

  } catch (error: any) {
    console.error("Error crítico en API Votes:", error.message)
    return NextResponse.json(
      { error: error.message || "Error interno del servidor" }, 
      { status: 500 }
    )
  }
}

// Método GET para consultar votos (Opcional)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const employeeId = searchParams.get("employee_id")
    
    let query = supabase.from("staff_votes").select("*")
    if (employeeId) query = query.eq("employee_id", employeeId)
    
    const { data, error } = await query.order("created_at", { ascending: false })
    if (error) throw error
    
    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
