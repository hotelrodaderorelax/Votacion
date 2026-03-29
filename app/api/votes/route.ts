import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from "next/server"

// Keys directas para evitar el error de Vercel
const supabaseUrl = 'https://kfltdikdcxtombnwalxj.supabase.co'
const supabaseAnonKey = 'sb_publishable_hW2Wfpw46rvONH8Fg_kW9A_RP7L1GcA'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      employee_id, voter_identifier, friendliness, efficiency, 
      problem_solving, cleanliness, comment 
    } = body
    
    // Convertir a número para evitar errores de tipo
    const valFriendliness = Number(friendliness) || 0
    const valEfficiency = Number(efficiency) || 0
    const valProblemSolving = Number(problem_solving) || 0
    const valCleanliness = Number(cleanliness) || 0
    const overall_rating = (valFriendliness + valEfficiency + valProblemSolving + valCleanliness) / 4
    
    // --- IMPORTANTE: Usar 'staff_votes' ---
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
    
    if (voteError) throw voteError
    
    return NextResponse.json({ success: true, vote })

  } catch (error: any) {
    console.error("Error en API:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
