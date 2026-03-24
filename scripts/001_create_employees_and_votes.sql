-- Create employees table
CREATE TABLE IF NOT EXISTS public.employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  department TEXT NOT NULL,
  photo_url TEXT,
  total_votes INTEGER DEFAULT 0,
  average_rating DECIMAL(3,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create votes table to track individual ratings
CREATE TABLE IF NOT EXISTS public.votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  guest_identifier TEXT NOT NULL,
  amabilidad INTEGER NOT NULL CHECK (amabilidad >= 1 AND amabilidad <= 5),
  profesionalismo INTEGER NOT NULL CHECK (profesionalismo >= 1 AND profesionalismo <= 5),
  rapidez INTEGER NOT NULL CHECK (rapidez >= 1 AND rapidez <= 5),
  presentacion INTEGER NOT NULL CHECK (presentacion >= 1 AND presentacion <= 5),
  comunicacion INTEGER NOT NULL CHECK (comunicacion >= 1 AND comunicacion <= 5),
  average_rating DECIMAL(3,2) NOT NULL,
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(employee_id, guest_identifier)
);

-- Create satisfaction survey responses table
CREATE TABLE IF NOT EXISTS public.survey_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_identifier TEXT NOT NULL UNIQUE,
  -- Hotel perception (1-5 scale)
  limpieza INTEGER CHECK (limpieza >= 1 AND limpieza <= 5),
  comodidad INTEGER CHECK (comodidad >= 1 AND comodidad <= 5),
  ubicacion INTEGER CHECK (ubicacion >= 1 AND ubicacion <= 5),
  relacion_calidad_precio INTEGER CHECK (relacion_calidad_precio >= 1 AND relacion_calidad_precio <= 5),
  -- Areas satisfaction (1-5 scale)
  recepcion INTEGER CHECK (recepcion >= 1 AND recepcion <= 5),
  piscina INTEGER CHECK (piscina >= 1 AND piscina <= 5),
  bar INTEGER CHECK (bar >= 1 AND bar >= 1 AND bar <= 5),
  habitaciones INTEGER CHECK (habitaciones >= 1 AND habitaciones <= 5),
  -- Additional questions
  recomendaria BOOLEAN,
  sugerencias TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.survey_responses ENABLE ROW LEVEL SECURITY;

-- Policies for employees (everyone can read, only admins modify via service role)
CREATE POLICY "Anyone can view employees" ON public.employees FOR SELECT USING (true);

-- Policies for votes (everyone can insert their own vote, read all)
CREATE POLICY "Anyone can view votes" ON public.votes FOR SELECT USING (true);
CREATE POLICY "Anyone can insert votes" ON public.votes FOR INSERT WITH CHECK (true);

-- Policies for survey responses
CREATE POLICY "Anyone can view survey responses" ON public.survey_responses FOR SELECT USING (true);
CREATE POLICY "Anyone can insert survey responses" ON public.survey_responses FOR INSERT WITH CHECK (true);

-- Function to update employee statistics after a vote
CREATE OR REPLACE FUNCTION update_employee_stats()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.employees
  SET 
    total_votes = (SELECT COUNT(*) FROM public.votes WHERE employee_id = NEW.employee_id),
    average_rating = (SELECT ROUND(AVG(average_rating)::numeric, 2) FROM public.votes WHERE employee_id = NEW.employee_id),
    updated_at = NOW()
  WHERE id = NEW.employee_id;
  RETURN NEW;
END;
$$;

-- Trigger to auto-update employee stats
DROP TRIGGER IF EXISTS on_vote_inserted ON public.votes;
CREATE TRIGGER on_vote_inserted
  AFTER INSERT ON public.votes
  FOR EACH ROW
  EXECUTE FUNCTION update_employee_stats();

-- Insert sample employees
INSERT INTO public.employees (name, role, department, photo_url) VALUES
  ('María García', 'Recepcionista', 'Recepción', '/employees/maria.jpg'),
  ('Carlos Rodríguez', 'Bartender', 'Bar', '/employees/carlos.jpg'),
  ('Ana Martínez', 'Camarera de pisos', 'Housekeeping', '/employees/ana.jpg'),
  ('Luis Hernández', 'Salvavidas', 'Piscina', '/employees/luis.jpg'),
  ('Sofia Pérez', 'Recepcionista', 'Recepción', '/employees/sofia.jpg'),
  ('Diego López', 'Chef', 'Cocina', '/employees/diego.jpg')
ON CONFLICT DO NOTHING;
