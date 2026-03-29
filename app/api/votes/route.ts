import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from "next/server"

// Credenciales directas para evitar errores de conexión en Vercel
const supabaseUrl = 'https://kfltdikdcxtombnwalxj.supabase.co'
const supabaseAnonKey = 'sb_publishable_hW2Wfpw46rvONH8Fg_kW9A_RP7L1GcA'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      employee_id, 
      voter_identifier, 
      friendliness, 
      efficiency, 
      problem_solving, 
      cleanliness, 
      comment 
    } = body

    // 1. Convertir entradas a números y asegurar que no sean nulos (Evita Error 500)
    const valFriendliness = Number(friendliness) || 0
    const valEfficiency = Number(efficiency) || 0
    const valProblemSolving = Number(problem_solving) || 0
    const valCleanliness = Number(cleanliness) || 0

    // 2. Calcular el promedio de forma segura
    const calculatedRating = (valFriendliness + valEfficiency + valProblemSolving + valCleanliness) / 4
    const finalOverallRating = isNaN(calculatedRating) ? 0 : calculatedRating

    // 3. Insertar en la tabla 'staff_votes' (nombre corregido)
    const { data: vote, error: voteError } = await supabase
      .from("staff_votes")
      .insert([
        {
          employee_id: employee_id,
          voter_identifier: voter_identifier || "anonimo",
          friendliness: valFriendliness,
          efficiency: valEfficiency,
          problem_solving: valProblemSolving,
          cleanliness: valCleanliness,
          overall_rating: finalOverallRating, // Envía el valor calculado
          comment: comment || ""
        }
      ])
      .select()
      .single()

    // Si Supabase devuelve un error, lo lanzamos al bloque catch
    if (voteError) throw voteError

    return NextResponse.json({ success: true, vote })

  } catch (error: any) {
    // Este log aparecerá en Vercel si algo falla
    console.error("Error detallado en API Votes:", error.message)
    return NextResponse.json(
      { error: error.message || "Error interno del servidor" }, 
      { status: 500 }
    )
  }
}
