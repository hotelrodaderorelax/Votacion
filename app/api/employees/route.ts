import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const supabase = createClient(
  'https://kfltdikdcxtombnwalxj.supabase.co',
  'sb_publishable_hW2Wfpw46rvONH8Fg_kW9A_RP7L1GcA'
)

// Función para convertir "ABRIL DE 2026" -> "2026-04"
function parseMonthParam(monthParam: string | null) {
  if (!monthParam) return null;
  
  const months: { [key: string]: string } = {
    'ENERO': '01', 'FEBRERO': '02', 'MARZO': '03', 'ABRIL': '04',
    'MAYO': '05', 'JUNIO': '06', 'JULIO': '07', 'AGOSTO': '08',
    'SEPTIEMBRE': '09', 'OCTUBRE': '10', 'NOVIEMBRE': '11', 'DICIEMBRE': '12'
  };

  try {
    const parts = monthParam.toUpperCase().split(' DE ');
    if (parts.length === 2) {
      const monthName = parts[0].trim();
      const year = parts[1].trim();
      const monthNum = months[monthName];
      if (monthNum) return `${year}-${monthNum}`;
    }
    return monthParam; // Si ya viene como YYYY-MM
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const rawMonth = searchParams.get('month')
    const formattedMonth = parseMonthParam(rawMonth) // Ahora es "2026-04"

    // 1. Obtener empleados
    const { data: emps, error: err } = await supabase
      .from('employees')
      .select('*')
      .order('name', { ascending: true })

    if (err) throw err

    // 2. Obtener votos con el mes corregido
    let votes: any[] = []
    if (formattedMonth) {
      const { data: vData, error: vErr } = await supabase
        .from('staff_votes')
        .select('employee_id, overall_rating')
        .like('created_at', `${formattedMonth}%`) // Busca "2026-04%"
      
      if (!vErr) votes = vData || []
    }

    // 3. Procesar resultados
    const result = (emps || []).map(e => {
      const employeeVotes = votes.filter(v => v.employee_id === e.id)
      const total = employeeVotes.length
      const avg = total > 0 
        ? employeeVotes.reduce((acc, curr) => acc + (curr.overall_rating || 0), 0) / total 
        : 0

      return {
        ...e,
        role: (e.role || "").toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
        total_votes: total,
        average_rating: Number(avg.toFixed(1))
      }
    })

    return NextResponse.json(result)

  } catch (error: any) {
    console.error("Error en API:", error.message)
    return NextResponse.json([])
  }
}
