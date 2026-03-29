import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from "next/server"

// --- CONFIGURACIÓN DIRECTA ---
// Pegamos las keys aquí para que Vercel no falle al compilar
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
    
    // Convertir a número para evitar errores de tipo en la DB
    const valFriendliness = Number(friendliness) || 0
    const valEfficiency = Number(efficiency) || 0
    const valProblemSolving = Number(problem_solving) || 0
    const valCleanliness = Number(cleanliness) || 0

    // Cálculo del promedio numérico
    const overall_rating = (valFriendliness + valEfficiency + valProblemSolving + valCleanliness) / 4
    
    // 1. Insertar el voto en la tabla 'staff_votes' (Asegúrate que el nombre sea este en Supabase)
    const { data: vote, error: voteError } = await supabase
      .from("staff_votes")
      .insert({
        employee_id,
        voter_identifier,
        friendliness: valFriendliness,
        efficiency: valEfficiency,
        problem_solving: valProblemSolving,
        cleanliness: valCleanliness,
        overall_rating: overall_rating,
        comment: comment || ""
      })
      .select()
      .single()
    
    if (voteError) {
      console.error("Error al insertar voto:", voteError.message)
      // Error 23505 es por voto duplicado si tienes una restricción UNIQUE
      if (voteError.code === "23505") {
        return NextResponse.json(
          { error: "Ya has votado por este empleado" },
          { status: 400 }
        )
      }
      return NextResponse.json({ error: voteError.message }, { status: 500 })
    }
    
    // 2. Opcional: Actualizar estadísticas en la tabla 'employees'
    // Solo si añadiste las columnas 'total_votes' y 'average_rating' a esa tabla
    const { data: allVotes } = await supabase
      .from("staff_votes")
      .select("overall_rating")
      .eq("employee_id", employee_id)

    if (allVotes && allVotes.length > 0) {
      const totalVotes = allVotes.length
      const sumRating = allVotes.reduce((sum, v) => sum + Number(v.overall_rating), 0)
      const avgRating = sumRating / totalVotes
      
      await supabase
        .from("employees")
        .update({
          total_votes: totalVotes,
          average_rating: parseFloat(avgRating.toFixed(2))
        })
        .eq("id", employee_id)
    }
    
    return NextResponse.json({ success: true, vote })

  } catch (error: any) {
    return NextResponse.json(
      { error: "Error al procesar el voto", details: error.message },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const employeeId = searchParams.get("employee_id")
    
    let query = supabase.from("staff_votes").select("*")
    
    if (employeeId) {
      query = query.eq("employee_id", employeeId)
    }
    
    const { data: votes, error } = await query.order("created_at", { ascending: false })
    
    if (error) throw error
    
    return NextResponse.json(votes)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
