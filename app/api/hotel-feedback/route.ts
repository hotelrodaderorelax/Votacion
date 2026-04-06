import { NextResponse } from 'next/server';

// Si usas una base de datos, aquí harías la consulta. 
// Por ahora, te dejo una estructura que coincide con lo que pide el Dashboard.
export async function GET() {
  try {
    // Ejemplo de datos manuales para probar que carguen:
    const hotelFeedbacks = [
      {
        id: 1,
        categoria: "Limpieza",
        puntuacion: 5,
        comentario: "Las habitaciones estaban impecables y el aroma del lobby es delicioso.",
        created_at: new Date().toISOString(),
      },
      {
        id: 2,
        categoria: "Atención",
        puntuacion: 4,
        comentario: "Muy buena disposición del personal, aunque el check-in fue un poco lento.",
        created_at: new Date().toISOString(),
      },
      {
        id: 3,
        categoria: "Infraestructura",
        puntuacion: 5,
        comentario: "La piscina y las áreas sociales están muy bien mantenidas.",
        created_at: new Date().toISOString(),
      }
    ];

    return NextResponse.json(hotelFeedbacks);
  } catch (error) {
    return NextResponse.json({ error: "Error cargando feedback" }, { status: 500 });
  }
}
