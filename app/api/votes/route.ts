import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  
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
    
    // Calculate overall rating
    const overall_rating = (friendliness + efficiency + problem_solving + cleanliness) / 4
    
    // Insert the vote
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
      if (voteError.code === "23505") {
        return NextResponse.json(
          { error: "Ya has votado por este empleado" },
          { status: 400 }
        )
      }
      return NextResponse.json({ error: voteError.message }, { status: 500 })
    }
    
    // Update employee stats
    const { data: allVotes } = await supabase
      .from("votes")
      .select("overall_rating")
      .eq("employee_id", employee_id)
    
    if (allVotes) {
      const totalVotes = allVotes.length
      const avgRating = allVotes.reduce((sum, v) => sum + Number(v.overall_rating), 0) / totalVotes
      
      await supabase
        .from("employees")
        .update({
          total_votes: totalVotes,
          average_rating: avgRating.toFixed(2)
        })
        .eq("id", employee_id)
    }
    
    return NextResponse.json({ success: true, vote })
  } catch (error) {
    return NextResponse.json(
      { error: "Error al procesar el voto" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const supabase = await createClient()
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
