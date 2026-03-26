import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from "next/server"

// Conexión directa usando las variables gestionadas por Vercel
const supabaseUrl = process.env.NEXT_PUBLIC_jnihjfbutwlrecwszzaj_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_jnihjfbutwlrecwszzaj_SUPABASE_ANON_KEY

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
    
    // Cálculo del promedio (aseguramos que sean números)
    const overall_rating = (Number(friendliness) + Number(efficiency) + Number(problem_solving) + Number(cleanliness)) / 4
    
    // 1. Insertar el voto en la tabla 'votes'
    const { data: vote, error: voteError } = await supabase
      .from("votes")
      .insert({
        employee_id,
        voter_identifier,
        friendliness,
        efficiency,
        problem_solving,
        cleanliness,
        overall_rating,
        comment
      })
      .select()
      .single()
    
    if (voteError) {
      // Error de voto duplicado (Constraint 23505)
      if (voteError.code === "23505") {
        return NextResponse.json(
          { error: "Ya has votado por este empleado" },
          { status: 400 }
        )
      }
      return NextResponse.json({ error: voteError.message }, { status: 500 })
    }
    
    // 2. Actualizar estadísticas en la tabla 'employees' (CORREGIDO EL NOMBRE)
    const { data: allVotes } = await supabase
      .from("votes")
      .select("overall_rating")
      .eq("employee_id", employee_id)
    
    if (allVotes && allVotes.length > 0) {
      const totalVotes = allVotes.length
      const sumRating = allVotes.reduce((sum, v) => sum + Number(v.overall_rating), 0)
      const avgRating = sumRating / totalVotes
      
      await supabase
        .from("employees") // Asegúrate de que en Supabase se llame así
        .update({
          total_votes: totalVotes,
          average_rating: parseFloat(avgRating.toFixed(2))
        })
        .eq("id", employee_id)
    }
    
    return NextResponse.json({ success: true, vote })
  } catch (error: any) {
    console.error("Error en POST /api/votes:", error)
    return NextResponse.json(
      { error: "Error al procesar el voto", details: error.message },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const employeeId = searchParams.get("employee_id")
  
  let query = supabase.from("votes").select("*")
  
  if (employeeId) {
    query = query.eq("employee_id", employeeId)
  }
  
  const { data: votes, error } = await query.order("created_at", { ascending: false })
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  return NextResponse.json(votes)
}
