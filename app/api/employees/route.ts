import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const supabase = createClient(
  'https://kfltdikdcxtombnwalxj.supabase.co',
  'sb_publishable_hW2Wfpw46rvONH8Fg_kW9A_RP7L1GcA'
)

// Función para convertir "ABRIL DE 2026" a un objeto de fechas que Supabase entienda
function getMonthRange(monthParam: string | null) {
  if (!monthParam) return null;

  const months: { [key: string]: number } = {
    'ENERO': 0, 'FEBRERO': 1, 'MARZO': 2, 'ABRIL': 3, 'MAYO': 4, 'JUNIO': 5,
    'JULIO': 6, 'AGOSTO': 7, 'SEPTIEMBRE': 8, 'OCTUBRE': 9, 'NOVIEMBRE': 10, 'DICIEMBRE': 11
  };

  try {
    const parts = monthParam.toUpperCase().split(' DE ');
    if (parts.length !== 2) return null;

    const monthName = parts[0].trim();
    const year = parseInt(parts[1].trim());
    const monthIndex = months[monthName];

    if (isNaN(year) || monthIndex === undefined) return null;

    const startDate = new Date(Date.UTC(year, monthIndex, 1));
    const endDate = new Date(Date.UTC(year, monthIndex + 1, 1));

    return {
      start: startDate.toISOString(),
      end: endDate.toISOString()
    };
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const rawMonth = searchParams.get('month') // Recibe "ABRIL DE 2026"
    const range = getMonthRange(rawMonth);

    // 1. Obtener empleados activos
    const { data: emps, error: err } = await supabase
      .from('employees')
      .select('*')
      .order('name', { ascending: true })

    if (err) throw err

    // 2. Obtener votos usando el rango de fechas de tu código anterior
    let votes: any[] = []
    if (range) {
      const { data: vData, error: vErr } = await supabase
        .from('staff_votes')
        .select('employee_id, overall_rating')
        .gte('created_at', range.start)
        .lt('created_at', range.end)
      
      if (!vErr) votes = vData || []
    }

    // 3. Mapear y normalizar (Lexilis quedará en su lugar por el order del paso 1)
    const result = (emps || []).map(e => {
      const empVotes = votes.filter(v => v.employee_id === e.id)
      const total = empVotes.length
      const avg = total > 0 
        ? empVotes.reduce((acc, curr) => acc + (curr.overall_rating || 0), 0) / total 
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
