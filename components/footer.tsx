import { MapPin, Phone, Mail, Instagram, Facebook } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Logo and description */}
          <div>
            <div className="flex items-center gap-2">
              <svg
                width="32"
                height="32"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-primary"
              >
                <path
                  d="M20 5C20 5 22 8 22 12C22 16 20 18 20 18C20 18 18 16 18 12C18 8 20 5 20 5Z"
                  fill="currentColor"
                />
                <path
                  d="M20 18C20 18 26 14 30 16C34 18 35 22 35 22C35 22 31 20 27 20C23 20 20 22 20 22V18Z"
                  fill="currentColor"
                />
                <path
                  d="M20 18C20 18 14 14 10 16C6 18 5 22 5 22C5 22 9 20 13 20C17 20 20 22 20 22V18Z"
                  fill="currentColor"
                />
                <path
                  d="M20 22V35"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <div className="flex flex-col">
                <span className="font-serif text-lg font-semibold text-foreground">
                  Rodadero Relax
                </span>
                <span className="text-[9px] uppercase tracking-widest text-muted-foreground">
                  Hotel
                </span>
              </div>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Tu oasis de tranquilidad en el corazón del Rodadero. 
              Disfruta de nuestras instalaciones y la calidez de nuestro equipo.
            </p>
          </div>

          {/* Contact info */}
          <div>
            <h4 className="font-semibold text-foreground">Contacto</h4>
            <ul className="mt-4 space-y-3">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary" />
                <span>El Rodadero, Santa Marta, Colombia</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 text-primary" />
                <span>+57 300 123 4567</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 text-primary" />
                <span>info@rodaderorelax.com</span>
              </li>
            </ul>
          </div>

          {/* Social media */}
          <div>
            <h4 className="font-semibold text-foreground">Síguenos</h4>
            <div className="mt-4 flex gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Hotel Rodadero Relax. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
