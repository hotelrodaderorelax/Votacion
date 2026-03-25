"use client"

import { MapPin, Phone, Mail, Instagram, Facebook } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-white border-t border-slate-100 pt-16 pb-8">
      <div className="container px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Logo y Eslogan */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
               <img src="/logo.png" alt="Logo Rodadero Relax" className="h-10 w-auto" />
               <span className="font-serif text-xl font-bold text-[#2878a8]">Rodadero Relax</span>
            </div>
            <p className="text-slate-500 leading-relaxed">
              Tu oasis de tranquilidad en el corazón del Rodadero. Disfruta de nuestras instalaciones y la calidez de nuestro equipo.
            </p>
          </div>

          {/* Datos de Contacto */}
          <div className="space-y-4">
            <h4 className="font-black uppercase text-[11px] tracking-widest text-slate-400">Contacto</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-slate-600">
                <MapPin className="h-5 w-5 text-[#f5ac0a] shrink-0" />
                <span>Calle 15 1A - 30 Rodadero, Santa Marta, Colombia</span>
              </li>
              <li className="flex items-center gap-3 text-slate-600">
                <Phone className="h-5 w-5 text-[#f5ac0a] shrink-0" />
                <span>+57 310 5938507</span>
              </li>
              <li className="flex items-center gap-3 text-slate-600">
                <Mail className="h-5 w-5 text-[#f5ac0a] shrink-0" />
                <span>info@rodaderorelax.com</span>
              </li>
            </ul>
          </div>

          {/* Redes Sociales con Enlaces Reales */}
          <div className="space-y-4">
            <h4 className="font-black uppercase text-[11px] tracking-widest text-slate-400">Síguenos</h4>
            <div className="flex gap-4">
              <Link 
                href="https://www.instagram.com/hotelrodaderorelax/?hl=es" 
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-[#E1306C] hover:text-white transition-all shadow-sm"
              >
                <Instagram className="h-5 w-5" />
              </Link>
              <Link 
                href="https://www.facebook.com/quieroviajarcol/videos/-gran-promo-en-el-mes-del-padre-haz-que-pap%C3%A1-cambie-la-rutina-por-la-brisa-del-m/1417258379519263/" 
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-[#1877F2] hover:text-white transition-all shadow-sm"
              >
                <Facebook className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-50 pt-8 text-center text-slate-400 text-sm font-medium">
          © {new Date().getFullYear()} Hotel Rodadero Relax. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  )
}
