import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: employees, error } = await supabase
      .from("employees")
      .select("*")
      .order("average_rating", { ascending: false })

    if (error) {
      console.error(error)
      return NextResponse.json([], { status: 500 }) // Devolvemos array vacío si falla
    }
    
    return NextResponse.json(employees || []) // Siempre asegurar que sea un array
  } catch (err) {
    return NextResponse.json([], { status: 500 })
  }
}
