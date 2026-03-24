import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  
  try {
    const body = await request.json()
    
    const { data, error } = await supabase
      .from("survey_responses")
      .insert(body)
      .select()
      .single()
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({ success: true, data })
  } catch (error) {
    return NextResponse.json(
      { error: "Error al guardar la encuesta" },
      { status: 500 }
    )
  }
}

export async function GET() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("survey_responses")
    .select("*")
    .order("created_at", { ascending: false })
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  return NextResponse.json(data)
}
