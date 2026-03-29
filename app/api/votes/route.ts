import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from "next/server"

// Cambia estas líneas en /app/api/votes/route.ts
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

const supabase = createClient(supabaseUrl!, supabaseAnonKey!)

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
    
    // --- CAMBIO CLAVE 1: Convertir TODO a número inmediatamente ---
    // Esto evita el error "expression is of type text" en Supabase
    const valFriendliness = Number(friendliness) || 0
    const valEfficiency = Number(efficiency) || 0
    const valProblemSolving = Number(problem_solving) || 0
    const valCleanliness = Number(cleanliness) || 0

    // Cálculo del promedio numérico
    const overall_rating = (valFriendliness + valEfficiency + valProblemSolving + valCleanliness) / 4
    
    // 1. Insertar el voto en la tabla 'votes'
    const { data: vote, error: voteError } = await supabase
      .from("votes")
      .insert({
        employee_id,
        voter_identifier,
        friendliness: valFriendliness, // Enviamos el número convertido
        efficiency: valEfficiency,
        problem_solving: valProblemSolving,
        cleanliness: valCleanliness,
        overall_rating: overall_rating, // Enviamos el cálculo numérico
        comment: comment || ""
      })
      .select()
      .single()
    
    if (voteError) {
      console.error("Error al insertar voto:", voteError)
      if (voteError.code === "23505") {
        return NextResponse.json(
          { error: "Ya has votado por este empleado" },
          { status: 400 }
        )
      }
      return NextResponse.json({ error: voteError.message }, { status: 500 })
    }
    
    // 2. Actualizar estadísticas en la tabla 'employees'
    const { data: allVotes, error: fetchError } = await supabase
      .from("votes")
      .select("overall_rating")
      .eq("employee_id", employee_id)
    
    if (fetchError) console.error("Error al obtener votos para promedio:", fetchError)

    if (allVotes && allVotes.length > 0) {
      const totalVotes = allVotes.length
      const sumRating = allVotes.reduce((sum, v) => sum + Number(v.overall_rating), 0)
      const avgRating = sumRating / totalVotes
      
      // --- CAMBIO CLAVE 2: Forzar formato numérico en el update ---
      const { error: updateError } = await supabase
        .from("employees")
        .update({
          total_votes: totalVotes,
          average_rating: parseFloat(avgRating.toFixed(2)) // Asegura que sea un número de 2 decimales
        })
        .eq("id", employee_id)

      if (updateError) console.error("Error al actualizar empleado:", updateError)
    }
    
    return NextResponse.json({ success: true, vote })

  } catch (error: any) {
    console.error("Error crítico en API Votes:", error)
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
    
    let query = supabase.from("votes").select("*")
    
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
